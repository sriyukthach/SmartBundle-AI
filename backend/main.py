from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from .data_loader import load_products, get_product
from ml.recommend import get_bundle_recommendations


# --------------------------------
# FastAPI Application
# --------------------------------

app = FastAPI(
    title="SmartBundle AI",
    description="AI-powered cart-aware product bundling API",
    version="1.0.0"
)

# --------------------------------
# CORS Middleware (Allows Frontend Access)
# --------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin (e.g. React frontend)
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)


# --------------------------------
# Request Models
# --------------------------------

class CartRequest(BaseModel):
    cart_product_ids: List[str]


# --------------------------------
# Root Endpoint
# --------------------------------

@app.get("/")
def root():
    return {
        "message": "SmartBundle AI API is running",
        "status": "success"
    }


# --------------------------------
# Get All Products
# --------------------------------

@app.get("/products")
def get_products():
    products = load_products()
    return products.to_dict(orient="records")


# --------------------------------
# Get Single Product
# --------------------------------

@app.get("/products/{product_id}")
def get_single_product(product_id: str):
    product = get_product(product_id)

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# --------------------------------
# Get AI Recommendations
# --------------------------------

@app.post("/recommend")
def get_recommendations(request: CartRequest):
    if not request.cart_product_ids:
        raise HTTPException(
            status_code=400,
            detail="Cart cannot be empty"
        )

    # Load available products
    products = load_products()

    # Get valid product IDs
    valid_product_ids = set(products["product_id"].astype(str))

    # Check for invalid IDs
    invalid_ids = [
        product_id
        for product_id in request.cart_product_ids
        if product_id not in valid_product_ids
    ]

    if invalid_ids:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid product ID(s): {invalid_ids}"
        )

    recommendations = get_bundle_recommendations(
        request.cart_product_ids
    )

    return {
        "cart": request.cart_product_ids,
        "recommendations": recommendations
    }


# --------------------------------
# Create Recommended Bundle
# --------------------------------

@app.post("/bundle")
def create_bundle(request: CartRequest):
    if not request.cart_product_ids:
        raise HTTPException(
            status_code=400,
            detail="Cart cannot be empty"
        )

    # Get AI recommendations
    recommendations = get_bundle_recommendations(
        request.cart_product_ids
    )

    # Calculate total price of recommended products
    bundle_price = 0.0

    for product in recommendations:
        bundle_price += float(product.get("price", 0))

    # Apply 5% bundle discount
    discount = round(bundle_price * 0.05, 2)
    final_price = round(bundle_price - discount, 2)

    return {
        "cart": request.cart_product_ids,
        "recommended_products": recommendations,
        "original_price": round(bundle_price, 2),
        "discount": discount,
        "bundle_price": final_price
    }


# --------------------------------
# Merchant Dashboard
# --------------------------------

@app.get("/dashboard")
def get_dashboard():
    # Demo business metrics
    total_orders = 150
    total_revenue = 487500
    bundle_orders = 42
    bundle_revenue = 126000

    average_order_value = round(
        total_revenue / total_orders,
        2
    )

    bundle_conversion_rate = round(
        (bundle_orders / total_orders) * 100,
        2
    )

    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "average_order_value": average_order_value,
        "bundle_orders": bundle_orders,
        "bundle_revenue": bundle_revenue,
        "bundle_conversion_rate": bundle_conversion_rate
    }