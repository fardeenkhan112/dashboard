import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProductModel } from '../models/Product.js';
import { CategoryModel } from '../models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../uploads');

function removeUploadedFile(imagePath) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return;
  const filePath = path.join(uploadsDir, path.basename(imagePath));
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Could not remove uploaded image:', error.message);
  }
}

function validateProductInput({ name, price, category, stock }) {
  if (!name?.trim()) return 'Product name is required.';
  if (price === undefined || price === '' || !Number.isFinite(Number(price)) || Number(price) < 0) {
    return 'A valid non-negative price is required.';
  }
  if (!category?.trim()) return 'Product category is required.';
  if (stock === undefined || stock === '' || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
    return 'Stock must be a non-negative whole number.';
  }
  return null;
}

async function ensureCategoryExists(categoryName) {
  return CategoryModel.exists({
    name: { $regex: `^${categoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
  });
}

export async function getProducts(req, res, next) {
  try {
    const { search, category, sort } = req.query;
    const query = {};

    if (search?.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = { $regex: `^${category.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' };
    }

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      stock: { stock: -1 },
      name: { name: 1 },
    };

    const products = await ProductModel.find(query)
      .sort(sortMap[sort] || { createdAt: -1 })
      .lean();

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    }

    const product = await ProductModel.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { name, description = '', price, category, stock } = req.body;
    const validationError = validateProductInput({ name, price, category, stock });

    if (validationError) {
      if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({ success: false, message: validationError });
    }

    if (!(await ensureCategoryExists(category.trim()))) {
      if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({ success: false, message: 'Selected category does not exist.' });
    }

    const product = await ProductModel.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      stock: Number(stock),
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });

    res.status(201).json({ success: true, message: 'Product created successfully.', data: product });
  } catch (error) {
    if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    }

    const { name, description = '', price, category, stock } = req.body;
    const validationError = validateProductInput({ name, price, category, stock });

    if (validationError) {
      if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({ success: false, message: validationError });
    }

    if (!(await ensureCategoryExists(category.trim()))) {
      if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({ success: false, message: 'Selected category does not exist.' });
    }

    const product = await ProductModel.findById(id);
    if (!product) {
      if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const oldImage = product.image;
    product.name = name.trim();
    product.description = description.trim();
    product.price = Number(price);
    product.category = category.trim();
    product.stock = Number(stock);

    if (req.file) product.image = `/uploads/${req.file.filename}`;

    await product.save();

    if (req.file) removeUploadedFile(oldImage);

    res.json({ success: true, message: 'Product updated successfully.', data: product });
  } catch (error) {
    if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    }

    const product = await ProductModel.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    await ProductModel.findByIdAndDelete(id);
    removeUploadedFile(product.image);

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
