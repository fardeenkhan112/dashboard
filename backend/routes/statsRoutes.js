import express from 'express';
import mongoose from 'mongoose';
import { ProductModel } from '../models/Product.js';
import { CategoryModel } from '../models/Category.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [totalProducts, totalCategories, stockResult, recentProducts, categories] = await Promise.all([
      ProductModel.countDocuments(),
      CategoryModel.countDocuments(),
      ProductModel.aggregate([
        {
          $group: {
            _id: null,
            totalStock: { $sum: '$stock' },
            totalInventoryValue: { $sum: { $multiply: ['$price', '$stock'] } },
          },
        },
      ]),
      ProductModel.find().sort({ createdAt: -1 }).limit(5).lean(),
      CategoryModel.find().sort({ name: 1 }).lean(),
    ]);

    const categoryStats = await Promise.all(
      categories.map(async (category) => ({
        name: category.name,
        count: await ProductModel.countDocuments({ category: category.name }),
      }))
    );

    const totals = stockResult[0] || { totalStock: 0, totalInventoryValue: 0 };

    res.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalStock: totals.totalStock || 0,
        totalInventoryValue: Number((totals.totalInventoryValue || 0).toFixed(2)),
        recentProducts,
        categoryStats,
        dbStatus: { connected: mongoose.connection.readyState === 1 },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/db-status', (req, res) => {
  res.json({
    success: true,
    data: { connected: mongoose.connection.readyState === 1 },
  });
});

export default router;
