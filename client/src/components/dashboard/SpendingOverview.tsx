'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'

export function SpendingOverview() {
  const [timeframe, setTimeframe] = useState('week')

  const spendingData = {
    week: {
      total: 2450,
      change: 12.5,
      changeType: 'increase',
      average: 350,
      transactions: 24
    },
    month: {
      total: 8900,
      change: -5.2,
      changeType: 'decrease',
      average: 297,
      transactions: 89
    },
    year: {
      total: 45600,
      change: 8.7,
      changeType: 'increase',
      average: 3800,
      transactions: 456
    }
  }

  const currentData = spendingData[timeframe as keyof typeof spendingData]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Spending Overview</h2>
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeframe === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Spending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Spending</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                ${currentData.total.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex items-center mt-3">
            {currentData.changeType === 'increase' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              currentData.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentData.change > 0 ? '+' : ''}{currentData.change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last {timeframe}</span>
          </div>
        </motion.div>

        {/* Average Daily */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Average Daily</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                ${currentData.average}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-3">
            <span className="text-sm text-gray-600">
              Per day average
            </span>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Transactions</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {currentData.transactions}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-3">
            <span className="text-sm text-gray-600">
              Total transactions
            </span>
          </div>
        </motion.div>

        {/* Savings Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Savings Rate</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                18.5%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
          <div className="flex items-center mt-3">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+2.3%</span>
            <span className="text-sm text-gray-500 ml-1">vs last {timeframe}</span>
          </div>
        </motion.div>
      </div>

      {/* Quick Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">💡 Quick Insights</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Your biggest spending category is Food & Dining (32%)</p>
          <p>• You're on track to save $2,400 this month</p>
          <p>• Consider reducing entertainment spending by 15% to meet your goals</p>
        </div>
      </div>
    </div>
  )
}
