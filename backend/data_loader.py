import os
import pandas as pd

def load_products():
    """
    Loads products from CSV and creates key aliases (name, title, product_name, id, product_id)
    so the frontend React component renders product names instantly regardless of property naming.
    """
    possible_paths = [
        "data/products.csv",
        "backend/data/products.csv",
        "../data/products.csv",
        "products.csv"
    ]
    
    csv_path = None
    for p in possible_paths:
        if os.path.exists(p):
            csv_path = p
            break

    if not csv_path:
        return pd.DataFrame()

    df = pd.read_csv(csv_path)
    df = df.fillna("")

    # Automatically map title/name aliases to prevent blank cards
    if "name" in df.columns:
        df["title"] = df["name"]
        df["product_name"] = df["name"]
    elif "title" in df.columns:
        df["name"] = df["title"]
        df["product_name"] = df["title"]

    if "product_id" in df.columns:
        df["id"] = df["product_id"]
    elif "id" in df.columns:
        df["product_id"] = df["id"]

    if "image" in df.columns:
        df["imageUrl"] = df["image"]
        df["image_url"] = df["image"]

    return df

def get_product(product_id: str):
    df = load_products()
    if df.empty:
        return None
    match = df[(df["product_id"].astype(str) == str(product_id)) | (df["id"].astype(str) == str(product_id))]
    if not match.empty:
        return match.iloc[0].to_dict()
    return None