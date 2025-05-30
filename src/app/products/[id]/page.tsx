'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'

interface Product {
  _id: string
  name: string
  description: string
  price: string
  images: { secure_url: string }[]
  video: { secure_url: string }
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get('https://glore-bd-backend-node-mongo.vercel.app/api/product')

        const all = res.data?.data || []
        const selected = all.find((p: Product) => p._id === id)

        if (selected) {
          setProduct(selected)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load product')
      }
    }

    fetchProduct()
  }, [id])

  if (error) return <div className="text-red-500">{error}</div>
  if (!product) return <div>Loading...</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.images?.[0]?.secure_url || '/placeholder.png'}
        alt={product.name}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <video controls className="w-full rounded mb-4">
        <source src={product.video.secure_url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="text-lg">{product.description}</p>
      <p className="mt-4 text-2xl font-bold text-green-600">${product.price}</p>
    </div>
  )
}
