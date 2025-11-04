'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heart, User, Users, School, Check, CreditCard, Smartphone } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const donationAmounts = {
  student: [1200, 2400, 3600, 4800],
  classroom: [25000, 50000, 75000, 100000],
  school: [100000, 200000, 300000, 500000],
  custom: [500, 1000, 2500, 5000]
}

const sponsorshipTypes = {
  student: {
    title: 'Adopt a Student',
    icon: User,
    description: 'Sponsor one student for a year of English learning',
    defaultAmount: 1200,
  },
  classroom: {
    title: 'Adopt a Classroom',
    icon: Users,
    description: 'Support 30+ students in one classroom',
    defaultAmount: 25000,
  },
  school: {
    title: 'Adopt a School',
    icon: School,
    description: 'Transform an entire school community',
    defaultAmount: 100000,
  },
  custom: {
    title: 'Custom Amount',
    icon: Heart,
    description: 'Choose your own contribution amount',
    defaultAmount: 1000,
  },
}

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'netbanking', name: 'Net Banking', icon: CreditCard },
  { id: 'upi', name: 'UPI', icon: Smartphone },
  { id: 'wallet', name: 'Mobile Wallet', icon: Smartphone },
]

export default function DonationForm() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pan: '',
    amount: '',
    customAmount: '',
    sponsorshipType: 'student',
    isRecurring: false,
    paymentMethod: 'card',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const type = searchParams?.get('type') || 'student'
    const amount = searchParams?.get('amount')
    
    if (type in sponsorshipTypes) {
      setFormData(prev => ({
        ...prev,
        sponsorshipType: type,
        amount: amount || sponsorshipTypes[type as keyof typeof sponsorshipTypes].defaultAmount.toString(),
      }))
    }
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      
      // Clear errors when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!/^[0-9]{10}$/.test(formData.phone.replace(/\\D/g, ''))) newErrors.phone = 'Please enter a valid 10-digit phone number'
    if (!formData.pan.trim()) newErrors.pan = 'PAN number is required for 80G receipt'
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) newErrors.pan = 'Please enter a valid PAN number'

    const finalAmount = formData.amount === 'custom' ? formData.customAmount : formData.amount
    if (!finalAmount || parseFloat(finalAmount) < 100) {
      newErrors.amount = 'Minimum donation amount is ₹100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // This would integrate with Razorpay
      const finalAmount = formData.amount === 'custom' ? formData.customAmount : formData.amount
      
      // Create Razorpay order
      const response = await fetch('/api/donations/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(finalAmount),
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          donor: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            pan: formData.pan.toUpperCase(),
          },
          sponsorshipType: formData.sponsorshipType,
          isRecurring: formData.isRecurring,
        }),
      })

      const order = await response.json()

      if (order.error) {
        throw new Error(order.error)
      }

      // Initialize Razorpay (would be loaded via script)
      // This is a placeholder - actual implementation would use Razorpay SDK
      console.log('Would launch Razorpay with order:', order)
      
      // For now, redirect to thank you page
      window.location.href = `/donate/thank-you?amount=${finalAmount}&type=${formData.sponsorshipType}`
      
    } catch (error) {
      console.error('Donation error:', error)
      alert('There was an error processing your donation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedType = sponsorshipTypes[formData.sponsorshipType as keyof typeof sponsorshipTypes]
  const availableAmounts = donationAmounts[formData.sponsorshipType as keyof typeof donationAmounts]
  const finalAmount = formData.amount === 'custom' ? parseFloat(formData.customAmount || '0') : parseFloat(formData.amount || '0')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 lg:p-12">
          {/* Sponsorship Type Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(sponsorshipTypes).map(([key, type]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    sponsorshipType: key,
                    amount: type.defaultAmount.toString() 
                  }))}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.sponsorshipType === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <type.icon className={`w-5 h-5 ${formData.sponsorshipType === key ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span className={`font-medium ${formData.sponsorshipType === key ? 'text-blue-900' : 'text-gray-700'}`}>
                      {type.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Amount</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {availableAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.amount === amount.toString()
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="custom"
                name="amount"
                value="custom"
                checked={formData.amount === 'custom'}
                onChange={handleInputChange}
                className="text-blue-600"
              />
              <label htmlFor="custom" className="text-sm font-medium text-gray-700">Custom Amount:</label>
              <input
                type="number"
                name="customAmount"
                value={formData.customAmount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                min="100"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
          </div>

          {/* Recurring Option */}
          <div className="mb-8">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Make this a monthly donation</span>
                <p className="text-sm text-gray-600">Sustain impact with recurring support</p>
              </div>
            </label>
          </div>

          {/* Donor Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10-digit phone number"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number * <span className="text-xs text-gray-500">(Required for 80G tax receipt)</span>
                </label>
                <input
                  type="text"
                  id="pan"
                  name="pan"
                  value={formData.pan}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.pan ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
                {errors.pan && <p className="text-red-600 text-sm mt-1">{errors.pan}</p>}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                    formData.paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <method.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Impact Type:</span>
                <span className="font-medium">{selectedType.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{formatCurrency(finalAmount)}</span>
              </div>
              {formData.isRecurring && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium text-blue-600">Monthly</span>
                </div>
              )}
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(finalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full dreamdaa-gradient text-white font-bold text-lg py-4"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2" />
                Donate {formatCurrency(finalAmount)}
              </>
            )}
          </Button>

          {/* Security Note */}
          <p className="text-center text-sm text-gray-500 mt-4">
            <Check className="w-4 h-4 inline text-green-500 mr-1" />
            Your donation is secure and encrypted. You&apos;ll receive a tax-exempt receipt via email.
          </p>
        </form>
      </div>
    </div>
  )
}