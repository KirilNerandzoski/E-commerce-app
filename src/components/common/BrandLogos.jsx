import React from "react";

// Official brand SVG representations with authentic brand shapes and colors
export const BRAND_CONFIG = {
  Apple: {
    name: "Apple",
    category: "Електроника",
    color: "#000000",
    lightColor: "#1D1D1F",
    accent: "#A2AAAD",
    renderIcon: (className = "w-6 h-6") => (
      <svg viewBox="0 0 170 170" className={className} fill="currentColor">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.03-7.61-7.7-11.73-14.02-6.53-9.97-11.59-21.2-15.19-33.72-3.6-12.52-5.4-24.16-5.4-34.92 0-14.73 3.73-26.78 11.2-36.14 7.46-9.36 16.7-14.16 27.71-14.39 4.8-.13 10.14 1.25 16.03 4.15 5.88 2.91 9.94 4.41 12.18 4.51 1.79 0 6.03-1.63 12.74-4.88 6.71-3.26 12.55-4.63 17.51-4.13 13.06 1.01 23.3 5.75 30.73 14.22-11.52 6.99-17.16 16.66-16.92 29.02.24 9.77 3.99 17.75 11.24 23.95 7.26 6.19 15.86 9.77 25.82 10.74-2.22 6.99-4.99 14.39-8.3 22.18zM119.22 33.15c0-7.39 2.66-14.39 7.98-21.01 5.31-6.62 11.83-10.92 19.55-12.91.22 1.33.33 2.55.33 3.65 0 7.39-2.73 14.52-8.19 21.39-5.46 6.87-12.13 11.08-20.02 12.63-.44-1.22-.65-2.48-.65-3.75z" />
      </svg>
    ),
  },

  Samsung: {
    name: "Samsung",
    category: "Мобилни & ТВ",
    color: "#1428A0",
    lightColor: "#0C2340",
    accent: "#2189FF",
    renderIcon: (className = "w-6 h-6") => (
      <svg viewBox="0 0 100 32" className={className} fill="currentColor">
        <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="22" letterSpacing="2">
          SAMSUNG
        </text>
      </svg>
    ),
  },

  Sony: {
    name: "Sony",
    category: "Аудио & ТВ",
    color: "#000000",
    lightColor: "#000000",
    accent: "#E26D46",
    renderIcon: (className = "w-6 h-6") => (
      <svg viewBox="0 0 100 28" className={className} fill="currentColor">
        <text x="50%" y="68%" dominantBaseline="middle" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="24" letterSpacing="4">
          SONY
        </text>
      </svg>
    ),
  },

  Philips: {
    name: "Philips",
    category: "Апарати за дом",
    color: "#0B5ED7",
    lightColor: "#063B82",
    accent: "#38BDF8",
    renderIcon: (className = "w-6 h-6") => (
      <svg viewBox="0 0 100 28" className={className} fill="currentColor">
        <text x="50%" y="68%" dominantBaseline="middle" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" letterSpacing="3">
          PHILIPS
        </text>
      </svg>
    ),
  },

  Bosch: {
    name: "Bosch",
    category: "Алати & Апарати",
    color: "#EA1C24",
    lightColor: "#C7141B",
    accent: "#EA1C24",
    renderIcon: (className = "w-6 h-6") => (
      <div className={`flex items-center gap-1.5 font-black tracking-wider ${className}`}>
        <svg viewBox="0 0 32 32" className="w-5 h-5 shrink-0" fill="none">
          <circle cx="16" cy="16" r="14" stroke="#EA1C24" strokeWidth="3" />
          <path d="M10 16h12M16 10v12" stroke="#EA1C24" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="text-base font-black tracking-widest text-red-600">BOSCH</span>
      </div>
    ),
  },

  Dyson: {
    name: "Dyson",
    category: "Премиум Нега & Дом",
    color: "#FF3366",
    lightColor: "#1A1A1A",
    accent: "#FF3366",
    renderIcon: (className = "w-6 h-6") => (
      <svg viewBox="0 0 100 30" className={className} fill="currentColor">
        <text x="50%" y="68%" dominantBaseline="middle" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="24" letterSpacing="2">
          dyson
        </text>
      </svg>
    ),
  },

  Nike: {
    name: "Nike",
    category: "Спорт & Облека",
    color: "#FF5500",
    lightColor: "#111111",
    accent: "#FF5500",
    renderIcon: (className = "w-6 h-6") => (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M21.7 8.02c-4.5.09-9.39 4.04-14.27 6.95-2.54 1.52-4.77 2.17-6.09 1.78-.35-.1-.58-.28-.66-.52-.08-.25-.01-.57.21-.92 1.2-1.91 4.62-4.12 9.35-6.01-2.37.71-4.6 1.75-6.43 3.01-2.03 1.4-3.45 3.16-3.75 4.66-.18.9-.01 1.65.48 2.14.44.43 1.14.65 2.07.65 2.18 0 4.93-1.15 7.66-2.87 4.5-2.84 8.58-6.17 11.4-8.7.45-.4.5-.83.03-.17z" />
      </svg>
    ),
  },

  Makita: {
    name: "Makita",
    category: "Професионален Алат",
    color: "#00859B",
    lightColor: "#006C7E",
    accent: "#00A3BC",
    renderIcon: (className = "w-6 h-6") => (
      <div className={`flex items-center font-black italic tracking-tighter text-[#00859B] ${className}`}>
        <span className="text-lg font-black italic tracking-tight">makita</span>
      </div>
    ),
  },

  Xiaomi: {
    name: "Xiaomi",
    category: "Паметни уреди",
    color: "#FF6900",
    lightColor: "#E05A00",
    accent: "#FF6900",
    renderIcon: (className = "w-6 h-6") => (
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 48 48" className="w-5 h-5 rounded-lg shrink-0" fill="none">
          <rect width="48" height="48" rx="14" fill="#FF6900" />
          <path d="M14 17h6v14h-6V17zm8 0h6v8h4v-8h6v14h-6v-8h-4v8h-6V17z" fill="#FFFFFF" />
        </svg>
        <span className="font-extrabold text-sm tracking-wide">XIAOMI</span>
      </div>
    ),
  },

  DeLonghi: {
    name: "De'Longhi",
    category: "Еспресо & Кафе",
    color: "#0A2540",
    lightColor: "#0A2540",
    accent: "#C5A880",
    renderIcon: (className = "w-6 h-6") => (
      <div className="flex items-center gap-1">
        <span className="font-serif font-black tracking-tight text-base italic">De'Longhi</span>
      </div>
    ),
  },

  LEGO: {
    name: "LEGO",
    category: "Игри & Сетови",
    color: "#D01012",
    lightColor: "#C00D0F",
    accent: "#FFD500",
    renderIcon: (className = "w-6 h-6") => (
      <div className="inline-flex items-center justify-center bg-[#D01012] px-2 py-0.5 rounded-md border border-[#FFD500] shadow-xs">
        <span className="font-black italic text-sm text-[#FFD500] tracking-wider drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
          LEGO
        </span>
      </div>
    ),
  },

  Lavazza: {
    name: "Lavazza",
    category: "Премиум Кафе",
    color: "#1E398A",
    lightColor: "#1E398A",
    accent: "#D49A55",
    renderIcon: (className = "w-6 h-6") => (
      <div className="flex items-center gap-1 font-black tracking-widest text-[#D49A55] text-sm uppercase">
        <span>LAVAZZA</span>
      </div>
    ),
  },

  Lenovo: {
    name: "Lenovo",
    category: "Лаптопи & Компјутери",
    color: "#E2231A",
    lightColor: "#E2231A",
    accent: "#E2231A",
    renderIcon: (className = "w-6 h-6") => (
      <div className="inline-flex items-center bg-[#E2231A] text-white px-2 py-0.5 rounded font-black text-xs tracking-wider">
        Lenovo
      </div>
    ),
  },

  ASUS: {
    name: "ASUS",
    category: "Гејминг & Хардвер",
    color: "#00539B",
    lightColor: "#00539B",
    accent: "#0080FF",
    renderIcon: (className = "w-6 h-6") => (
      <span className="font-black tracking-widest text-sm text-sky-500 font-mono">ASUS</span>
    ),
  },

  Logitech: {
    name: "Logitech",
    category: "Периферија",
    color: "#00B8FC",
    lightColor: "#0090C8",
    accent: "#00B8FC",
    renderIcon: (className = "w-6 h-6") => (
      <div className="flex items-center gap-1 font-bold text-sm">
        <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
        <span>logi</span>
      </div>
    ),
  },

  Tefal: {
    name: "Tefal",
    category: "Кујнски апарати",
    color: "#E30613",
    lightColor: "#E30613",
    accent: "#E30613",
    renderIcon: (className = "w-6 h-6") => (
      <span className="font-black italic text-sm text-red-600 tracking-tight">Tefal</span>
    ),
  },

  Gorenje: {
    name: "Gorenje",
    category: "Бела техника",
    color: "#E26D46",
    lightColor: "#333333",
    accent: "#E26D46",
    renderIcon: (className = "w-6 h-6") => (
      <span className="font-extrabold tracking-wider text-sm uppercase">gorenje</span>
    ),
  },

  Dior: {
    name: "Dior",
    category: "Парфеми & Луксуз",
    color: "#000000",
    lightColor: "#1A1A1A",
    accent: "#D49A55",
    renderIcon: (className = "w-6 h-6") => (
      <span className="font-serif font-black tracking-widest text-sm uppercase">DIOR</span>
    ),
  },

  "Tommy Hilfiger": {
    name: "Tommy Hilfiger",
    category: "Мода & Облека",
    color: "#00175A",
    lightColor: "#00175A",
    accent: "#CC0000",
    renderIcon: (className = "w-6 h-6") => (
      <div className="flex items-center gap-1">
        <span className="w-3.5 h-2.5 flex flex-col border border-neutral-400">
          <span className="h-1 bg-[#00175A]"></span>
          <span className="h-1 bg-[#CC0000]"></span>
        </span>
        <span className="font-black text-xs tracking-wider uppercase">TOMMY</span>
      </div>
    ),
  },

  "Michael Kors": {
    name: "Michael Kors",
    category: "Часовници & Накит",
    color: "#000000",
    lightColor: "#000000",
    accent: "#D49A55",
    renderIcon: (className = "w-6 h-6") => (
      <span className="font-sans font-black tracking-widest text-xs uppercase">MK</span>
    ),
  },

  "Oral-B": {
    name: "Oral-B",
    category: "Стоматологија",
    color: "#0047BA",
    lightColor: "#0047BA",
    accent: "#00A3E0",
    renderIcon: (className = "w-6 h-6") => (
      <span className="bg-[#0047BA] text-white px-1.5 py-0.2 rounded font-black text-xs">Oral-B</span>
    ),
  },

  Castrol: {
    name: "Castrol",
    category: "Авто Опрема",
    color: "#008752",
    lightColor: "#008752",
    accent: "#ED1C24",
    renderIcon: (className = "w-6 h-6") => (
      <span className="font-black italic text-xs text-emerald-500 uppercase tracking-tight">Castrol</span>
    ),
  },

  "Catan Studio": {
    name: "Catan",
    category: "Друштвени игри",
    color: "#C84E25",
    lightColor: "#C84E25",
    accent: "#FFCC00",
    renderIcon: (className = "w-6 h-6") => (
      <span className="font-black text-xs tracking-wider text-amber-500">CATAN</span>
    ),
  },
};

/**
 * Universal Brand Logo component
 * Used in:
 * 1. Brand Carousel (size="lg")
 * 2. Product Card header above product title (size="sm")
 * 3. Product Detail Page header (size="md")
 */
export const BrandLogo = ({
  brand,
  size = "md",
  showName = true,
  className = "",
}) => {
  const normalized = brand
    ? Object.keys(BRAND_CONFIG).find(
        (k) => k.toLowerCase() === brand.toLowerCase().replace(/['\s]/g, "")
      ) || brand
    : null;

  const config = BRAND_CONFIG[normalized] || {
    name: brand,
    renderIcon: () => null,
  };

  if (size === "sm") {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        {config.renderIcon && config.renderIcon("w-3.5 h-3.5 shrink-0")}
        {showName && (
          <span className="font-black text-[11px] tracking-wide uppercase">
            {config.name || brand}
          </span>
        )}
      </div>
    );
  }

  if (size === "lg") {
    return (
      <div className={`flex flex-col items-center justify-center gap-1.5 ${className}`}>
        <div className="h-7 sm:h-8 flex items-center justify-center">
          {config.renderIcon ? (
            config.renderIcon("w-7 h-7 sm:w-8 sm:h-8")
          ) : (
            <span className="text-base font-black">{config.name || brand}</span>
          )}
        </div>
        {showName && (
          <span className="text-[11px] font-bold text-[#A8A095] group-hover:text-[#E26D46] transition-colors">
            {config.name || brand}
          </span>
        )}
      </div>
    );
  }

  // Default 'md' size
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {config.renderIcon && config.renderIcon("w-5 h-5 shrink-0")}
      {showName && (
        <span className="font-black text-sm tracking-wide">
          {config.name || brand}
        </span>
      )}
    </div>
  );
};
