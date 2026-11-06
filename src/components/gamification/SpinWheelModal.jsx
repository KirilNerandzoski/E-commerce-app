import React, { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { soundFX } from "../../utils/soundEffects";
import { useApp } from "../../context/AppContext";
import { X, Sparkles, Gift, Check, ArrowRight, RotateCw } from "lucide-react";

const SEGMENTS = [
  { label: "10% Попуст", code: "AURA10", color: "#E26D46", textColor: "#FFFFFF" },
  { label: "Бесплатна Достава", code: "FREESHIP", color: "#2E5B70", textColor: "#FFFFFF" },
  { label: "500 ден. Попуст", code: "POPUST500", color: "#8E5A3C", textColor: "#FFFFFF" },
  { label: "15% VIP Купон", code: "AURA15", color: "#A84E32", textColor: "#FFFFFF" },
  { label: "5% Бонус", code: "SPIN5", color: "#3B7A57", textColor: "#FFFFFF" },
  { label: "20% Џекпот!", code: "VIP20", color: "#D49A55", textColor: "#141210" },
];

export const SpinWheelModal = ({ isOpen, onClose }) => {
  const { applyCoupon, addToast } = useApp();
  const canvasRef = useRef(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [winningSegment, setWinningSegment] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [copied, setCopied] = useState(false);

  // Draw wheel on canvas
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 12;

    const numSegments = SEGMENTS.length;
    const anglePerSeg = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);

    // Draw outer golden glowing ring
    ctx.beginPath();
    ctx.arc(0, 0, radius + 4, 0, 2 * Math.PI);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#D49A55";
    ctx.stroke();

    // Draw segments
    SEGMENTS.forEach((seg, i) => {
      const startAngle = i * anglePerSeg;
      const endAngle = startAngle + anglePerSeg;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = seg.color;
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#141210";
      ctx.stroke();

      // Text on segment
      ctx.save();
      ctx.rotate(startAngle + anglePerSeg / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = seg.textColor;
      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(seg.label, radius - 24, 5);
      ctx.restore();
    });

    // Draw center hub
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, 2 * Math.PI);
    ctx.fillStyle = "#141210";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#D49A55";
    ctx.stroke();

    ctx.restore();
  }, [isOpen, rotationAngle]);

  const spin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    setWinningSegment(null);
    setCopied(false);

    const winningIdx = Math.floor(Math.random() * SEGMENTS.length);
    const numSegments = SEGMENTS.length;
    const anglePerSeg = (2 * Math.PI) / numSegments;

    const extraRotations = 6;
    const segmentCenterAngle = winningIdx * anglePerSeg + anglePerSeg / 2;
    const targetAngle =
      rotationAngle +
      extraRotations * 2 * Math.PI +
      (3 * Math.PI / 2 - segmentCenterAngle - (rotationAngle % (2 * Math.PI)) + 4 * Math.PI) % (2 * Math.PI);

    const startTime = performance.now();
    const duration = 4200; // ms
    const initialAngle = rotationAngle;
    let lastTickAngle = initialAngle;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = initialAngle + (targetAngle - initialAngle) * easeOut;

      setRotationAngle(currentAngle);

      if (Math.abs(currentAngle - lastTickAngle) >= anglePerSeg / 2) {
        soundFX.playTick();
        lastTickAngle = currentAngle;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setHasSpun(true);
        const won = SEGMENTS[winningIdx];
        setWinningSegment(won);

        soundFX.playWin();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#E26D46", "#D49A55", "#FAF6F0", "#3B7A57"],
        });
      }
    };

    requestAnimationFrame(animate);
  };

  const handleApplyCoupon = () => {
    if (!winningSegment) return;
    applyCoupon(winningSegment.code);
    addToast(`Купонот ${winningSegment.code} е успешно активиран!`, "success");
    onClose();
  };

  const handleCopyCode = () => {
    if (!winningSegment) return;
    navigator.clipboard.writeText(winningSegment.code);
    setCopied(true);
    addToast("Промотивниот код е копиран во clipboard!", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#1D1A17] border border-[#2A2520] rounded-3xl max-w-md w-full p-6 text-[#FAF6F0] relative shadow-2xl shadow-[#E26D46]/10 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#25211D] text-[#A8A095] hover:text-[#FAF6F0] hover:bg-[#2A2520] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E26D46]/15 border border-[#E26D46]/30 text-[#E26D46] text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Дневно тркало на среќата</span>
        </div>
        <h2 className="text-2xl font-black text-[#FAF6F0]">Заврти и освој попуст!</h2>
        <p className="text-xs text-[#A8A095] mt-1 mb-6">
          Секој ден имате шанса за ексклузивни купони, ваучери и бесплатна достава на AURA.
        </p>

        {/* Wheel Container */}
        <div className="relative w-[300px] h-[300px] mx-auto mb-6 flex items-center justify-center">
          {/* Top Pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-[#D49A55] drop-shadow-[0_4px_10px_rgba(212,154,85,0.8)]" />

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="w-full h-full drop-shadow-[0_0_25px_rgba(226,109,70,0.2)]"
          />

          {/* Center Spin Button */}
          <button
            onClick={spin}
            disabled={isSpinning || hasSpun}
            className={`absolute z-10 w-16 h-16 rounded-full font-black text-xs flex flex-col items-center justify-center transition-transform active:scale-95 shadow-xl cursor-pointer ${
              hasSpun
                ? "bg-[#25211D] text-[#8C8377] border-2 border-[#2A2520] cursor-not-allowed"
                : isSpinning
                ? "bg-gradient-to-tr from-[#D49A55] to-[#E26D46] text-[#141210] animate-pulse cursor-wait"
                : "bg-gradient-to-tr from-[#D49A55] to-[#E26D46] text-[#141210] hover:scale-105 shadow-[#E26D46]/40"
            }`}
          >
            <RotateCw className={`w-4 h-4 mb-0.5 ${isSpinning ? "animate-spin" : ""}`} />
            <span>{isSpinning ? "..." : hasSpun ? "КРАЈ" : "ЗАВРТИ"}</span>
          </button>
        </div>

        {/* Winner Announcement or Instruction */}
        {winningSegment ? (
          <div className="bg-[#25211D] border border-[#D49A55]/40 rounded-2xl p-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center gap-2 text-[#D49A55] font-black text-sm mb-1">
              <Gift className="w-4 h-4" />
              <span>Честитки! Ја освоивте наградата:</span>
            </div>
            <div className="text-xl font-black text-[#FAF6F0]">{winningSegment.label}</div>
            <div className="mt-2 flex items-center justify-center gap-2 bg-[#141210] px-3 py-1.5 rounded-xl border border-[#2A2520] w-fit mx-auto">
              <span className="text-xs text-[#A8A095]">Код:</span>
              <span className="text-sm font-mono font-black text-[#E26D46] tracking-wider">
                {winningSegment.code}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleCopyCode}
                className="flex-1 py-2.5 px-3 bg-[#1D1A17] hover:bg-[#2A2520] text-[#FAF6F0] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#2A2520] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                <span>{copied ? "Копирано" : "Копирај код"}</span>
              </button>
              <button
                onClick={handleApplyCoupon}
                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 text-[#141210] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#E26D46]/20 transition-all cursor-pointer"
              >
                <span>Активирај веднаш</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-[#A8A095]">
            * Добиениот купон може да се искористи во кошничката при секоја нарачка.
          </p>
        )}
      </div>
    </div>
  );
};
