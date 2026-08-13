'use client'

import { useEffect, useState } from 'react'
import { Plus, ShoppingCart, Sparkles, Check, Trash2, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const BACKEND_URL = 'https://3b46e4688a997452-103-51-54-50.serveousercontent.com'

interface Product {
  product_id: string
  product_name?: string
  name?: string
  price: number
  category: string
  stock?: number
  margin?: number
  profit_margin?: number
  score?: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Product[]>([])
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingBundle, setLoadingBundle] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Fetch initial products from backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${BACKEND_URL}/products`, {
          headers: {
            'bypass-tunnel-reminder': 'true',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (err) {
        console.error('Failed to fetch products from backend:', err)
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [])

  // Fetch recommendations whenever cart updates
  const fetchRecommendation = async (updatedCart: Product[]) => {
    if (updatedCart.length === 0) {
      setRecommendations([])
      return
    }
    setLoadingBundle(true)
    try {
      const res = await fetch(`${BACKEND_URL}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          cart_product_ids: updatedCart.map((item) => item.product_id),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        console.log('AI Recommendations Data:', data)
        setRecommendations(data.recommendations || [])
      }
    } catch (err) {
      console.error('Failed to fetch recommendation:', err)
    } finally {
      setLoadingBundle(false)
    }
  }

  const addToCart = (product: Product) => {
    const updatedCart = [...cart, product]
    setCart(updatedCart)
    fetchRecommendation(updatedCart)
  }

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.product_id !== productId)
    setCart(updatedCart)
    fetchRecommendation(updatedCart)
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-none">SmartBundle AI</h1>
              <p className="text-xs text-muted-foreground">Intelligent commerce</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {cart.length}
              </Badge>
            </Button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card p-6 shadow-2xl flex flex-col justify-between h-full border-l border-border">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <h2 className="text-lg font-bold">Your Cart ({cart.length})</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-10">
                    Your cart is empty. Add items to trigger AI recommendations!
                  </p>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={`${item.product_id}-${idx}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/40"
                    >
                      <div>
                        <p className="font-semibold text-sm">{item.product_name || item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                        <p className="text-sm font-bold mt-1">₹{item.price.toLocaleString()}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <Button className="w-full text-base py-5 font-semibold cursor-pointer">
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* Recommended Items Banner */}
        {recommendations.length > 0 && (
          <div className="mb-8 rounded-xl border border-primary/30 bg-primary/10 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">AI Recommended Next Purchases</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Based on what's in your cart, shoppers frequently pair these items together:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recommendations.map((rec) => {
                const inCart = cart.some((item) => item.product_id === rec.product_id)
                return (
                  <div
                    key={rec.product_id}
                    className="p-4 rounded-lg bg-card border border-border flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{rec.category}</Badge>
                        {rec.score && (
                          <span className="text-xs text-emerald-500 font-semibold">
                            {Math.round(rec.score * 100)}% Match
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-base mt-2">{rec.name || rec.product_name}</h4>
                      <p className="text-sm font-semibold mt-1">₹{rec.price.toLocaleString()}</p>
                    </div>
                    <Button
                      size="sm"
                      className="mt-3 w-full"
                      variant={inCart ? 'secondary' : 'default'}
                      onClick={() => addToCart(rec)}
                    >
                      {inCart ? 'In Cart' : '+ Add Recommendation'}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Featured Products */}
        <div className="mb-6">
          <h2 className="text-xl font-bold font-sans">Featured products</h2>
          <p className="text-sm text-muted-foreground">Live from Backend API</p>
        </div>

        {loadingProducts ? (
          <p className="text-sm text-muted-foreground">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const inCart = cart.some((item) => item.product_id === product.product_id)
              return (
                <Card key={product.product_id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="secondary">{product.category}</Badge>
                      {product.stock && (
                        <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{product.product_name || product.name}</h3>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold">₹{product.price.toLocaleString()}</span>
                    </div>
                    <Button
                      onClick={() => addToCart(product)}
                      className="mt-4 w-full cursor-pointer"
                      variant={inCart ? 'secondary' : 'default'}
                    >
                      {inCart ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                      {inCart ? 'Added to cart' : 'Add to cart'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}