'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, MoreVertical, TrendingUp, TrendingDown } from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  date: Date
  type: 'expense' | 'income'
  icon: string
  color: string
}

export function RecentTransactions() {
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Grocery shopping',
      amount: 85.50,
      category: 'Food & Dining',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      type: 'expense',
      icon: '🛒',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: '2',
      description: 'Gas station',
      amount: 45.00,
      category: 'Transportation',
      date: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      type: 'expense',
      icon: '⛽',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: '3',
      description: 'Coffee shop',
      amount: 12.75,
      category: 'Food & Dining',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      type: 'expense',
      icon: '☕',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: '4',
      description: 'Salary deposit',
      amount: 2500.00,
      category: 'Income',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      type: 'income',
      icon: '💰',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: '5',
      description: 'Movie tickets',
      amount: 32.00,
      category: 'Entertainment',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      type: 'expense',
      icon: '🎬',
      color: 'bg-purple-100 text-purple-600'
    }
  ])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.color}`}>
              <span className="text-lg">{transaction.icon}</span>
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{transaction.category}</span>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          View all transactions →
        </button>
      </div>
    </div>
  )
}
