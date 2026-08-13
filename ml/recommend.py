import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from backend.data_loader import load_products

def get_bundle_recommendations(cart_data, top_n=2, relevance_threshold=0.05):
    """
    Pure Machine Learning Engine with Relevance Guardrail:
    Computes Cosine Similarity based on Category, Name, and Tags.
    
    If no items pass the 'relevance_threshold', it returns a fallback message
    notifying the user that recommendations will be updated soon.
    """
    df = load_products()
    if df.empty:
        return {
            "bundle": [],
            "message": "Recommendation products are not available and will be updated soon."
        }

    # 1. Feature Engineering: Combine Category, Name, and Metadata Tags
    tags_col = df['tags'] if 'tags' in df.columns else ""
    df['combined_features'] = (
        df['category'].fillna('') + " " + 
        df['name'].fillna('') + " " + 
        tags_col.fillna('')
    )

    # 2. Fit TF-IDF Vectorizer & Compute Cosine Similarity Matrix
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['combined_features'])
    similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)

    payload_str = str(cart_data).upper()
    cart_indices = []

    # 3. Identify all items currently in cart
    for idx, row in df.iterrows():
        p_id = str(row['product_id']).upper()
        p_name = str(row['name']).lower()
        if p_id in payload_str or p_name in str(cart_data).lower():
            cart_indices.append(idx)

    # If cart is empty or item isn't in CSV, return empty fallback
    if not cart_indices:
        return {
            "bundle": [],
            "message": "Recommendation products are not available and will be updated soon."
        }

    # 4. Aggregated Similarity Calculation across cart items
    sim_scores = np.zeros(len(df))
    for idx in cart_indices:
        sim_scores += similarity_matrix[idx]

    # Normalize similarity score average
    sim_scores = sim_scores / len(cart_indices)

    ranked_indices = np.argsort(sim_scores)[::-1]

    # 5. Extract top distinct recommendations THAT PASS the relevance threshold
    recommended_ids = []
    for idx in ranked_indices:
        if idx not in cart_indices:
            # Check if the AI confidence score meets the minimum relevance cutoff
            if sim_scores[idx] >= relevance_threshold:
                p_id = str(df.iloc[idx]['product_id'])
                if p_id not in recommended_ids:
                    recommended_ids.append(p_id)
            if len(recommended_ids) == top_n:
                break

    # 6. Fallback response if no products met the relevance score threshold
    if not recommended_ids:
        return {
            "bundle": [],
            "message": "Recommendation products are not available and will be updated soon."
        }

    return {
        "bundle": recommended_ids,
        "message": "AI Engine: Contextual complementary items calculated via Cosine Similarity:"
    }