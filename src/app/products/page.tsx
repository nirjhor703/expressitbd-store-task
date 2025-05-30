'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface Product {
  _id: string
  name: string
  description: string
  price: string
  images: { secure_url: string }[]
  video: { secure_url: string }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://glore-bd-backend-node-mongo.vercel.app/api/product')

        if (Array.isArray(res.data?.data)) {
          setProducts(res.data.data)
        } else {
          throw new Error(`Unexpected API response: ${JSON.stringify(res.data)}`)
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load products.')
      }
    }

    fetchProducts()
  }, [])

  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-gray-800 rounded-lg p-4 transition duration-300 cursor-pointer border border-gray-700 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"

            onClick={() => router.push(`/products/${product._id}`)}
          >
            <img
              src={product.images?.[0]?.secure_url || '/placeholder.png'}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
            <div className="mt-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 text-sm">{product.description}</p>
              <p className="mt-2 text-lg font-bold text-blue-600">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
