import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CategoryModel } from './models/Category.js';
import { ProductModel } from './models/Product.js';

dotenv.config();

const SEED_CATEGORIES = [
  { name: 'Electronics', description: 'Gadgets, devices, computers, and smart accessories' },
  { name: 'Accessories', description: 'Cables, cases, chargers, and premium add-ons' },
  { name: 'Audio', description: 'High-fidelity headphones, studio monitors, and speakers' },
  { name: 'Wearables', description: 'Smartwatches, fitness trackers, and health monitors' }
];

const SEED_PRODUCTS = [
  {
    name: 'Pro Audio Wireless Headphones',
    description: 'Active noise cancellation with 40-hour ultra-extended battery life and studio sound.',
    price: 249.99,
    category: 'Audio',
    stock: 45
  },
  {
    name: 'Ultra Retina Smartwatch V2',
    description: 'Precision heart tracking, AMOLED always-on display, and aerospace aluminum casing.',
    price: 399.00,
    category: 'Wearables',
    stock: 28
  },
  {
    name: 'Ergonomic Mechanical Keyboard',
    description: 'Hot-swappable tactile mechanical switches with Berry RGB backlight and wireless bluetooth.',
    price: 139.50,
    category: 'Accessories',
    stock: 62
  },
  {
    name: '4K Ultra-Wide Studio Monitor 34"',
    description: 'Thunderbolt 4 connectivity, 99% DCI-P3 color gamut, and factory-calibrated color accuracy.',
    price: 799.99,
    category: 'Electronics',
    stock: 14
  },
  {
    name: 'Fast Wireless Charging Pad 3-in-1',
    description: 'Charge smartphone, earbuds, and smartwatch simultaneously with Qi2 certified 15W fast charging.',
    price: 59.99,
    category: 'Accessories',
    stock: 110
  }
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/berry_dashboard';
  console.log('Connecting to MongoDB at:', uri.replace(/:[^:@]+@/, ':****@'));
  
  try {
    await mongoose.connect(uri);
    console.log('Clearing existing data...');
    await CategoryModel.deleteMany({});
    await ProductModel.deleteMany({});

    console.log('Seeding categories...');
    await CategoryModel.insertMany(SEED_CATEGORIES);

    console.log('Seeding products...');
    await ProductModel.insertMany(SEED_PRODUCTS);

    console.log('🎉 MongoDB seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
