import React from "react";
import { useApp } from "../../context/AppContext";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let bgStyle = "bg-emerald-600 text-white";

        if (toast.type === "warning") {
          Icon = AlertTriangle;
          bgStyle = "bg-amber-600 text-white";
        } else if (toast.type === "info") {
          Icon = Info;
          bgStyle = "bg-slate-800 text-white";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-xl transition-all duration-300 transform translate-y-0 ${bgStyle}`}
            style={{ animation: "slideInUp 0.25s ease-out" }}
          >
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <Icon className="w-5 h-5 shrink-0" />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
