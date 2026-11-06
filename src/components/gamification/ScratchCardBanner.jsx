import React, { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { soundFX } from "../../utils/soundEffects";
import { useApp } from "../../context/AppContext";
import { Sparkles, Gift, Check, ArrowRight, Wand2 } from "lucide-react";

export const ScratchCardBanner = () => {
  const { applyCoupon, addToast } = useApp();
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [copied, setCopied] = useState(false);

  const secretCode = "PAZAR10";
  const discountLabel = "10% ПОПУСТ НА СÈ";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Draw metallic scratchable top coat
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#D97706");
    gradient.addColorStop(0.5, "#F59E0B");
    gradient.addColorStop(1, "#EA580C");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative texture & pattern
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    for (let i = 0; i < width; i += 16) {
      ctx.fillRect(i, 0, 8, height);
    }

    // Centered CTA text on scratch surface
    ctx.fillStyle = "#0B0F19";
    ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ ИЗБРИШИ ТУКА ЗА ПОДАРОК ✨", width / 2, height / 2);
  }, []);

  const scratch = (clientX, clientY) => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    soundFX.playTick();

    // Check progress periodically
    checkProgress();
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentCount = 0;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) transparentCount++;
    }

    const percent = Math.round((transparentCount / (pixels.length / 16)) * 100);
    setScratchedPercent(percent);

    if (percent > 45 && !isScratched) {
      setIsScratched(true);
      soundFX.playWin();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#F97316", "#F59E0B", "#10B981", "#FFFFFF"],
      });
    }
  };

  const handleApply = () => {
    applyCoupon(secretCode);
    addToast(`Купонот ${secretCode} е применет во кошничката!`, "success");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(secretCode);
    setCopied(true);
    addToast("Кодот е копиран во clipboard!", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="bg-gradient-to-r from-[#0E172A] via-[#151F38] to-[#0E172A] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Text info */}
        <div className="text-center lg:text-left relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Интерактивна Грепка за Попуст</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Избришете ја картичката и откријте го вашиот таен купон!
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Држете го глувчето или прстот врз картичката за да го откриете ексклузивниот попуст за денешната нарачка.
          </p>
        </div>

        {/* Scratchable Card Box */}
        <div className="relative z-10 shrink-0 flex flex-col items-center">
          <div className="relative w-[280px] sm:w-[320px] h-[130px] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/50 bg-[#0B0F19] flex items-center justify-center select-none cursor-pointer">
            {/* Hidden Prize Underneath */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 text-center">
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest">
                СУПЕР ПОПУСТ
              </span>
              <span className="text-xl font-black text-white mt-0.5">
                {discountLabel}
              </span>
              <div className="mt-1 px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded-xl font-mono text-sm font-black text-orange-400 tracking-wider">
                {secretCode}
              </div>
            </div>

            {/* Canvas Scratch Layer */}
            {!isScratched && (
              <canvas
                ref={canvasRef}
                width={320}
                height={130}
                onMouseDown={() => setIsDrawing(true)}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                onMouseMove={(e) => {
                  if (isDrawing) scratch(e.clientX, e.clientY);
                }}
                onTouchStart={() => setIsDrawing(true)}
                onTouchEnd={() => setIsDrawing(false)}
                onTouchMove={(e) => {
                  if (e.touches[0]) {
                    scratch(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                className="absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-300"
              />
            )}
          </div>

          {/* Action buttons once revealed */}
          {isScratched ? (
            <div className="flex items-center gap-2 mt-3 w-full">
              <button
                onClick={handleCopy}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                <span>{copied ? "Копирано" : "Копирај код"}</span>
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2 px-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <span>Примени во кошничка</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500 mt-2 font-medium">
              Повлечете со глувчето за да избришете ({scratchedPercent}%)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
