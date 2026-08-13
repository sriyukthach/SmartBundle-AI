import pandas as pd
from pathlib import Path

# Get the project root directory
BASE_DIR = Path(__file__).resolve().parent.parent

# File paths
PRODUCTS_FILE = BASE_DIR / "data" / "products.csv"
TRANSACTIONS_FILE = BASE_DIR / "data" / "transactions.csv"


def load_products():
    """Load product information."""
    return pd.read_csv(PRODUCTS_FILE)


def load_transactions():
    """Load transaction data."""
    return pd.read_csv(TRANSACTIONS_FILE)


def get_product(product_id):
    """Get details of a specific product."""
    products = load_products()
    result = products[products["product_id"] == product_id]

    if result.empty:
        return None

    return result.iloc[0].to_dict()