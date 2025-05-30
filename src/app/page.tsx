'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const [storeName, setStoreName] = useState('')
  const [domain, setDomain] = useState('')
  const [domainStatus, setDomainStatus] = useState<null | 'available' | 'taken'>(null)
  const [domainMessage, setDomainMessage] = useState('')
  const [country, setCountry] = useState('Bangladesh')
  const [category, setCategory] = useState('Fashion')
  const [currency, setCurrency] = useState('BDT')
  const [email, setEmail] = useState('')

  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors: any = {}

    if (storeName.length < 3) newErrors.storeName = 'Store name must be at least 3 characters long'
    if (domain.length < 3) newErrors.domain = 'Domain must be at least 3 characters long'
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email format'
    if (domainStatus === 'taken') newErrors.domain = 'Not Available Domain, Re-enter!'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const checkDomain = async (value: string) => {
    if (!value) {
      setDomainStatus(null)
      setDomainMessage('')
      return
    }

    try {
      const res = await axios.get(`https://interview-task-green.vercel.app/task/domains/check/${value}.expressitbd.com`)
      const { taken } = res.data

      if (taken) {
        setDomainStatus('taken')
        setDomainMessage('Domain already taken. Please try another.')
      } else {
        setDomainStatus('available')
        setDomainMessage('Domain is available.')
      }
    } catch (err) {
      setDomainStatus(null)
      setDomainMessage('Something went wrong!')
    }
  }

  useEffect(() => {
    if (domain.length > 2) {
      const delay = setTimeout(() => checkDomain(domain), 600)
      return () => clearTimeout(delay)
    } else {
      setDomainStatus(null)
      setDomainMessage('')
    }
  }, [domain])

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      const res = await axios.post('https://interview-task-green.vercel.app/task/stores/create', {
        name: storeName,
        currency,
        country,
        domain,
        category,
        email,
      })

      if (res.data.status === 200 && res.data.succcess) {
        window.location.href = '/products'
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrors({ domain: 'This domain is already taken. Try a different one.' })
      } else {
        alert('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
      <div className="bg-[#1c1c1e] w-full max-w-2xl p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-2">Create a store</h2>
        <p className="text-gray-400 mb-6">Add your basic store information and complete the setup</p>

        <div className="space-y-5">
          <div>
            <label className="block mb-1 text-sm">Give your online store a name</label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="How'd you like to call your store?"
              className={`w-full p-2 rounded border ${errors.storeName ? 'border-red-500' : 'border-gray-700'} bg-[#2c2c2e]`}
            />
            {errors.storeName && <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm">Your online store subdomain</label>
            <div className="flex">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter your prefered domain"
                className={`border rounded-l-md px-3 py-2 w-full bg-[#2c2c2e] 
                  ${domainStatus === 'available' ? 'border-green-500' : ''} 
                  ${domainStatus === 'taken' ? 'border-red-500' : 'border-gray-700'}
                `}
              />
              <span className="px-3 py-2 rounded-r bg-[#2c2c2e] border border-l-0 border-gray-700 text-sm">
                .expressitbd.com
              </span>
            </div>
            {domainMessage && (
              <p className={`text-sm mt-1 
                ${domainStatus === 'available' ? 'text-green-500' : ''} 
                ${domainStatus === 'taken' ? 'text-red-500' : ''}
              `}>
                {domainMessage}
              </p>
            )}
            {errors.domain && <p className="text-red-500 text-sm mt-1">{errors.domain}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm">Where's your store located?</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 rounded border border-gray-700 bg-[#2c2c2e]"
            >
              <option>Bangladesh</option>
              <option>USA</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">What's your Category?</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded border border-gray-700 bg-[#2c2c2e]"
            >
              <option>Fashion</option>
              <option>Electronics</option>
              <option>Food</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Choose store currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 rounded border border-gray-700 bg-[#2c2c2e]"
            >
              <option>BDT</option>
              <option>USD</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Store contact email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full p-2 rounded border ${errors.email ? 'border-red-500' : 'border-gray-700'} bg-[#2c2c2e]`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || domainStatus !== 'available'}
            className={`w-full p-2 rounded bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 transition`}
          >
            {loading ? 'Creating...' : 'Create store'}
          </button>
        </div>
      </div>
    </div>
  )
}
