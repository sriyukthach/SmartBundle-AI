def get_bundle_recommendations(cart_item_ids, top_n=2):
    """
    Complete coverage recommendation engine for all demo products.
    Includes explicit rules + smart fallback for cold-start items.
    """
    items_str = str(cart_item_ids).lower()
    
    # -------------------------------------------------------------
    # 1. SMARTPHONE & MOBILE ACCESSORIES
    # (Smartphone Stand, Phone Case, Power Bank)
    # -------------------------------------------------------------
    if any(k in items_str for k in ['smartphone', 'phone', 'case', 'power bank']):
        return [
            {
                "product_id": "P008",
                "name": "USB-C Cable",
                "price": 499,
                "category": "Accessories",
                "profit_margin": 0.55,
                "score": 0.88,
                "image": "https://via.placeholder.com/150"
            },
            {
                "product_id": "P009",
                "name": "Power Bank",
                "price": 1499,
                "category": "Electronics",
                "profit_margin": 0.42,
                "score": 0.85,
                "image": "https://via.placeholder.com/150"
            }
        ][:top_n]

    # -------------------------------------------------------------
    # 2. AUDIO GEAR
    # (Wireless Headphones, Bluetooth Speaker)
    # -------------------------------------------------------------
    elif any(k in items_str for k in ['headphone', 'speaker', 'audio', 'bluetooth']):
        return [
            {
                "product_id": "P009",
                "name": "Power Bank",
                "price": 1499,
                "category": "Electronics",
                "profit_margin": 0.42,
                "score": 0.87,
                "image": "https://via.placeholder.com/150"
            },
            {
                "product_id": "P008",
                "name": "USB-C Cable",
                "price": 499,
                "category": "Accessories",
                "profit_margin": 0.55,
                "score": 0.82,
                "image": "https://via.placeholder.com/150"
            }
        ][:top_n]

    # -------------------------------------------------------------
    # 3. LAPTOP & DESK ACCESSORIES
    # (Laptop Stand, Laptop Sleeve, Keyboard, Mouse, Hub, Webcam)
    # -------------------------------------------------------------
    elif any(k in items_str for k in ['stand', 'laptop', 'sleeve', 'hub', 'mouse', 'keyboard', 'webcam']):
        return [
            {
                "product_id": "P001",
                "name": "Wireless Mouse",
                "price": 799,
                "category": "Accessories",
                "profit_margin": 0.45,
                "score": 0.92,
                "image": "https://via.placeholder.com/150"
            },
            {
                "product_id": "P002",
                "name": "Mechanical Keyboard",
                "price": 2499,
                "category": "Accessories",
                "profit_margin": 0.40,
                "score": 0.88,
                "image": "https://via.placeholder.com/150"
            }
        ][:top_n]

    # -------------------------------------------------------------
    # 4. CAMERA GEAR
    # (DSLR Camera, Memory Card, Camera Bag)
    # -------------------------------------------------------------
    elif any(k in items_str for k in ['camera', 'dslr', 'memory', 'bag']):
        return [
            {
                "product_id": "P102",
                "name": "64GB Memory Card",
                "price": 1200,
                "category": "Accessories",
                "profit_margin": 0.50,
                "score": 0.95,
                "image": "https://via.placeholder.com/150"
            },
            {
                "product_id": "P103",
                "name": "Camera Bag",
                "price": 1800,
                "category": "Accessories",
                "profit_margin": 0.42,
                "score": 0.89,
                "image": "https://via.placeholder.com/150"
            }
        ][:top_n]

    # -------------------------------------------------------------
    # 5. UNIVERSAL DEFAULT FALLBACK (High-Margin Accessories)
    # -------------------------------------------------------------
    return [
        {
            "product_id": "P008",
            "name": "USB-C Cable",
            "price": 499,
            "category": "Accessories",
            "profit_margin": 0.55,
            "score": 0.80,
            "image": "https://via.placeholder.com/150"
        },
        {
            "product_id": "P009",
            "name": "Power Bank",
            "price": 1499,
            "category": "Electronics",
            "profit_margin": 0.42,
            "score": 0.78,
            "image": "https://via.placeholder.com/150"
        }
    ][:top_n]