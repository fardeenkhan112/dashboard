import mongoose from 'mongoose';

import { ProductModel } from '../models/Product.js';
import { CategoryModel } from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';

function validateProductInput({ name, price, category, stock }) {
  if (!name?.trim()) {
    return 'Product name is required.';
  }

  if (
    price === undefined ||
    price === '' ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0
  ) {
    return 'A valid non-negative price is required.';
  }

  if (!category?.trim()) {
    return 'Product category is required.';
  }

  if (
    stock === undefined ||
    stock === '' ||
    !Number.isInteger(Number(stock)) ||
    Number(stock) < 0
  ) {
    return 'Stock must be a non-negative whole number.';
  }

  return null;
}

async function ensureCategoryExists(categoryName) {
  const escapedCategory = categoryName.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  return CategoryModel.exists({
    name: {
      $regex: `^${escapedCategory}$`,
      $options: 'i',
    },
  });
}

function uploadImageToCloudinary(file) {
  return new Promise((resolve, reject) => {
    if (!file?.buffer) {
      return resolve('');
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'berry-dashboard/products',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
}

async function deleteCloudinaryImage(imageUrl) {
  if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) {
    return;
  }

  try {
    const parts = imageUrl.split('/upload/');

    if (parts.length !== 2) {
      return;
    }

    let publicPath = parts[1];

    // Remove version such as v1234567890/
    publicPath = publicPath.replace(/^v\d+\//, '');

    // Remove extension
    publicPath = publicPath.replace(/\.[^/.]+$/, '');

    await cloudinary.uploader.destroy(publicPath, {
      resource_type: 'image',
    });
  } catch (error) {
    console.error(
      'Could not remove Cloudinary image:',
      error.message
    );
  }
}

export async function getProducts(req, res, next) {
  try {
    const { search, category, sort } = req.query;

    const query = {};

    if (search?.trim()) {
      query.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
      ];
    }

    if (category && category !== 'All') {
      const escapedCategory = category
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      query.category = {
        $regex: `^${escapedCategory}$`,
        $options: 'i',
      };
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

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID.',
      });
    }

    const product = await ProductModel.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const {
      name,
      description = '',
      price,
      category,
      stock,
    } = req.body;

    const validationError = validateProductInput({
      name,
      price,
      category,
      stock,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (!(await ensureCategoryExists(category.trim()))) {
      return res.status(400).json({
        success: false,
        message: 'Selected category does not exist.',
      });
    }

    let imageUrl = '';

    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file);
    }

    const product = await ProductModel.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      stock: Number(stock),
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID.',
      });
    }

    const {
      name,
      description = '',
      price,
      category,
      stock,
    } = req.body;

    const validationError = validateProductInput({
      name,
      price,
      category,
      stock,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (!(await ensureCategoryExists(category.trim()))) {
      return res.status(400).json({
        success: false,
        message: 'Selected category does not exist.',
      });
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const oldImage = product.image;

    product.name = name.trim();
    product.description = description.trim();
    product.price = Number(price);
    product.category = category.trim();
    product.stock = Number(stock);

    if (req.file) {
      product.image = await uploadImageToCloudinary(req.file);
    }

    await product.save();

    // Delete old Cloudinary image only after the new image
    // has been uploaded successfully.
    if (req.file && oldImage) {
      await deleteCloudinaryImage(oldImage);
    }

    res.json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID.',
      });
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    await ProductModel.findByIdAndDelete(id);

    // Delete image from Cloudinary.
    await deleteCloudinaryImage(product.image);

    res.json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}