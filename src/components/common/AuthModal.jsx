import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { supabaseService } from "../../services/supabaseService";
import { X, Lock, Mail, User, Phone, CheckCircle2, ShieldCheck, Database } from "lucide-react";

export const AuthModal = ({ isOpen, onClose }) => {
  const { setUser, addToast } = useApp();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (supabaseService.isConfigured) {
      // Real Supabase Auth
      if (isRegisterMode) {
        const { data, error } = await supabaseService.signUp(email, password, fullName, phone);
        if (error) {
          addToast(error.message, "warning");
        } else {
          addToast("Успешна регистрација во Supabase! Проверете ја вашата е-пошта.", "success");
          if (data?.user) {
            setUser((prev) => ({
              ...prev,
              id: data.user.id,
              name: fullName || data.user.email.split("@")[0],
              email: data.user.email,
              phone: phone || prev.phone,
            }));
          }
          onClose();
        }
      } else {
        const { data, error } = await supabaseService.signIn(email, password);
        if (error) {
          addToast(error.message, "warning");
        } else {
          addToast("Успешна најава преку Supabase!", "success");
          if (data?.user) {
            setUser((prev) => ({
              ...prev,
              id: data.user.id,
              name: data.user.user_metadata?.full_name || data.user.email.split("@")[0],
              email: data.user.email,
              phone: data.user.user_metadata?.phone || prev.phone,
            }));
          }
          onClose();
        }
      }
    } else {
      // Demo / Simulated mode when env keys not yet set
      setTimeout(() => {
        const userName = isRegisterMode ? fullName || email.split("@")[0] : email.split("@")[0];
        setUser((prev) => ({
          ...prev,
          name: userName,
          email: email,
          phone: phone || prev.phone,
        }));
        addToast(
          isRegisterMode
            ? `Добредојдовте, ${userName}! Сметката е креирана.`
            : `Успешна најава како ${userName}!`,
          "success"
        );
        setLoading(false);
        onClose();
      }, 500);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            {isRegisterMode ? "Креирај PazarMax сметка" : "Најава на PazarMax"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isRegisterMode
              ? "Регистрирајте се за следење нарачки и брза наплата"
              : "Внесете ги вашите податоци за пристап до профилот"}
          </p>

          {/* Supabase status indicator badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold mt-2.5 bg-slate-100 text-slate-700">
            <Database className="w-3 h-3 text-emerald-500" />
            <span>
              Supabase Backend:{" "}
              {supabaseService.isConfigured ? (
                <strong className="text-emerald-600">Поврзан</strong>
              ) : (
                <strong className="text-orange-600">Подготвен (Demo режим)</strong>
              )}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isRegisterMode && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Име и презиме
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="пр. Кирил Неранџоски"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 outline-none focus:border-orange-500 font-semibold"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Е-маил адреса
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 outline-none focus:border-orange-500 font-semibold"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Телефонски број (за СМС)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+389 70 123 456"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 outline-none focus:border-orange-500 font-semibold"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Лозинка
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 outline-none focus:border-orange-500 font-mono"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all mt-4 disabled:opacity-50"
          >
            {loading ? "Обработка..." : isRegisterMode ? "Регистрирај се" : "Најави се"}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-5 pt-4 border-t border-slate-100 text-xs text-slate-600">
          {isRegisterMode ? (
            <p>
              Веќе имате сметка?{" "}
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="font-bold text-orange-600 hover:underline"
              >
                Најавете се тука
              </button>
            </p>
          ) : (
            <p>
              Немате сметка?{" "}
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="font-bold text-orange-600 hover:underline"
              >
                Регистрирајте се бесплатно
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
