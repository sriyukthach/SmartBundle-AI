import pandas as pd
from backend.data_loader import load_products

# Quick Rule-Based Mapping for Demo Safety & Logical Bundles
RECOMMENDATION_MAP = {
    # Accessories / Tech
    "P004": ["P001", "P002", "P008"],  # USB-C Hub -> Mouse, Keyboard, Cable
    "P001": ["P002", "P003"],          # Mouse -> Keyboard, Laptop Stand
    "P003": ["P002", "P004"],          # Laptop Stand -> Keyboard, USB-C Hub
    
    # Primary Demo Scenario (Camera Gear)
    "P101": ["P102", "P103"],          # DSLR Camera -> Memory Card, Camera Bag
}


def get_bundle_recommendations(cart_product_ids: list[str]):
    # 1. Load products data
    products_df = load_products()

    # 2. Filter out out-of-stock items (stock > 0)
    available_products = products_df[products_df["stock"] > 0].copy()

    # Clean cart IDs input
    cart_set = set(str(pid).strip() for pid in cart_product_ids)

    # 3. Collect mapped target recommendations
    rec_ids = []
    for item_id in cart_set:
        if item_id in RECOMMENDATION_MAP:
            rec_ids.extend(RECOMMENDATION_MAP[item_id])

    # Deduplicate targets & filter out items already in cart
    target_ids = []
    for rid in rec_ids:
        if rid not in cart_set and rid not in target_ids:
            target_ids.append(rid)

    recommendations = []

    # 4. Fetch matching product details from stock-filtered DataFrame
    if target_ids:
        for tid in target_ids:
            matched = available_products[
                available_products["product_id"].astype(str) == tid
            ]
            if not matched.empty:
                item = matched.iloc[0]
                recommendations.append({
                    "product_id": str(item["product_id"]),
                    "name": str(item["product_name"]),
                    "price": float(item["price"]),
                    "category": str(item["category"]),
                    "profit_margin": float(item["margin"]),
                    "score": 0.95 if tid in ["P102", "P103"] else 0.85,
                    "image": "https://via.placeholder.com/150"
                })

    # 5. Fallback: Pick highest profit margin items if no rule matched
    if not recommendations:
        remaining = available_products[
            ~available_products["product_id"].astype(str).isin(cart_set)
        ]
        top_items = remaining.sort_values(by="margin", ascending=False).head(2)

        for _, item in top_items.iterrows():
            recommendations.append({
                "product_id": str(item["product_id"]),
                "name": str(item["product_name"]),
                "price": float(item["price"]),
                "category": str(item["category"]),
                "profit_margin": float(item["margin"]),
                "score": round(float(item["margin"]), 2),
                "image": "https://via.placeholder.com/150"
            })

    return recommendations