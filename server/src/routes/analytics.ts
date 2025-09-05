import express from 'express'
import { query, validationResult } from 'express-validator'
import { protect } from '../middleware/auth'
import prisma from '../config/database'
import { logger } from '../utils/logger'

const router = express.Router()

// @desc    Get spending analytics
// @route   GET /api/analytics/spending
// @access  Private
router.get('/spending', protect, [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  query('groupBy').optional().isIn(['day', 'week', 'month', 'category']).withMessage('Group by must be day, week, month, or category')
], async (req: any, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { startDate, endDate, groupBy = 'month' } = req.query

    // Build date filter
    const dateFilter: any = {}
    if (startDate) dateFilter.gte = new Date(startDate as string)
    if (endDate) dateFilter.lte = new Date(endDate as string)

    // Get total spending
    const totalSpent = await prisma.expense.aggregate({
      where: {
        userId: req.user.id,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
      },
      _sum: {
        amount: true
      }
    })

    // Get spending by category
    const spendingByCategory = await prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        userId: req.user.id,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    })

    // Get category details
    const categoryIds = spendingByCategory.map(item => item.categoryId)
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds }
      }
    })

    const categorySpending = spendingByCategory.map(item => {
      const category = categories.find(cat => cat.id === item.categoryId)
      return {
        category,
        amount: item._sum.amount || 0,
        count: item._count.id
      }
    })

    // Get spending trend
    let spendingTrend: any[] = []
    if (groupBy === 'day') {
      spendingTrend = await prisma.expense.groupBy({
        by: ['date'],
        where: {
          userId: req.user.id,
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
        },
        _sum: {
          amount: true
        },
        orderBy: {
          date: 'asc'
        }
      })
    } else if (groupBy === 'week') {
      // Group by week (simplified - in production you'd use proper week grouping)
      spendingTrend = await prisma.expense.groupBy({
        by: ['date'],
        where: {
          userId: req.user.id,
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
        },
        _sum: {
          amount: true
        },
        orderBy: {
          date: 'asc'
        }
      })
    } else if (groupBy === 'month') {
      // Group by month
      const result = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', date) as month,
          SUM(amount) as total_amount
        FROM expenses 
        WHERE "userId" = ${req.user.id}
        ${Object.keys(dateFilter).length > 0 ? `AND date >= ${dateFilter.gte} AND date <= ${dateFilter.lte}` : ''}
        GROUP BY DATE_TRUNC('month', date)
        ORDER BY month ASC
      `
      spendingTrend = result as any[]
    }

    // Calculate average daily spending
    const averageDaily = totalSpent._sum.amount ? totalSpent._sum.amount / 30 : 0

    // Get monthly comparison
    const currentMonth = new Date()
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)

    const [currentMonthSpending, previousMonthSpending] = await Promise.all([
      prisma.expense.aggregate({
        where: {
          userId: req.user.id,
          date: {
            gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
            lte: currentMonth
          }
        },
        _sum: {
          amount: true
        }
      }),
      prisma.expense.aggregate({
        where: {
          userId: req.user.id,
          date: {
            gte: previousMonth,
            lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
          }
        },
        _sum: {
          amount: true
        }
      })
    ])

    const currentMonthTotal = currentMonthSpending._sum.amount || 0
    const previousMonthTotal = previousMonthSpending._sum.amount || 0
    const change = currentMonthTotal - previousMonthTotal
    const changePercentage = previousMonthTotal > 0 ? (change / previousMonthTotal) * 100 : 0

    res.json({
      success: true,
      data: {
        totalSpent: totalSpent._sum.amount || 0,
        averageDaily,
        categorySpending,
        spendingTrend,
        monthlyComparison: {
          currentMonth: currentMonthTotal,
          previousMonth: previousMonthTotal,
          change,
          changePercentage
        }
      }
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get budget analytics
// @route   GET /api/analytics/budgets
// @access  Private
router.get('/budgets', protect, async (req: any, res, next) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: {
        userId: req.user.id,
        isActive: true
      },
      include: {
        user: {
          select: {
            preferences: true
          }
        }
      }
    })

    const budgetAnalytics = budgets.map(budget => {
      const spentPercentage = (budget.spent / budget.amount) * 100
      const remaining = budget.amount - budget.spent
      
      return {
        ...budget,
        spentPercentage,
        remaining,
        status: spentPercentage >= 90 ? 'critical' : 
                spentPercentage >= 75 ? 'warning' : 'good'
      }
    })

    res.json({
      success: true,
      data: budgetAnalytics
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get location insights
// @route   GET /api/analytics/locations
// @access  Private
router.get('/locations', protect, async (req: any, res, next) => {
  try {
    const locationInsights = await prisma.locationInsight.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        totalSpent: 'desc'
      },
      take: 10
    })

    res.json({
      success: true,
      data: locationInsights
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get spending predictions
// @route   GET /api/analytics/predictions
// @access  Private
router.get('/predictions', protect, async (req: any, res, next) => {
  try {
    const predictions = await prisma.spendingPrediction.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: new Date()
        }
      },
      orderBy: {
        date: 'asc'
      },
      take: 30
    })

    res.json({
      success: true,
      data: predictions
    })
  } catch (error) {
    next(error)
  }
})

export default router
