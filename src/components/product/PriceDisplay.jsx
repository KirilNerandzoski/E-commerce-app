import React from "react";
import { useApp } from "../../context/AppContext";
import { formatPrice, getInstallmentPrice } from "../../utils/formatters";

export const PriceDisplay = ({
  price,
  originalPrice,
  discount,
  size = "md",
  showInstallments = true,
}) => {
  const { currency } = useApp();

  const formattedCurrent = formatPrice(price, currency);
  const formattedOriginal = originalPrice ? formatPrice(originalPrice, currency) : null;
  const installmentText = showInstallments ? getInstallmentPrice(price, 24, currency) : null;

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
        <span
          className={`font-bold tracking-tight text-slate-900 ${
            size === "lg"
              ? "text-2xl sm:text-3xl text-orange-600"
              : size === "sm"
              ? "text-base sm:text-lg"
              : "text-lg sm:text-xl text-slate-900"
          }`}
        >
          {formattedCurrent}
        </span>

        {originalPrice && originalPrice > price && (
          <span className="text-xs sm:text-sm text-slate-400 line-through">
            {formattedOriginal}
          </span>
        )}

        {discount && discount > 0 && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-600">
            -{discount}%
          </span>
        )}
      </div>

      {showInstallments && price >= 3000 && (
        <span className="text-[11px] text-slate-500 mt-0.5">
          или од <span className="font-semibold text-slate-700">{installmentText}</span> /мес. на 24 рати
        </span>
      )}
    </div>
  );
};
