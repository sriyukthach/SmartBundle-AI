import json
import os
from collections import defaultdict

def load_data():
    """Reads product catalog and transaction data from JSON files."""
    base_path = os.path.dirname(__file__)
    
    products_path = os.path.join(base_path, 'products.json')
    transactions_path = os.path.join(base_path, 'transactions.json')
    
    with open(products_path, 'r') as f:
        products = {p['id']: p for p in json.load(f)}
        
    with open(transactions_path, 'r') as f:
        transactions = json.load(f)
        
    return products, transactions

def get_bundle_recommendations(cart_item_ids, top_n=2):
    """
    Dynamically recommends products based on cart contents, 
    co-purchase frequency, profit margin, and inventory levels.
    """
    products, transactions = load_data()
    total_cart_items = set(cart_item_ids)
    
    # 1. Compute Co-occurrence Frequency based on active cart
    co_occurrence = defaultdict(int)

    for tx in transactions:
        tx_items = set(tx['items'])
        # Check if any cart item is in the transaction
        if total_cart_items.intersection(tx_items):
            for item in tx_items:
                # Do not recommend items already in the cart
                if item not in total_cart_items and item in products:
                    co_occurrence[item] += 1

    # Fallback: If no co-occurrence found, pick top high-margin items not in cart
    if not co_occurrence:
        candidates = [p_id for p_id in products if p_id not in total_cart_items]
    else:
        candidates = list(co_occurrence.keys())

    # 2. Score Candidates (Affinity Score + Profit Margin + Stock Level)
    scored_products = []
    max_freq = max(co_occurrence.values()) if co_occurrence else 1

    for item_id in candidates:
        product = products[item_id]
        
        # Calculate scores
        affinity_score = co_occurrence[item_id] / max_freq if co_occurrence else 0.5
        margin_score = product['profit_margin']  # e.g., 0.40
        stock_score = 1.0 if product['stock'] > 5 else 0.2  # Penalty for low stock
        
        # Weighted Final Score Formula
        # 50% Customer Affinity | 30% Profit Margin | 20% Inventory Health
        final_score = (0.5 * affinity_score) + (0.3 * margin_score) + (0.2 * stock_score)
        
        scored_products.append({
            "product_id": product['id'],
            "name": product['name'],
            "price": product['price'],
            "category": product['category'],
            "profit_margin": product['profit_margin'],
            "score": round(final_score, 2),
            "image": product['image']
        })

    # Sort descending by score
    scored_products.sort(key=lambda x: x['score'], reverse=True)
    
    return scored_products[:top_n]


# ==========================================
# LOCAL TEST CASES (Run this file directly)
# ==========================================
if __name__ == "__main__":
    print("=" * 50)
    print("Testing SmartBundle AI Recommendation Engine")
    print("=" * 50)

    # Test Case 1: Camera in cart
    cart_1 = ["P001"]
    print(f"\n🛒 Cart: {cart_1} (Pro DSLR Camera)")
    print("💡 Dynamic Recommendations:")
    print(json.dumps(get_bundle_recommendations(cart_1), indent=2))

    # Test Case 2: Laptop in cart
    cart_2 = ["P005"]
    print(f"\n🛒 Cart: {cart_2} (Ultra Slim Laptop)")
    print("💡 Dynamic Recommendations:")
    print(json.dumps(get_bundle_recommendations(cart_2), indent=2))