from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.data_loader import load_products, get_product
from backend.recommender import get_bundle_recommendations

app = FastAPI(title="SmartBundle AI API", version="1.0.0")

# -------------------------------------------------------------
# CORS MIDDLEWARE (Crucial for React / Next.js frontend connection)
# -------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from localhost, Serveo, and Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# ROUTES
# -------------------------------------------------------------

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "SmartBundle AI Backend API is running perfectly!"
    }


@app.get("/products")
def get_all_products():
    """Returns all 15 products from data/products.csv without slicing limits."""
    try:
        df = load_products()
        if df.empty:
            return []
        
        # Fill any NaN values to prevent JSON serialization errors
        df = df.fillna("")
        
        products = df.to_dict(orient="records")
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/products/{product_id}")
def get_single_product(product_id: str):
    """Fetches a single product by product_id."""
    product = get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.post("/recommend")
async def recommend(request: Request):
    """
    Accepts any payload format (cart item IDs, JSON bodies, or objects)
    and returns matching bundle recommendations.
    """
    try:
        body = await request.json()
    except Exception:
        body = {}
        
    return get_bundle_recommendations(body)