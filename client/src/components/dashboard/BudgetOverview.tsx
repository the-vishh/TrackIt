'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, AlertTriangle, CheckCircle } from 'lucide-react'

interface BudgetCategory {
  id: string
  name: string
  icon: string
  color: string
  budget: number
  spent: number
  remaining: number
  percentage: number
}

export function BudgetOverview() {
  const [budgetCategories] = useState<BudgetCategory[]>([
    {
      id: '1',
      name: 'Food & Dining',
      icon: '🍽️',
      color: 'bg-red-500',
      budget: 500,
      spent: 385,
      remaining: 115,
      percentage: 77
    },
    {
      id: '2',
      name: 'Transportation',
      icon: '🚗',
      color: 'bg-blue-500',
      budget: 300,
      spent: 245,
      remaining: 55,
      percentage: 82
    },
    {
      id: '3',
      name: 'Entertainment',
      icon: '🎬',
      color: 'bg-purple-500',
      budget: 200,
      spent: 120,
      remaining: 80,
      percentage: 60
    },
    {
      id: '4',
      name: 'Shopping',
      icon: '🛍️',
      color: 'bg-green-500',
      budget: 400,
      spent: 180,
      remaining: 220,
      percentage: 45
    },
    {
      id: '5',
      name: 'Utilities',
      icon: '⚡',
      color: 'bg-yellow-500',
      budget: 250,
      spent: 250,
      remaining: 0,
      percentage: 100
    }
  ])

  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0)
  const totalRemaining = totalBudget - totalSpent
  const totalPercentage = Math.round((totalSpent / totalBudget) * 100)

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    } else if (percentage >= 75) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    } else {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) {
      return 'text-red-600'
    } else if (percentage >= 75) {
      return 'text-yellow-600'
    } else {
      return 'text-green-600'
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">Budget Overview</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Budget</p>
          <p className="text-lg font-semibold text-gray-900">${totalBudget.toLocaleString()}</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className={`text-sm font-semibold ${getStatusColor(totalPercentage)}`}>
            {totalPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalPercentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-3 rounded-full ${
              totalPercentage >= 90 ? 'bg-red-500' :
              totalPercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Spent: ${totalSpent.toLocaleString()}</span>
          <span>Remaining: ${totalRemaining.toLocaleString()}</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Category Breakdown</h3>
        {budgetCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Category Icon */}
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
              <span className="text-lg">{category.icon}</span>
            </div>

            {/* Category Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(category.percentage)}
                  <span className={`text-sm font-semibold ${getStatusColor(category.percentage)}`}>
                    {category.percentage}%
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${category.percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-2 rounded-full ${category.color}`}
                />
              </div>
              
              {/* Amounts */}
              <div className="flex justify-between text-xs text-gray-600">
                <span>${category.spent} / ${category.budget}</span>
                <span>${category.remaining} left</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex space-x-3">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Adjust Budget
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}
