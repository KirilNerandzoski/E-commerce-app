import React from "react";
import { useApp } from "../../context/AppContext";
import { Home, Grid, Heart, ShoppingCart, User } from "lucide-react";

export const MobileBottomNav = () => {
  const {
    currentView,
    navigateTo,
    cartTotalItemsCount,
    wishlist,
    setIsCartDrawerOpen,
  } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1120]/95 backdrop-blur-xl border-t border-slate-800 py-1.5 px-3 flex items-center justify-around shadow-2xl lg:hidden text-slate-400">
      {/* Home */}
      <button
        onClick={() => navigateTo("home")}
        className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors ${
          currentView === "home" ? "text-orange-400 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Почетна</span>
      </button>

      {/* Catalog / Categories */}
      <button
        onClick={() => navigateTo("catalog")}
        className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors ${
          currentView === "catalog" ? "text-orange-400 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        <Grid className="w-5 h-5" />
        <span>Каталог</span>
      </button>

      {/* Wishlist */}
      <button
        onClick={() => navigateTo("wishlist")}
        className={`relative flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors ${
          currentView === "wishlist" ? "text-orange-400 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </div>
        <span>Омилени</span>
      </button>

      {/* Cart */}
      <button
        onClick={() => setIsCartDrawerOpen(true)}
        className={`relative flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors ${
          currentView === "cart" ? "text-orange-400 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          {cartTotalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartTotalItemsCount}
            </span>
          )}
        </div>
        <span>Кошничка</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => navigateTo("profile")}
        className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors ${
          currentView === "profile" ? "text-orange-400 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        <User className="w-5 h-5" />
        <span>Профил</span>
      </button>
    </div>
  );
};
