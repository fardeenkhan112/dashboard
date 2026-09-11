import mongoose from 'mongoose';
import { CategoryModel } from '../models/Category.js';
import { ProductModel } from '../models/Product.js';

function escaped(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function getCategories(req, res, next) {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 }).lean();

    const data = await Promise.all(
      categories.map(async (category) => ({
        ...category,
        productCount: await ProductModel.countDocuments({ category: category.name }),
      }))
    );

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryById(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    }

    const category = await CategoryModel.findById(req.params.id).lean();
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    const productCount = await ProductModel.countDocuments({ category: category.name });
    res.json({ success: true, data: { ...category, productCount } });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const name = req.body.name?.trim();
    const description = req.body.description?.trim() || '';

    if (!name) return res.status(400).json({ success: false, message: 'Category name is required.' });

    const exists = await CategoryModel.exists({
      name: { $regex: `^${escaped(name)}$`, $options: 'i' },
    });
    if (exists) return res.status(409).json({ success: false, message: 'Category already exists.' });

    const category = await CategoryModel.create({ name, description });
    res.status(201).json({ success: true, message: 'Category created successfully.', data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Category already exists.' });
    }
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    }

    const name = req.body.name?.trim();
    const description = req.body.description?.trim() || '';

    if (!name) return res.status(400).json({ success: false, message: 'Category name is required.' });

    const category = await CategoryModel.findById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    const duplicate = await CategoryModel.exists({
      _id: { $ne: id },
      name: { $regex: `^${escaped(name)}$`, $options: 'i' },
    });
    if (duplicate) return res.status(409).json({ success: false, message: 'Category already exists.' });

    const oldName = category.name;
    category.name = name;
    category.description = description;
    await category.save();

    if (oldName !== name) {
      await ProductModel.updateMany({ category: oldName }, { $set: { category: name } });
    }

    res.json({ success: true, message: 'Category updated successfully.', data: category });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    }

    const category = await CategoryModel.findById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    const productCount = await ProductModel.countDocuments({ category: category.name });
    if (productCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete "${category.name}" because ${productCount} product(s) still use it. Reassign those products first.`,
      });
    }

    await CategoryModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
