import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-5 right-5 z-50 animate-toast-in max-w-md w-full">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all ${
          isSuccess
            ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-500/10'
            : isError
            ? 'bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-500/10'
            : 'bg-blue-50/95 border-blue-200 text-blue-900 shadow-blue-500/10'
        }`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-600" />}
        </div>
        <div className="flex-1 text-sm font-medium pr-2">
          {toast.message}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-black/5"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
