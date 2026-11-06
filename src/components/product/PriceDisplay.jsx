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
          className={`font-black tracking-tight text-[#F5BA58] ${
            size === "lg"
              ? "text-2xl sm:text-3xl"
              : size === "sm"
              ? "text-base sm:text-lg"
              : "text-lg sm:text-xl"
          }`}
        >
          {formattedCurrent}
        </span>

        {originalPrice && originalPrice > price && (
          <span className="text-xs sm:text-sm text-[#8C8377] line-through font-semibold">
            {formattedOriginal}
          </span>
        )}

        {discount && discount > 0 && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-black bg-[#E26D46]/20 text-[#E26D46] border border-[#E26D46]/40">
            -{discount}%
          </span>
        )}
      </div>

      {showInstallments && price >= 3000 && (
        <span className="text-[11px] text-[#8C8377] mt-0.5">
          или од <span className="font-bold text-[#A8A095]">{installmentText}</span> /мес. на 24 рати
        </span>
      )}
    </div>
  );
};
