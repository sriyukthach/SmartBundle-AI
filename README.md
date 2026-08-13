# SmartBundle-AI 🛒✨

An AI-powered merchant storefront built with **Next.js (App Router)** and connected dynamically to a Python backend and CSV product catalog. Designed to deliver smart, category-aware bundle recommendations in real time as users add items to their shopping cart.

---

## 🚀 Features

* **Dynamic Catalog Fetching:** Pulls all 60+ products straight from the backend API and CSV dataset (`product_id`, `name`, `category`, `price`, `stock`, `margin`) without hardcoding.
* **Smart Cart Management:** Add items, view quantities, update order totals, and remove products effortlessly.
* **AI Recommendation Engine:** Automatically triggers bundle recommendations when items are added to the cart, filtered to ensure clean, logical cross-selling.
* **Admin Dashboard Link:** Quick access navigation to manage inventory metrics.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS, Lucide Icons, Shadcn-style UI components
* **Backend Integration:** REST API (`/products`, `/recommend`) via secure tunneling (Serveo/Ngrok)

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/smart-bundle-ai.git](https://github.com/your-username/smart-bundle-ai.git)
   cd smart-bundle-ai
