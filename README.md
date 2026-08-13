#  SmartBundle AI

> An AI-powered, cart-aware product bundling and recommendation system designed to boost Average Order Value (AOV) for small online businesses.

---

##  Project Overview

**SmartBundle AI** dynamically analyzes items in a shopper's cart and provides real-time cross-sell recommendations with dynamic bundle discounts. It also includes a **Merchant Dashboard** to help store owners track bundle conversion rates, revenue uplift, and high-performing product combinations.

---

##  Features

* ** Cart-Aware Recommendations:** Real-time cross-selling triggered dynamically as items are added to the cart.
* ** One-Click Bundle Add:** Add all recommended items instantly with standard bundle discounts applied automatically.
* ** Merchant Analytics Dashboard:** Visual metrics tracking Total Revenue, Average Order Value (AOV), Bundle Conversion Rate, and Revenue Growth (Standard vs. AI Bundles).
* ** Dynamic CSV Data Store:** Easily manage inventory, product pricing, images, and profit margins via CSV datasets.

---

##  Tech Stack

### **Frontend**
* **Framework:** Next.js (TypeScript) / React
* **Styling:** Tailwind CSS + shadcn/ui
* **Charts:** Recharts

### **Backend & ML**
* **API Framework:** FastAPI (Python)
* **Data Processing:** Pandas
* **Server:** Uvicorn

---

##  Repository Structure

```text
SmartBundle-AI/
├── app/                  # Next.js App Router pages
├── components/           # UI and Layout components
│   └── ui/               # shadcn/ui primitive components
├── backend/              # FastAPI Python backend
│   ├── main.py           # API routes & cross-sell logic
│   └── requirements.txt  # Python backend dependencies
├── data/                 # CSV datasets (products & sales transactions)
├── lib/                  # Shared utility functions
├── ml/                   # ML models and recommendation rule sets
├── public/               # Static assets & icons
└── package.json          # Node.js dependencies
