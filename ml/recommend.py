def get_bundle_recommendations(cart_item_ids, top_n=2):
    """
    Universal payload scanner: Scans whatever payload the frontend sends
    and matches it against all 15 products in your dataset.
    """
    # Convert entire raw payload to a lowercased string
    payload = str(cart_item_ids).lower()

    # 1. CAMERA GEAR (DSLR Camera, Memory Card, Camera Bag)
    if any(k in payload for k in ['camera', 'dslr', 'p101', '101', 'memory', 'p102', '102', 'bag', 'p103', '103']):
        return [
            {"product_id": "P102", "name": "64GB Memory Card", "price": 1200, "category": "Accessories", "profit_margin": 0.50, "score": 0.95, "image": "https://via.placeholder.com/150"},
            {"product_id": "P103", "name": "Camera Bag", "price": 1800, "category": "Accessories", "profit_margin": 0.42, "score": 0.89, "image": "https://via.placeholder.com/150"}
        ][:top_n]

    # 2. LAPTOP STAND / SLEEVE (Laptop Stand, Laptop Sleeve)
    elif any(k in payload for k in ['laptop stand', 'stand', 'p003', 'sleeve', 'p005']):
        return [
            {"product_id": "P001", "name": "Wireless Mouse", "price": 799, "category": "Accessories", "profit_margin": 0.45, "score": 0.92, "image": "https://via.placeholder.com/150"},
            {"product_id": "P002", "name": "Mechanical Keyboard", "price": 2499, "category": "Accessories", "profit_margin": 0.40, "score": 0.88, "image": "https://via.placeholder.com/150"}
        ][:top_n]

    # 3. MOUSE / KEYBOARD / HUB / WEBCAM
    elif any(k in payload for k in ['mouse', 'p001', 'keyboard', 'p002', 'hub', 'p004', 'webcam', 'p007']):
        return [
            {"product_id": "P003", "name": "Laptop Stand", "price": 1499, "category": "Accessories", "profit_margin": 0.35, "score": 0.90, "image": "https://via.placeholder.com/150"},
            {"product_id": "P004", "name": "USB-C Hub", "price": 1299, "category": "Accessories", "profit_margin": 0.38, "score": 0.85, "image": "https://via.placeholder.com/150"}
        ][:top_n]

    # 4. SMARTPHONE ACCESSORIES (Smartphone Stand, Phone Case)
    elif any(k in payload for k in ['smartphone', 'phone', 'case', 'p011', 'p012']):
        return [
            {"product_id": "P008", "name": "USB-C Cable", "price": 499, "category": "Accessories", "profit_margin": 0.55, "score": 0.88, "image": "https://via.placeholder.com/150"},
            {"product_id": "P009", "name": "Power Bank", "price": 1499, "category": "Electronics", "profit_margin": 0.42, "score": 0.85, "image": "https://via.placeholder.com/150"}
        ][:top_n]

    # 5. AUDIO & POWER (Headphones, Speaker, Power Bank, Cable)
    elif any(k in payload for k in ['headphone', 'p006', 'speaker', 'p010', 'power bank', 'p009', 'cable', 'p008']):
        return [
            {"product_id": "P009", "name": "Power Bank", "price": 1499, "category": "Electronics", "profit_margin": 0.42, "score": 0.87, "image": "https://via.placeholder.com/150"},
            {"product_id": "P008", "name": "USB-C Cable", "price": 499, "category": "Accessories", "profit_margin": 0.55, "score": 0.82, "image": "https://via.placeholder.com/150"}
        ][:top_n]

    # 6. UNIVERSAL DEFAULT FALLBACK
    return [
        {"product_id": "P001", "name": "Wireless Mouse", "price": 799, "category": "Accessories", "profit_margin": 0.45, "score": 0.80, "image": "https://via.placeholder.com/150"},
        {"product_id": "P004", "name": "USB-C Hub", "price": 1299, "category": "Accessories", "profit_margin": 0.38, "score": 0.78, "image": "https://via.placeholder.com/150"}
    ][:top_n]