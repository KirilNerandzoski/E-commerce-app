import React from "react";
import { useApp } from "../../context/AppContext";

const baseUrl = import.meta.env.BASE_URL || "/";
const getLogoUrl = (filename) => `${baseUrl}logos/${filename}`;

// Official Trademark Vector SVG Configurations (100% Authentic Originals)
export const BRAND_CONFIG = {
  Apple: {
    name: "Apple",
    category: "Електроника",
    file: "apple.svg",
    invertInDark: true,
  },
  Samsung: {
    name: "Samsung",
    category: "Мобилни & ТВ",
    file: "samsung.svg",
    invertInDark: true,
  },
  Sony: {
    name: "Sony",
    category: "Аудио & ТВ",
    file: "sony.svg",
    invertInDark: true,
  },
  Philips: {
    name: "Philips",
    category: "Апарати за дом",
    file: "philips.svg",
    invertInDark: false, // Official Philips blue
  },
  Bosch: {
    name: "Bosch",
    category: "Алати & Апарати",
    file: "bosch.svg",
    invertInDark: false, // Official Bosch red
  },
  Dyson: {
    name: "Dyson",
    category: "Премиум Нега & Дом",
    file: "dyson.svg",
    invertInDark: true,
  },
  Nike: {
    name: "Nike",
    category: "Спорт & Облека",
    file: "nike.svg",
    invertInDark: true,
  },
  Makita: {
    name: "Makita",
    category: "Професионален Алат",
    file: "makita.svg",
    invertInDark: false, // Official Makita red
  },
  Xiaomi: {
    name: "Xiaomi",
    category: "Паметни уреди",
    file: "xiaomi.svg",
    invertInDark: false, // Official Xiaomi orange squircle
  },
  DeLonghi: {
    name: "De'Longhi",
    category: "Еспресо & Кафе",
    file: "delonghi.svg",
    invertInDark: true,
  },
  LEGO: {
    name: "LEGO",
    category: "Игри & Сетови",
    file: "lego.svg",
    invertInDark: false, // Official LEGO red & yellow
  },
  Lavazza: {
    name: "Lavazza",
    category: "Премиум Кафе",
    file: "lavazza.svg",
    invertInDark: true,
  },
  Lenovo: {
    name: "Lenovo",
    category: "Лаптопи & Компјутери",
    file: "lenovo.svg",
    invertInDark: false,
  },
  ASUS: {
    name: "ASUS",
    category: "Гејминг & Хардвер",
    file: "asus.svg",
    invertInDark: true,
  },
  Logitech: {
    name: "Logitech",
    category: "Периферија",
    file: "logitech.svg",
    invertInDark: true,
  },
  Tefal: {
    name: "Tefal",
    category: "Кујнски апарати",
    file: "tefal.svg",
    invertInDark: false,
  },
};

export const normalizeBrandKey = (brand) => {
  if (!brand) return "Apple";
  const clean = brand.toLowerCase().replace(/['\s\-_]/g, "");
  const found = Object.keys(BRAND_CONFIG).find(
    (k) => k.toLowerCase().replace(/['\s\-_]/g, "") === clean
  );
  return found || brand;
};

/**
 * Universal Official Brand Logo Component
 * - size="xl": Large authentic logo for Brand Carousel
 * - size="md": Medium authentic logo for PDP and QuickView
 * - size="sm": Miniature authentic logo badge for ProductCard
 */
export const BrandLogo = ({
  brand,
  size = "md",
  showName = true,
  className = "",
}) => {
  const { theme } = useApp ? useApp() : { theme: "dark" };
  const key = normalizeBrandKey(brand);
  const config = BRAND_CONFIG[key];

  const shouldInvert = theme === "dark" && config?.invertInDark;

  if (config?.file) {
    const logoSrc = getLogoUrl(config.file);

    if (size === "xl") {
      return (
        <div className={`flex items-center justify-center w-full h-12 sm:h-14 ${className}`}>
          <img
            src={logoSrc}
            alt={`${config.name} Official Logo`}
            className={`max-h-10 sm:max-h-12 max-w-[130px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 ${
              shouldInvert ? "brightness-0 invert" : ""
            }`}
            loading="lazy"
          />
        </div>
      );
    }

    if (size === "lg") {
      return (
        <div className={`flex items-center justify-center w-full h-9 sm:h-11 ${className}`}>
          <img
            src={logoSrc}
            alt={`${config.name} Official Logo`}
            className={`max-h-8 sm:max-h-9 max-w-[110px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 ${
              shouldInvert ? "brightness-0 invert" : ""
            }`}
            loading="lazy"
          />
        </div>
      );
    }

    if (size === "sm") {
      return (
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
          <img
            src={logoSrc}
            alt={`${config.name} Official Logo`}
            className={`h-3.5 sm:h-4 max-w-[40px] w-auto object-contain shrink-0 ${
              shouldInvert ? "brightness-0 invert" : ""
            }`}
            loading="lazy"
          />
          {showName && (
            <span className="font-black text-[11px] tracking-wide uppercase">
              {config.name || brand}
            </span>
          )}
        </div>
      );
    }

    // Default 'md' size
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <img
          src={logoSrc}
          alt={`${config.name} Official Logo`}
          className={`h-5 sm:h-6 max-w-[70px] w-auto object-contain shrink-0 ${
            shouldInvert ? "brightness-0 invert" : ""
          }`}
          loading="lazy"
        />
        {showName && (
          <span className="font-black text-sm tracking-wide">
            {config.name || brand}
          </span>
        )}
      </div>
    );
  }

  // Fallback for brands without an SVG file
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs tracking-wider uppercase">
        {brand}
      </span>
    </div>
  );
};
