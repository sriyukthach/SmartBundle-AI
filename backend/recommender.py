from collections import Counter
from .data_loader import load_products, load_transactions


def get_bundle_recommendations(cart_product_ids, top_n=3):
    """
    Generate product bundle recommendations based on
    co-purchase frequency, stock availability and profit margin.
    """

    products = load_products()
    transactions = load_transactions()

    # Products already present in the cart
    cart_product_ids = set(cart_product_ids)

    # Find transactions containing products from the cart
    related_transactions = transactions[
        transactions["product_id"].isin(cart_product_ids)
    ]["transaction_id"].unique()

    # Find other products purchased in those transactions
    candidate_products = transactions[
        transactions["transaction_id"].isin(related_transactions)
        & ~transactions["product_id"].isin(cart_product_ids)
    ]

    # Count how frequently each candidate appears
    product_frequency = Counter(candidate_products["product_id"])

    recommendations = []

    for product_id, frequency in product_frequency.items():

        product = products[products["product_id"] == product_id]

        if product.empty:
            continue

        product = product.iloc[0]

        # Ignore products that are out of stock
        if product["stock"] <= 0:
            continue

        # Simple bundle score
        score = (
            frequency * 0.6
            + product["margin"] * 0.4
        )

        recommendations.append({
            "product_id": product["product_id"],
            "product_name": product["product_name"],
            "category": product["category"],
            "price": float(product["price"]),
            "stock": int(product["stock"]),
            "margin": float(product["margin"]),
            "co_purchase_frequency": frequency,
            "score": round(score, 3)
        })

    # Highest scoring products first
    recommendations.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return recommendations[:top_n]