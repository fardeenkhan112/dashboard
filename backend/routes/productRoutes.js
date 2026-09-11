import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET /api/products - list all products
router.get('/', getProducts);

// GET /api/products/:id - get single product
router.get('/:id', getProductById);

// POST /api/products - create product with optional image upload
router.post('/', upload.single('image'), createProduct);

// PUT /api/products/:id - update product with optional image replacement
router.put('/:id', upload.single('image'), updateProduct);

// DELETE /api/products/:id - delete product and associated image
router.delete('/:id', deleteProduct);

export default router;
