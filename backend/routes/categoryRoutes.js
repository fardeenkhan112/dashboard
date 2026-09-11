import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// GET /api/categories - list all categories
router.get('/', getCategories);

// GET /api/categories/:id - get single category
router.get('/:id', getCategoryById);

// POST /api/categories - create category
router.post('/', createCategory);

// PUT /api/categories/:id - update category
router.put('/:id', updateCategory);

// DELETE /api/categories/:id - delete category
router.delete('/:id', deleteCategory);

export default router;
