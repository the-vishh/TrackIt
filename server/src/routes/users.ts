import express from 'express'
import { protect } from '../middleware/auth'
import prisma from '../config/database'
import { logger } from '../utils/logger'

const router = express.Router()

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req: any, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        preferences: true,
        level: true,
        experience: true,
        createdAt: true,
        updatedAt: true
      }
    })

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get user categories
// @route   GET /api/users/categories
// @access  Private
router.get('/categories', protect, async (req: any, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id },
      orderBy: { name: 'asc' }
    })

    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get user budgets
// @route   GET /api/users/budgets
// @access  Private
router.get('/budgets', protect, async (req: any, res, next) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      success: true,
      data: budgets
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get user achievements
// @route   GET /api/users/achievements
// @access  Private
router.get('/achievements', protect, async (req: any, res, next) => {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      success: true,
      data: achievements
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
router.get('/notifications', protect, async (req: any, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    res.json({
      success: true,
      data: notifications
    })
  } catch (error) {
    next(error)
  }
})

export default router
