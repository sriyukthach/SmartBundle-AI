'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Sparkles, CheckCircle2, LayoutDashboard, Zap, Check, Trash2 } from 'lucide-react'

const BACKEND_URL = 'https://c6302f492a1ffce9-103-51-54-50.serveousercontent.com'

interface Product {
  product_id: string
  product_name: string
  category: string
  price: number
  stock?: number
  margin?: number
}

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<any[]>([])
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [aiRecommendation, setAiRecommendation] = useState<any[]>([])

  // 1. Fetch products dynamically from backend API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${BACKEND_URL}/products`, {
          headers: {
            'bypass-tunnel-reminder': 'true',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        if (!res.ok) throw new Error('Failed to fetch products')
        const data = await res.json()
        const rawList = data.products || data

        const normalized = rawList.map((p: any) => ({
          product_id: p.product_id || p.id,
          product_name: p.product_name || p.name,
          category: p.category,
          price: Number(p.price),
          stock: Number(p.stock),
          margin: Number(p.margin ?? p.profit_margin)
        }))

        setProducts(normalized)
      } catch (err) {
        console.error("Could not load products from backend:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // 2. Fetch AI Recommendations dynamically with safe filtering
  const fetchRecommendations = async (updatedCart: any[]) => {
    if (updatedCart.length === 0) {
      setAiRecommendation([])
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
      
      let rawList = []
      if (Array.isArray(data)) {
        rawList = data
      } else if (data.bundle && Array.isArray(data.bundle)) {
        rawList = data.bundle
      } else if (data.recommendations && Array.isArray(data.recommendations)) {
        rawList = data.recommendations
      }

      // Resolve raw backend items to actual active storefront products
      const resolved = rawList.map((r: any) => {
        if (typeof r === 'string') {
          return products.find(p => p.product_id === r || p.product_name.toLowerCase() === r.toLowerCase())
        }
        const rId = r.product_id || r.productId || r.id
        const rName = r.product_name || r.name
        return products.find(p => p.product_id === rId || p.product_name === rName) || r
      }).filter(Boolean)

      // Filter strictly against active storefront catalog products
      const validRecommendations = resolved.filter((rec: any) =>
        products.some((p) => p.product_id === rec.product_id)
      )

      // Fallback safely to catalog slice if no valid matches return
      const finalRecommendations =
        validRecommendations.length > 0
          ? validRecommendations
          : products.slice(0, 2)

      setAiRecommendation(finalRecommendations)
    } catch (err) {
      console.warn("Recommendation fetch error:", err)
      setAiRecommendation([])
    }
  }

  const handleAddToCart = async (product: Product) => {
    setCheckoutSuccess(false)
    const existing = cart.find(item => item.product_id === product.product_id)
    const updatedCart = existing
      ? cart.map(item => item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...product, quantity: 1 }]
    
    setCart(updatedCart)
    await fetchRecommendations(updatedCart)
  }

  const removeFromCart = async (product_id: string) => {
    setCheckoutSuccess(false)
    const updatedCart = cart.filter(item => item.product_id !== product_id)
    setCart(updatedCart)
    await fetchRecommendations(updatedCart)
  }

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const cartIds = cart.map(i => i.product_id)
  const displayRecommendations = aiRecommendation
    .filter(rec => rec && !cartIds.includes(rec.product_id))
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 space-y-8">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-neutral-400" /> AI Merchant Storefront
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Powered live by Python Backend & CSV Catalog.</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-neutral-700 text-neutral-300 bg-neutral-900 px-3 py-1">
            {loading ? '● Connecting to Backend...' : `● Live Connected (${products.length} Products)`}
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
          <h2 className="text-lg font-bold text-white">Catalog</h2>
          {loading ? (
            <p className="text-neutral-500 text-sm">Loading products from backend API...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto pr-2">
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
                      <div className="text-xl font-extrabold text-white">₹{product.price?.toLocaleString('en-IN')}</div>
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
          )}
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
                  <span>Order placed successfully!</span>
                </div>
              )}

              <Button 
                disabled={cart.length === 0}
                onClick={() => {
                  setCheckoutSuccess(true)
                  setCart([])
                  setAiRecommendation([])
                }}
                className="w-full bg-white text-neutral-950 hover:bg-neutral-200 font-semibold py-3 disabled:opacity-50 cursor-pointer"
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>

          {displayRecommendations.length > 0 && (
            <Card className="bg-neutral-900 border-neutral-800 border-dashed border-neutral-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {displayRecommendations.map((rec: any) => {
                  const isInCart = cart.some(item => item.product_id === rec.product_id)
                  return (
                    <div key={rec.product_id} className="flex justify-between items-center bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                      <div>
                        <div className="text-xs font-medium text-white">{rec.product_name}</div>
                        <div className="text-xs text-neutral-400 mt-0.5">₹{rec.price?.toLocaleString('en-IN')}</div>
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