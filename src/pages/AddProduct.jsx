import React, { useState, useRef } from 'react';
import {
  PackagePlus,
  Upload,
  Image as ImageIcon,
  X,
  ArrowLeft,
  Check,
  AlertCircle,
} from '../components/Icon.jsx';
import { createProduct } from '../services/api.js';

export default function AddProduct({
  categories = [],
  onSuccess,
  onCancel
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please select a valid image file (PNG, JPG, WebP, etc.)' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image size exceeds 5MB limit' }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.image;
      return next;
    });

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const removeSelectedFile = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = 'Valid price is required (0 or greater)';
    }
    if (!category) newErrors.category = 'Please select a category';
    if (stock === '' || isNaN(Number(stock)) || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      newErrors.stock = 'Valid whole-number stock quantity is required';
    }
    if (!imageFile) newErrors.image = 'Product image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Build FormData for Multer image upload
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('category', category);
      formData.append('stock', stock);

      formData.append('image', imageFile);

      const res = await createProduct(formData);
      onSuccess(res.message || 'Product created successfully!');
    } catch (err) {
      setErrors((prev) => ({ ...prev, server: err.message }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </button>
        <span className="rounded-full bg-[#ede7f6] px-3 py-1 text-xs font-bold text-[#5e35b1]">
          Multer Upload + MongoDB
        </span>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 berry-card-shadow">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ede7f6] text-[#5e35b1]">
            <PackagePlus className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Create an item in MongoDB with Multer multipart image uploading.
            </p>
          </div>
        </div>

        {errors.server && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 text-sm flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span>{errors.server}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Product Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                  errors.name
                    ? 'border-rose-400 bg-rose-50/50 ring-2 ring-rose-200'
                    : 'border-slate-200 bg-slate-50/70 focus:border-[#5e35b1] focus:bg-white focus:ring-2 focus:ring-[#5e35b1]/15'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                  errors.category
                    ? 'border-rose-400 bg-rose-50/50'
                    : 'border-slate-200 bg-slate-50/70 focus:border-[#5e35b1] focus:bg-white'
                }`}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-rose-600">{errors.category}</p>}
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Price ($ USD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="249.99"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                  errors.price
                    ? 'border-rose-400 bg-rose-50/50 ring-2 ring-rose-200'
                    : 'border-slate-200 bg-slate-50/70 focus:border-[#5e35b1] focus:bg-white focus:ring-2 focus:ring-[#5e35b1]/15'
                }`}
              />
              {errors.price && <p className="text-xs text-rose-600">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Stock Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                  errors.stock
                    ? 'border-rose-400 bg-rose-50/50 ring-2 ring-rose-200'
                    : 'border-slate-200 bg-slate-50/70 focus:border-[#5e35b1] focus:bg-white focus:ring-2 focus:ring-[#5e35b1]/15'
                }`}
              />
              {errors.stock && <p className="text-xs text-rose-600">{errors.stock}</p>}
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed product features, specifications, and warranty info..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#5e35b1] focus:bg-white focus:ring-2 focus:ring-[#5e35b1]/15"
              />
            </div>

            {/* Multer Image Upload Area */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Product Image (Multer Upload) *
              </label>

              {imagePreview ? (
                <div className="relative rounded-2xl border border-slate-200 p-4 bg-slate-50/50 flex items-center gap-5">
                  <div className="h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs shrink-0">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {imageFile ? imageFile.name : 'Image URL Selected'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {imageFile
                        ? `${(imageFile.size / 1024).toFixed(1)} KB • Will be uploaded via Multer to /backend/uploads`
                        : 'Web image URL configured'}
                    </p>
                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Remove / Replace</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDragOver
                      ? 'border-[#5e35b1] bg-purple-50/50'
                      : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ede7f6] text-[#5e35b1]">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Click to upload or drag and drop image
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    PNG, JPG, WebP, GIF up to 5MB (processed by Multer diskStorage)
                  </p>
                </div>
              )}
              {errors.image && <p className="text-xs text-rose-600">{errors.image}</p>}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5e35b1] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4527a0] transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Saving to MongoDB...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Save Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
