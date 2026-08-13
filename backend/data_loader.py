import os
import pandas as pd

def load_products():
    """Loads all products from the CSV file."""
    base_path = os.path.dirname(__file__)
    csv_path = os.path.abspath(os.path.join(base_path, '..', 'data', 'products.csv'))
    
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        return df
    return pd.DataFrame()

def get_product(product_id):
    """Finds and returns a single product by ID."""
    df = load_products()
    if not df.empty:
        # Match string or integer product IDs cleanly
        match = df[df['product_id'].astype(str) == str(product_id)]
        if not match.empty:
            return match.iloc[0].to_dict()
    return None