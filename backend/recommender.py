import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from backend.data_loader import load_products

# Define strict, logical category compatibility clusters
CATEGORY_CLUSTERS = {
    "Accessories": {"Accessories", "Electronics", "Audio", "Stationery"},
    "Electronics": {"Electronics", "Accessories", "Audio"},
    "Audio": {"Audio", "Accessories", "Electronics"},
    "Fitness": {"Fitness", "Apparel"},
    "Kitchenware": {"Kitchenware", "Household"},
    "Stationery": {"Stationery", "Accessories", "Household"},
    "Household": {"Household", "Kitchenware", "Stationery"},
    "Apparel": {"Apparel", "Fitness"}
}

def get_bundle_recommendations(cart_data, top_n=2, relevance_threshold=0.08):
    """
    Category-Gated Machine Learning Recommender:
    1. Calculates Cosine Similarity across TF-IDF vectors.
    2. Filters out candidate products outside compatible category clusters.
    3. Boosts same-category and tightly related functional accessories.
    4. Falls back gracefully if no items pass the relevance score cutoff.
    """
    df = load_products()
    if df.empty:
        return {
            "bundle": [],
            "message": "Recommendation products are not available and will be updated soon."
        }

    # 1. Feature Engineering: Combine Category, Name, and Tags
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

    # 3. Locate indices for all products currently in cart
    for idx, row in df.iterrows():
        p_id = str(row['product_id']).upper()
        p_name = str(row['name']).lower()
        if p_id in payload_str or p_name in str(cart_data).lower():
            cart_indices.append(idx)

    if not cart_indices:
        return {
            "bundle": [],
            "message": "Recommendation products are not available and will be updated soon."
        }

    # 4. Determine allowed target categories based on cart contents
    cart_categories = set(df.iloc[cart_indices]['category'].dropna().unique())
    allowed_categories = set()
    for cat in cart_categories:
        allowed_categories.update(CATEGORY_CLUSTERS.get(cat, {cat}))

    # 5. Aggregate base similarity scores
    sim_scores = np.zeros(len(df))
    for idx in cart_indices:
        sim_scores += similarity_matrix[idx]
    
    sim_scores = sim_scores / len(cart_indices)

    # 6. Apply strict Category Filtering and Same-Category Score Boost
    for idx, row in df.iterrows():
        item_cat = row['category']
        
        # Hard filter: eliminate unrelated categories
        if item_cat not in allowed_categories:
            sim_scores[idx] = 0.0
        else:
            # Boost items within the exact same category or direct tech accessories
            if item_cat in cart_categories:
                sim_scores[idx] *= 1.4

    ranked_indices = np.argsort(sim_scores)[::-1]

    # 7. Select top valid candidate IDs passing relevance cutoff
    recommended_ids = []
    for idx in ranked_indices:
        if idx not in cart_indices:
            if sim_scores[idx] >= relevance_threshold:
                p_id = str(df.iloc[idx]['product_id'])
                if p_id not in recommended_ids:
                    recommended_ids.append(p_id)
            if len(recommended_ids) == top_n:
                break

    # 8. Return fallback if no valid contextual items match
    if not recommended_ids:
        return {
            "bundle": [],
            "message": "Recommendation products are not available and will be updated soon."
        }

    return {
        "bundle": recommended_ids,
        "message": "AI Engine: Contextual complementary items calculated via Cosine Similarity:"
    }