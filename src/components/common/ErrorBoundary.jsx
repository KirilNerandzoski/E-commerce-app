import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-8 bg-white rounded-3xl border border-slate-200 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Се случи мала грешка
            </h2>
            <p className="text-xs text-slate-500">
              {this.state.error?.message || "Неочекувана грешка при приказ"}
            </p>
            {this.state.error?.stack && (
              <details className="text-left bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] text-red-600 overflow-x-auto max-h-40">
                <summary className="cursor-pointer font-bold text-slate-700">Детали за грешката</summary>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.stack}</pre>
              </details>
            )}
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  localStorage.removeItem("pazarmax_user");
                  window.location.href = window.location.pathname;
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Ресетирај профил кеш
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Освежи ја страницата
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
