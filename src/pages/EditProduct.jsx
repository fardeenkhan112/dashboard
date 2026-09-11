import React, { useState, useEffect, useRef } from 'react';
import {
  Edit3,
  Upload,
  X,
  ArrowLeft,
  Check,
  AlertCircle,
  Package
} from '../components/Icon.jsx';
import { fetchProductById, updateProduct, getImageUrl } from '../services/api.js';

export default function EditProduct({
  productId,
  categories = [],
  onSuccess,
  onCancel
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetchProductById(productId);
        if (res.success && res.data) {
          const p = res.data;
          setName(p.name || '');
          setDescription(p.description || '');
          setPrice(p.price !== undefined ? p.price.toString() : '');
          setCategory(p.category || '');
          setStock(p.stock !== undefined ? p.stock.toString() : '');
          setExistingImage(getImageUrl(p.image));
          setImagePreview(getImageUrl(p.image) || null);
        }
      } catch (err) {
        setErrors((prev) => ({ ...prev, fetch: err.message || 'Failed to load product details' }));
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'Please select a valid image file' }));
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
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = 'Valid price is required (0 or greater)';
    }
    if (!category) newErrors.category = 'Please select a category';
    if (stock === '' || isNaN(Number(stock)) || Number(stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required (0 or greater)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('category', category);
      formData.append('stock', stock);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await updateProduct(productId, formData);
      onSuccess(res.message || 'Product updated successfully in MongoDB!');
    } catch (err) {
      setErrors((prev) => ({ ...prev, server: err.message }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-3 border-purple-200 border-t-[#5e35b1]" />
        <p className="mt-4 text-sm font-medium text-slate-500">Fetching product from MongoDB...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </button>
        <span className="rounded-full bg-[#ede7f6] px-3 py-1 text-xs font-bold text-[#5e35b1]">
          Editing ID: {productId}
        </span>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 berry-card-shadow">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ede7f6] text-[#5e35b1]">
            <Edit3 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Product</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update inventory specifications and optionally replace the product image.
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
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                  errors.name
                    ? 'border-rose-400 bg-rose-50/50'
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm outline-none focus:border-[#5e35b1] focus:bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm outline-none focus:border-[#5e35b1] focus:bg-white"
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm outline-none focus:border-[#5e35b1] focus:bg-white"
              />
              {errors.stock && <p className="text-xs text-rose-600">{errors.stock}</p>}
            </div>

            {/* Image Replacement */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Product Image (Multer Replace)
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                <div className="h-24 w-24 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0 shadow-2xs">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-300">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <p className="text-xs text-slate-500">
                    {imageFile
                      ? `New image ready to upload: ${imageFile.name} (${(imageFile.size / 1024).toFixed(1)} KB)`
                      : 'Keep existing image or upload a new file via Multer'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5 text-[#5e35b1]" />
                      <span>{imageFile ? 'Change File' : 'Upload New Image'}</span>
                    </button>
                    {imageFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(existingImage);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Reset to Original
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm outline-none focus:border-[#5e35b1] focus:bg-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
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
                  <span>Updating in MongoDB...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
