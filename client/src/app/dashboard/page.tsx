'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Plus,
  Settings,
  Bell,
  User,
  BarChart3,
  Target,
  Award,
  MapPin
} from 'lucide-react'
import { SpendingOverview } from '@/components/dashboard/SpendingOverview'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { BudgetOverview } from '@/components/dashboard/BudgetOverview'
import { SpendingChart } from '@/components/analytics/SpendingChart'
import { AchievementBadge } from '@/components/gamification/AchievementBadge'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const stats = [
    {
      title: 'Total Spent',
      value: '$2,450',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-red-500'
    },
    {
      title: 'Monthly Budget',
      value: '$3,000',
      change: '82% used',
      changeType: 'neutral',
      icon: Target,
      color: 'text-blue-500'
    },
    {
      title: 'Savings',
      value: '$550',
      change: '+8.2%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Transactions',
      value: '24',
      change: 'This month',
      changeType: 'neutral',
      icon: Calendar,
      color: 'text-purple-500'
    }
  ]

  const recentAchievements = [
    {
      id: '1',
      name: 'First Week',
      description: 'Tracked expenses for 7 days',
      icon: '🎯',
      unlockedAt: new Date(),
      progress: 100,
      maxProgress: 100
    },
    {
      id: '2',
      name: 'Budget Master',
      description: 'Stayed under budget for 30 days',
      icon: '💰',
      unlockedAt: new Date(),
      progress: 75,
      maxProgress: 100
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ControlSpending</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your financial overview for today
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200">
              <Plus className="w-5 h-5" />
              <span>Add Expense</span>
            </button>
            <button className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span>View Analytics</span>
            </button>
            <button className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <Target className="w-5 h-5" />
              <span>Set Budget</span>
            </button>
            <button className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <MapPin className="w-5 h-5" />
              <span>Location Insights</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-')} bg-opacity-10`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : stat.changeType === 'decrease' ? (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                ) : null}
                <span className={`text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Spending Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Spending Overview</h2>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
              </div>
              <SpendingChart />
            </motion.div>

            {/* Budget Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <BudgetOverview />
            </motion.div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-8">
            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <RecentTransactions />
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
              </div>
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 AI Insight</h3>
              <p className="text-gray-700 text-sm mb-3">
                You're spending 15% more on dining out this month compared to last month. 
                Consider setting a weekly dining budget to stay on track.
              </p>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                View detailed analysis →
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
