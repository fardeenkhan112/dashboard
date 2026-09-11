import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from './Icon.jsx';

export default function NotificationToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-start gap-3 rounded-2xl p-4 shadow-xl border ${
          isSuccess
            ? 'bg-white border-emerald-200 text-slate-800'
            : 'bg-white border-rose-200 text-slate-800'
        }`}
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}
        >
          {isSuccess ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
        </div>

        <div className="flex-1 pr-2">
          <p className={`text-xs font-bold uppercase tracking-wider ${isSuccess ? 'text-emerald-700' : 'text-rose-700'}`}>
            {toast.title || (isSuccess ? 'Success' : 'Notice')}
          </p>
          <p className="mt-0.5 text-sm text-slate-600 leading-snug">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
