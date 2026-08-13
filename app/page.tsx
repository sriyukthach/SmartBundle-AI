'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Sparkles, CheckCircle2, LayoutDashboard, Zap, Check, Trash2 } from 'lucide-react'

const BACKEND_URL = 'https://92bf1de3700560d7-103-51-54-50.serveousercontent.com'

interface Product {
  product_id: string
  product_name: string
  category: string
  price: number
  stock?: number
  margin?: number
}

const FALLBACK_PRODUCTS: Product[] = [
  { product_id: 'P001', product_name: 'Wireless Mouse', category: 'Accessories', price: 799, stock: 50, margin: 0.25 },
  { product_id: 'P002', product_name: 'Mechanical Keyboard', category: 'Accessories', price: 2499, stock: 30, margin: 0.22 },
  { product_id: 'P003', product_name: 'Laptop Stand', category: 'Accessories', price: 1499, stock: 25, margin: 0.3 },
  { product_id: 'P004', product_name: 'USB-C Hub', category: 'Accessories', price: 1299, stock: 40, margin: 0.28 },
  { product_id: 'P005', product_name: 'Laptop Sleeve', category: 'Accessories', price: 999, stock: 35, margin: 0.32 },
  { product_id: 'P006', product_name: 'Wireless Headphones', category: 'Audio', price: 2999, stock: 20, margin: 0.2 },
  { product_id: 'P007', product_name: 'Webcam', category: 'Electronics', price: 1999, stock: 25, margin: 0.24 },
  { product_id: 'P008', product_name: 'USB-C Cable', category: 'Accessories', price: 499, stock: 80, margin: 0.35 },
  { product_id: 'P009', product_name: 'Power Bank', category: 'Electronics', price: 1499, stock: 45, margin: 0.27 },
  { product_id: 'P010', product_name: 'Bluetooth Speaker', category: 'Audio', price: 2499, stock: 20, margin: 0.23 },
  { product_id: 'P011', product_name: 'Smartphone Stand', category: 'Accessories', price: 699, stock: 40, margin: 0.3 },
  { product_id: 'P012', product_name: 'Phone Case', category: 'Accessories', price: 599, stock: 60, margin: 0.35 },
  { product_id: 'P101', product_name: 'DSLR Camera', category: 'Electronics', price: 45000, stock: 12, margin: 0.15 },
  { product_id: 'P102', product_name: '64GB Memory Card', category: 'Accessories', price: 1200, stock: 50, margin: 0.5 },
  { product_id: 'P103', product_name: 'Camera Bag', category: 'Accessories', price: 1800, stock: 25, margin: 0.4 }
]

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(true)
  const [isLiveApi, setIsLiveApi] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [aiRecommendation, setAiRecommendation] = useState<any>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${BACKEND_URL}/products`, {
          headers: {
            'bypass-tunnel-reminder': 'true',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        if (!res.ok) throw new Error('Network response was not ok')
        const data = await res.json()
        const productList = data.products || data
        if (Array.isArray(productList) && productList.length > 0) {
          setProducts(productList)
          setIsLiveApi(true)
        }
      } catch (err) {
        setProducts(FALLBACK_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = async (product: Product) => {
    setCheckoutSuccess(false)
    
    const existing = cart.find(item => item.product_id === product.product_id)
    const updatedCart = existing
      ? cart.map(item => item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...product, quantity: 1 }]
    
    setCart(updatedCart)

    try {
      const response = await fetch(`${BACKEND_URL}/recommend`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "bypass-tunnel-reminder": "true",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ cart: updatedCart }),
      })

      if (!response.ok) throw new Error('Recommendation endpoint failed')
      const data = await response.json()
      if (data) {
        setAiRecommendation(data)
      }
    } catch (err) {
      console.warn("Backend /recommend unavailable, using smart local fallback recommendations.", err)
    }
  }

  const removeFromCart = async (product_id: string) => {
    setCheckoutSuccess(false)
    const updatedCart = cart.filter(item => item.product_id !== product_id)
    setCart(updatedCart)

    if (updatedCart.length === 0) {
      setAiRecommendation(null)
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/recommend`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "bypass-tunnel-reminder": "true",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ cart: updatedCart }),
      })
      if (!response.ok) throw new Error('Recommendation endpoint failed')
      const data = await response.json()
      if (data) setAiRecommendation(data)
    } catch (err) {
      console.warn("Backend /recommend unavailable for removal, falling back.", err)
    }
  }

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const getFallbackRecommendations = () => {
    if (cart.length === 0) return []
    const cartIds = cart.map(i => i.product_id)
    const matchingProducts = products.filter(p => !cartIds.includes(p.product_id))
    const cartCategories = cart.map(i => i.category)
    const sameCategory = matchingProducts.filter(p => cartCategories.includes(p.category))
    return sameCategory.length > 0 ? sameCategory.slice(0, 2) : matchingProducts.slice(0, 2)
  }

  const getDisplayRecommendations = () => {
    if (!aiRecommendation) return getFallbackRecommendations()
    
    const rawRecs = aiRecommendation.bundle || aiRecommendation.recommendations || aiRecommendation
    if (Array.isArray(rawRecs)) {
      return rawRecs.map((r: any) => {
        if (typeof r === 'string') {
          return products.find(p => p.product_id === r || p.product_name.toLowerCase() === r.toLowerCase()) || { product_id: r, product_name: r, category: 'Bundle Item', price: 999 }
        }
        return r
      }).filter(Boolean)
    }
    return getFallbackRecommendations()
  }

  const recommendations = getDisplayRecommendations()

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 space-y-8">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-neutral-400" /> AI Merchant Storefront
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Browse products, view recommendations, and add to cart.</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-neutral-700 text-neutral-300 bg-neutral-900 px-3 py-1">
            {loading ? '● Loading...' : isLiveApi ? '● Live Backend Connected' : '● Demo Data Active'}
          </Badge>
          <Link href="/admin">
            <button className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-4 py-2 rounded-xl text-sm transition-all text-neutral-200 cursor-pointer">
              <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white">Available Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(product => {
              const isInCart = cart.some(item => item.product_id === product.product_id)

              return (
                <Card key={product.product_id} className="bg-neutral-900 border-neutral-800 flex flex-col justify-between">
                  <CardHeader className="pb-2 relative">
                    <div className="absolute top-4 right-4 bg-neutral-950 px-2 py-1 rounded text-[10px] font-mono text-neutral-300 border border-neutral-800">
                      {product.product_id}
                    </div>
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">{product.category}</span>
                    <CardTitle className="text-base font-bold text-white mt-0.5">{product.product_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                    <div className="text-xl font-extrabold text-white">₹{product.price.toLocaleString('en-IN')}</div>
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      className={`w-full text-xs cursor-pointer ${
                        isInCart 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium' 
                          : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                      }`}
                    >
                      {isInCart ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Added to Cart
                        </span>
                      ) : (
                        'Add to Cart'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-neutral-400" /> Shopping Cart
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-neutral-500 py-6 text-center">Your cart is empty.</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex justify-between items-center text-sm border-b border-neutral-800 pb-3">
                      <div>
                        <div className="font-medium text-white">{item.product_name}</div>
                        <div className="text-xs text-neutral-400">Qty: {item.quantity}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        <button 
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-bold text-base text-white">
                    <span>Total</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {checkoutSuccess && (
                <div className="bg-neutral-800 border border-neutral-700 p-3 rounded-xl flex items-center gap-2 text-green-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Order placed! Synced to admin analytics.</span>
                </div>
              )}

              <Button 
                disabled={cart.length === 0}
                onClick={() => {
                  const existingOrders = JSON.parse(localStorage.getItem('store_orders') || '[]')
                  const newOrder = {
                    id: Date.now(),
                    items: cart,
                    total: cartTotal,
                    timestamp: new Date().toISOString()
                  }
                  localStorage.setItem('store_orders', JSON.stringify([...existingOrders, newOrder]))

                  setCheckoutSuccess(true)
                  setCart([])
                  setAiRecommendation(null)
                }}
                className="w-full bg-white text-neutral-950 hover:bg-neutral-200 font-semibold py-3 disabled:opacity-50 cursor-pointer"
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>

          {recommendations.length > 0 && (
            <Card className="bg-neutral-900 border-neutral-800 border-dashed border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((rec: any) => {
                  const isInCart = cart.some(item => item.product_id === rec.product_id)

                  return (
                    <div key={rec.product_id || rec.product_name} className="flex justify-between items-center bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                      <div>
                        <div className="text-xs font-medium text-white">{rec.product_name}</div>
                        <div className="text-xs text-neutral-400 mt-0.5">₹{rec.price?.toLocaleString('en-IN') || '999'}</div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleAddToCart(rec)}
                        className={`text-xs h-7 cursor-pointer ${
                          isInCart 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium' 
                            : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                        }`}
                      >
                        {isInCart ? 'Added' : 'Add'}
                      </Button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}