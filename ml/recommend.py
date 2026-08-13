import json
import os
from collections import defaultdict

def load_data():
    """Reads product catalog and transaction data from JSON files."""
    base_path = os.path.dirname(__file__)
    
    # Try resolving path to root 'data' directory or local directory
    possible_product_paths = [
        os.path.abspath(os.path.join(base_path, '..', 'data', 'products.json')),
        os.path.join(base_path, 'products.json'),
        os.path.abspath(os.path.join(base_path, '..', 'products.json'))
    ]
    possible_transaction_paths = [
        os.path.abspath(os.path.join(base_path, '..', 'data', 'transactions.json')),
        os.path.join(base_path, 'transactions.json'),
        os.path.abspath(os.path.join(base_path, '..', 'transactions.json'))
    ]

    products_path = next((p for p in possible_product_paths if os.path.exists(p)), None)
    transactions_path = next((t for t in possible_transaction_paths if os.path.exists(t)), None)

    if not products_path or not transactions_path:
        return {}, []

    with open(products_path, 'r') as f:
        raw_products = json.load(f)
        # Normalize all product keys to string IDs
        products = {str(p.get('id', p.get('product_id'))): p for p in raw_products}
        
    with open(transactions_path, 'r') as f:
        raw_tx = json.load(f)
        transactions = []
        for tx in raw_tx:
            items = [str(i) for i in tx.get('items', [])]
            transactions.append({'items': items})
        
    return products, transactions

def get_bundle_recommendations(cart_item_ids, top_n=2):
    """
    Dynamically recommends products based on cart contents, 
    co-purchase frequency, logical category context, profit margin, and stock.
    """
    products, transactions = load_data()
    
    # Convert input IDs to string set for consistent comparison
    cart_set = {str(pid).strip() for pid in cart_item_ids}
    
    if not products:
        return []

    # Get details of items currently in cart
    cart_items_info = [products[pid] for pid in cart_set if pid in products]
    
    # 1. Compute Co-occurrence Frequency in Transactions
    co_occurrence = defaultdict(int)

    for tx in transactions:
        tx_items = set(tx['items'])
        if cart_set.intersection(tx_items):
            for item in tx_items:
                if item not in cart_set and item in products:
                    co_occurrence[item] += 1

    # 2. Candidate Selection Strategy
    candidates = []
    
    # Strategy A: Use co-occurrence matches if found in transactions
    if co_occurrence:
        candidates = list(co_occurrence.keys())
    
    # Strategy B: Logical fallback based on cart context
    if not candidates:
        cart_categories = {item.get('category') for item in cart_items_info if item.get('category')}
        cart_names_lower = [item.get('name', '').lower() for item in cart_items_info]

        is_desk_accessory = any(
            any(kw in name for kw in ['laptop', 'stand', 'mouse', 'keyboard', 'hub', 'sleeve', 'cable', 'phone'])
            for name in cart_names_lower
        )
        is_camera = any('camera' in name or 'dslr' in name for name in cart_names_lower)

        for pid, p in products.items():
            if pid in cart_set:
                continue
            
            p_name = p.get('name', '').lower()
            p_cat = p.get('category', '')

            if is_camera:
                if 'card' in p_name or 'bag' in p_name or 'tripod' in p_name:
                    candidates.append(pid)
            elif is_desk_accessory:
                # Filter out expensive gear like DSLR Cameras for basic accessories
                if 'camera' not in p_name and 'dslr' not in p_name:
                    if p_cat in cart_categories or any(kw in p_name for kw in ['mouse', 'keyboard', 'hub', 'sleeve', 'cable', 'stand']):
                        candidates.append(pid)
            else:
                if p_cat in cart_categories:
                    candidates.append(pid)

    # Strategy C: Final safeguard candidate pool
    if not candidates:
        candidates = [pid for pid in products if pid not in cart_set]

    # 3. Calculate Weighted Scores (Affinity + Margin + Stock + Price Guardrail)
    scored_products = []
    max_freq = max(co_occurrence.values()) if co_occurrence else 1

    for item_id in candidates:
        product = products[item_id]
        p_name = product.get('name', '').lower()

        affinity_score = (co_occurrence[item_id] / max_freq) if co_occurrence else 0.5
        margin_score = float(product.get('profit_margin', 0.3))
        stock_score = 1.0 if float(product.get('stock', 10)) > 5 else 0.2
        
        # Price-gap penalty (Prevents recommending ₹45,000 camera for a ₹1,499 stand)
        price_penalty = 1.0
        if any('stand' in item.get('name', '').lower() or 'mouse' in item.get('name', '').lower() for item in cart_items_info):
            if 'camera' in p_name or float(product.get('price', 0)) > 10000:
                price_penalty = 0.05

        final_score = ((0.5 * affinity_score) + (0.3 * margin_score) + (0.2 * stock_score)) * price_penalty
        
        scored_products.append({
            "product_id": str(product.get('id', product.get('product_id'))),
            "name": product.get('name'),
            "price": product.get('price'),
            "category": product.get('category'),
            "profit_margin": product.get('profit_margin', 0.3),
            "score": round(final_score, 2),
            "image": product.get('image', 'https://via.placeholder.com/150')
        })

    scored_products.sort(key=lambda x: x['score'], reverse=True)
    return scored_products[:top_n]