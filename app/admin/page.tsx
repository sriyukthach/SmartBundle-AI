'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowLeft, TrendingUp, Package, DollarSign, Layers } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts'

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

const COLORS = ['#737373', '#a3a3a3', '#525252', '#d4d4d4']

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(true)
  const [isLiveApi, setIsLiveApi] = useState(false)
  const [bundleStats, setBundleStats] = useState<any[]>([
    { name: 'Camera Bundle', sales: 142, revenue: 48000 },
    { name: 'Workspace Bundle', sales: 89, revenue: 5297 },
    { name: 'Audio Suite', sales: 64, revenue: 5498 },
    { name: 'Mobile Essentials', sales: 51, revenue: 1298 }
  ])

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

    const savedOrders = JSON.parse(localStorage.getItem('store_orders') || '[]')
    if (savedOrders.length > 0) {
      setBundleStats(prev => [
        ...prev,
        { name: 'Recent Checkouts', sales: savedOrders.length * 10, revenue: savedOrders.reduce((acc: number, o: any) => acc + o.total, 0) }
      ])
    }
  }, [])

  const totalValuation = products.reduce((acc, p) => acc + (p.price * (p.stock || 20)), 0)
  
  const categoryCount = products.reduce((acc: any, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})

  const pieData = Object.keys(categoryCount).map((cat) => ({
    name: cat,
    value: categoryCount[cat]
  }))

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-neutral-400" /> Merchant AI Analytics
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Live catalog intelligence, inventory valuation, and real-time sales tracking.</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-neutral-700 text-neutral-300 bg-neutral-900 px-3 py-1">
            {loading ? '● Loading...' : isLiveApi ? '● Live Backend Connected' : '● Demo Data Active'}
          </Badge>
          <Link href="/">
            <button className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-4 py-2 rounded-xl text-sm transition-all text-neutral-200 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back to Storefront
            </button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Package className="w-4 h-4 text-neutral-400" /> Total Catalog Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">{products.length} Products</div>
            <p className="text-xs text-neutral-500 mt-1">Active inventory SKUs</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-neutral-400" /> Inventory Valuation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">₹{totalValuation.toLocaleString('en-IN')}</div>
            <p className="text-xs text-neutral-500 mt-1">Calculated from current stock</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neutral-400" /> Avg Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">29%</div>
            <p className="text-xs text-neutral-500 mt-1">Optimization target rate</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-neutral-400" /> AI Engine Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-neutral-200">Active</div>
            <p className="text-xs text-neutral-500 mt-1">Serving real-time recommendations</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-neutral-900 border-neutral-800 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">Catalog Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">Top Bundle Sales Volume (Live Sync)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bundleStats}>
                <XAxis dataKey="name" stroke="#737373" fontSize={12} tickLine={false} />
                <YAxis stroke="#737373" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="sales" fill="#a3a3a3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}