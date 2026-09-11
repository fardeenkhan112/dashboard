import React, { useState, useEffect } from 'react';
import {
  Edit3,
  ArrowLeft,
  Check,
  AlertCircle
} from '../components/Icon.jsx';
import { fetchCategoryById, updateCategory } from '../services/api.js';

export default function EditCategory({
  categoryId,
  onSuccess,
  onCancel
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadCategory() {
      try {
        setLoading(true);
        const res = await fetchCategoryById(categoryId);
        if (res.success && res.data) {
          setName(res.data.name || '');
          setDescription(res.data.description || '');
        }
      } catch (err) {
        setErrors((prev) => ({ ...prev, fetch: err.message || 'Failed to load category' }));
      } finally {
        setLoading(false);
      }
    }

    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Category name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await updateCategory(categoryId, {
        name: name.trim(),
        description: description.trim()
      });
      onSuccess(res.message || 'Category updated successfully in MongoDB!');
    } catch (err) {
      setErrors((prev) => ({ ...prev, server: err.message }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-purple-200 border-t-[#5e35b1]" />
        <p className="mt-4 text-sm font-medium text-slate-500">Loading category from MongoDB...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Categories</span>
        </button>
        <span className="rounded-full bg-[#ede7f6] px-3 py-1 text-xs font-bold text-[#5e35b1]">
          Editing Category ID: {categoryId}
        </span>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 berry-card-shadow">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ede7f6] text-[#5e35b1]">
            <Edit3 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Modify the category title and description in MongoDB.
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Category Name <span className="text-rose-500">*</span>
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm outline-none focus:border-[#5e35b1] focus:bg-white"
            />
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
                  <span>Update Category</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
