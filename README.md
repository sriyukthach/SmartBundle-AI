#  SmartBundle AI

### AI-Powered Product Bundling for Smarter E-Commerce

SmartBundle AI is an intelligent e-commerce recommendation system that automatically identifies products that customers are likely to purchase together and creates personalized product bundles.

Instead of showing generic recommendations, SmartBundle AI considers **customer product affinity, product compatibility, profit margins, and inventory levels** to recommend bundles that benefit both the customer and the business.

---

##  Problem

E-commerce stores often lose potential revenue because customers purchase products individually without discovering useful complementary products.

Traditional recommendation systems mainly focus on what customers are likely to buy, but may not consider important business factors such as:

* Product profitability
* Current inventory levels
* Complementary product relationships
* Increasing Average Order Value (AOV)

This creates an opportunity to make product recommendations more **customer-aware and business-aware**.

---

##  Solution

SmartBundle AI combines AI-driven product recommendations with business intelligence to generate optimized product bundles.

### Example

A customer adds:

>  Camera — ₹45,000

SmartBundle AI analyzes the cart and recommends:

>  Memory Card — ₹1,999
>  Camera Bag — ₹2,499

The customer can add the recommended products individually or use:

> ** Add Entire Bundle**

The system can also consider product margin and inventory while selecting recommendations.

---

##  Key Features

###  AI-Powered Recommendations

Analyzes products in the customer's cart and identifies complementary products.

###  Smart Product Bundles

Automatically creates relevant 2–3 product bundles based on product affinity and compatibility.

###  Business-Aware Recommendations

Recommendation scoring can incorporate:

* Customer-product affinity
* Product compatibility
* Profit margin
* Inventory availability

###  One-Click Bundle Addition

Customers can add the entire recommended bundle to their cart with a single click.

###  Merchant Dashboard

Provides business-oriented metrics such as:

* Total Sales
* Average Order Value
* Bundle Conversions
* Bundle Revenue
* Top-performing bundles
* Recommended products

### Cart-Aware Recommendations

Recommendations change based on the products currently present in the customer's cart.

---

##  How It Works

```text
Customer
   │
   ▼
Product Catalogue
   │
   ▼
Add Product to Cart
   │
   ▼
SmartBundle AI
   │
   ├── Customer Affinity
   ├── Product Compatibility
   ├── Profit Margin
   └── Inventory Level
   │
   ▼
Bundle Scoring
   │
   ▼
Top Product Recommendations
   │
   ▼
SmartBundle
   │
   ▼
Add Entire Bundle
   │
   ▼
Updated Cart & Business Metrics
```

---

##  Project Structure

```text
SmartBundle-AI/
│
├── app/                 # Frontend application
│
├── backend/             # Backend APIs and business logic
│
├── components/
│   └── ui/              # Reusable UI components
│
├── data/                # Product and transaction data
│
├── ml/                  # Machine learning and recommendation logic
│
├── lib/                 # Utility functions and shared logic
│
├── public/              # Public/static assets
│
├── next.config.mjs      # Next.js configuration
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md
```

---

##  Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Reusable UI components

### Backend

* Python
* FastAPI

### AI / Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Recommendation / affinity-based modeling

### Data

* Product catalogue
* Transaction / co-purchase data
* Inventory information
* Profit margin information

---

##  Recommendation Logic

SmartBundle AI combines multiple signals to generate a recommendation score.

```text
Recommendation Score
        │
        ├── Customer Affinity
        │
        ├── Product Compatibility
        │
        ├── Profit Margin
        │
        └── Inventory Availability
        │
        ▼
Final Bundle Score
```

The highest-scoring relevant products are selected for the customer's bundle.

---

##  Example User Flow

### 1. Browse Products

The customer visits the online store and browses available products.

### 2. Add a Product

For example:

```text
Camera
₹45,000
```

The customer adds the camera to the cart.

### 3. SmartBundle AI Analyzes the Cart

The system analyzes the current cart and identifies complementary products.

### 4. Recommendations Appear

```text
 Complete Your Set

Memory Card       91% match
Camera Bag        87% match
Tripod            72% match
```

### 5. Add Entire Bundle

The customer clicks:

```text
 ADD ENTIRE BUNDLE
```

The recommended products are added to the cart.

### 6. Business Impact

The merchant can monitor bundle performance through the dashboard.

---

##  Business Impact

SmartBundle AI is designed to help businesses:

* Increase Average Order Value (AOV)
* Increase cross-selling opportunities
* Improve product discovery
* Reduce missed complementary-product sales
* Promote products with suitable inventory
* Improve the visibility of higher-margin products
* Understand which bundles perform best

### Example

```text
Before SmartBundle

Camera
₹45,000

Average Order Value
₹45,000
```

```text
With SmartBundle

Camera
+ Memory Card
+ Camera Bag

Bundle Value
₹49,499

Potential AOV Increase
↑
```

*The metrics shown in the demo may use sample data unless connected to live transaction data.*

---

##  Merchant Dashboard

The dashboard provides a business-level view of SmartBundle performance.

Example metrics:

```text
┌─────────────────┐
│ Total Sales     │
│ ₹1,25,000       │
└─────────────────┘

┌─────────────────┐
│ Average Order   │
│ Value           │
│ ₹3,250          │
└─────────────────┘

┌─────────────────┐
│ Bundle          │
│ Conversion      │
│ 24%             │
└─────────────────┘

┌─────────────────┐
│ Bundle Revenue  │
│ ₹32,500         │
└─────────────────┘
```

---

##  API Overview

The application can expose endpoints such as:

```text
GET  /products
GET  /products/{id}
POST /recommend
POST /bundle
GET  /dashboard
```

### Recommendation Request

```json
{
  "cart": ["camera"]
}
```

### Example Response

```json
{
  "recommendations": [
    {
      "product": "Memory Card",
      "score": 0.91
    },
    {
      "product": "Camera Bag",
      "score": 0.87
    }
  ]
}
```

---

##  MVP

The core MVP focuses on the following flow:

```text
Product Catalogue
       ↓
Add Product to Cart
       ↓
AI Recommendation
       ↓
2–3 Product Bundle
       ↓
Margin + Inventory Consideration
       ↓
Add Entire Bundle
       ↓
Updated Cart
       ↓
Merchant Dashboard
```

---

##  Future Scope

SmartBundle AI can be extended with:

* Real-time e-commerce integration
* Personalized recommendations using customer history
* Advanced deep-learning recommendation models
* Dynamic bundle pricing
* Real-time inventory synchronization
* A/B testing of different bundles
* Customer segmentation
* Multi-store support
* Real-time business analytics
* Cloud deployment
* Conversational AI shopping assistant

---

##  Why SmartBundle AI?

Traditional recommendation:

> **"You may also like..."**

SmartBundle AI:

> **"These products complete your purchase — and this bundle is optimized for both you and the business."**

SmartBundle AI bridges the gap between **customer personalization and business optimization** by turning individual product recommendations into actionable, intelligent bundles.

---

##  Team

Built as a collaborative AI-powered e-commerce project.

### Contributions

* **Frontend:** Product catalogue, cart experience, SmartBundle UI, bundle interaction, merchant dashboard
* **Backend:** APIs, application logic, integration
* **AI/ML:** Product affinity, recommendation engine, bundle scoring

---

##  License

This project is developed for educational and hackathon purposes.
