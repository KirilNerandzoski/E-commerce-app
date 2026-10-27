import React from "react";
import { Star } from "lucide-react";

export const StarRating = ({ rating = 5, reviewCount = 0, size = "sm", showNumber = true }) => {
  const iconSize = size === "lg" ? "w-4 h-4 sm:w-5 sm:h-5" : "w-3.5 h-3.5";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const filled = starIndex <= Math.round(rating);
          return (
            <Star
              key={starIndex}
              className={`${iconSize} ${filled ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-slate-700">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount > 0 && (
        <span className="text-xs text-slate-400">({reviewCount})</span>
      )}
    </div>
  );
};
