import React from "react";
import { useApp } from "../../context/AppContext";
import { ProductCard } from "../product/ProductCard";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";

export const WishlistPage = () => {
  const { wishlist, products, addToCart, navigateTo, addToast } = useApp();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach((p) => {
      if (p.inStock) {
        addToCart(p, 1);
      }
    });
    addToast("Сите достапни производи од листата се додадени во кошничка!", "success");
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Вашата листа со желби е празна</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Зачувајте ги производите што ви се допаѓаат со клик на срценцето за подоцна лесно да ги најдете.
          </p>
          <button
            onClick={() => navigateTo("catalog")}
            className="mt-6 w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all"
          >
            Прегледај производи
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            Листа на омилени производи ({wishlistProducts.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Зачувани производи подготвени за нарачка
          </p>
        </div>

        <button
          onClick={handleMoveAllToCart}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <ShoppingCart className="w-4 h-4" /> Додади ги сите во кошничка
        </button>
      </div>

      {/* Grid of Wishlist items */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
