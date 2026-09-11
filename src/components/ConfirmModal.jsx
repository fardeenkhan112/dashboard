import React from 'react';
import { AlertTriangle, Trash2, X } from './Icon.jsx';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName = '',
  onConfirm,
  onCancel,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <button
            onClick={onCancel}
            className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            {message}
          </p>
          {itemName && (
            <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 font-medium text-slate-800 text-sm">
              "{itemName}"
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
