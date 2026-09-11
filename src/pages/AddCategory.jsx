import React, { useState } from 'react';
import {
  FolderPlus,
  ArrowLeft,
  Check,
  AlertCircle
} from '../components/Icon.jsx';
import { createCategory } from '../services/api.js';

export default function AddCategory({
  onSuccess,
  onCancel
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
      const res = await createCategory({
        name: name.trim(),
        description: description.trim()
      });
      onSuccess(res.message || 'Category created successfully in MongoDB!');
    } catch (err) {
      setErrors((prev) => ({ ...prev, server: err.message }));
    } finally {
      setSubmitting(false);
    }
  };

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
          MongoDB Model: Category
        </span>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 berry-card-shadow">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ede7f6] text-[#5e35b1]">
            <FolderPlus className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add New Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Create a new category classification for organizing your products.
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
              placeholder="e.g. Smart Home, Wearables, Gaming"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                errors.name
                  ? 'border-rose-400 bg-rose-50/50 ring-2 ring-rose-200'
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
              placeholder="Describe which items belong to this category..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#5e35b1] focus:bg-white focus:ring-2 focus:ring-[#5e35b1]/15"
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
                  <span>Saving to MongoDB...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Save Category</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
