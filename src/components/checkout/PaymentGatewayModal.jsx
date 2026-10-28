import React, { useState } from "react";
import { formatPrice } from "../../utils/formatters";
import {
  X,
  CreditCard,
  Banknote,
  Calendar,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Building2,
  Check,
} from "lucide-react";

export const PaymentGatewayModal = ({
  isOpen,
  onClose,
  totalAmount,
  currency,
  initialMethod = "card",
  onConfirmOrder,
  shippingAddress,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(initialMethod || "card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // Card details
  const [cardData, setCardData] = useState({
    number: "5351 •••• •••• 8823",
    holder: "ALEKSANDAR PETROVSKI",
    expiry: "08/28",
    cvv: "742",
  });

  // Installments state
  const [installmentsBank, setInstallmentsBank] = useState("nlb");
  const [installmentsCount, setInstallmentsCount] = useState(12);

  if (!isOpen) return null;

  const banks = [
    { id: "nlb", name: "НЛБ Тутунска Банка (Mastercard / Visa)" },
    { id: "stb", name: "Стопанска Банка Скопје (Mastercard / Visa)" },
    { id: "kb", name: "Комерцијална Банка (Mastercard / Visa)" },
    { id: "diners", name: "Diners Club Macedonia" },
  ];

  const handlePayNow = () => {
    setIsProcessing(true);
    setProcessingStep(1);

    // Realistic banking 3D Secure simulation
    setTimeout(() => {
      setProcessingStep(2);
      setTimeout(() => {
        setIsProcessing(false);
        // Build detailed payment method text
        let methodName = "Готовина при преземање (Cash on Delivery)";
        if (selectedMethod === "card") {
          methodName = `Картичка (${cardData.number.slice(-4)}) - 3D Secure Авторизирано`;
        } else if (selectedMethod === "installments") {
          const bankObj = banks.find((b) => b.id === installmentsBank);
          methodName = `${installmentsCount} рати без камата (${bankObj?.name || "Банка"})`;
        }

        onConfirmOrder({
          paymentMethod: selectedMethod,
          paymentMethodName: methodName,
          cardLast4: cardData.number.slice(-4),
          installments: selectedMethod === "installments" ? installmentsCount : null,
        });
      }, 900);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5 text-orange-400 font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>PazarMax SecurePay • 256-bit SSL Gateway</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Изберете начин на плаќање
          </h2>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Вкупно за уплата:
              <span className="block text-xl font-black text-white">
                {formatPrice(totalAmount, currency)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>3D Secure 2.0 заштитено</span>
            </div>
          </div>
        </div>

        {/* Processing State Overlay */}
        {isProcessing ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
              <Lock className="w-6 h-6 text-slate-700 absolute inset-0 m-auto" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-800">
                {processingStep === 1
                  ? "Поврзување со банкарскиот систем..."
                  : "3D Secure авторизација на уплатата..."}
              </h3>
              <p className="text-xs text-slate-500">
                Ве молиме почекајте неколку секунди, не го затворајте прозорецот.
              </p>
            </div>

            <div className="w-48 bg-slate-100 rounded-full h-2 overflow-hidden mt-4">
              <div
                className="bg-orange-500 h-full transition-all duration-700"
                style={{ width: processingStep === 1 ? "55%" : "95%" }}
              />
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Option 1: Card */}
              <button
                type="button"
                onClick={() => setSelectedMethod("card")}
                className={`p-3 sm:p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                  selectedMethod === "card"
                    ? "border-orange-500 bg-orange-50/40 text-slate-900 shadow-sm ring-2 ring-orange-500/20"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <CreditCard
                    className={`w-5 h-5 ${
                      selectedMethod === "card" ? "text-orange-500" : "text-slate-400"
                    }`}
                  />
                  {selectedMethod === "card" && (
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  )}
                </div>
                <div>
                  <span className="block font-black text-xs sm:text-sm">Картичка</span>
                  <span className="text-[10px] text-slate-400 font-medium leading-none">
                    Visa / Master
                  </span>
                </div>
              </button>

              {/* Option 2: Cash on Delivery */}
              <button
                type="button"
                onClick={() => setSelectedMethod("cod")}
                className={`p-3 sm:p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                  selectedMethod === "cod"
                    ? "border-orange-500 bg-orange-50/40 text-slate-900 shadow-sm ring-2 ring-orange-500/20"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <Banknote
                    className={`w-5 h-5 ${
                      selectedMethod === "cod" ? "text-orange-500" : "text-slate-400"
                    }`}
                  />
                  {selectedMethod === "cod" && (
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  )}
                </div>
                <div>
                  <span className="block font-black text-xs sm:text-sm">Готовина</span>
                  <span className="text-[10px] text-slate-400 font-medium leading-none">
                    При преземање
                  </span>
                </div>
              </button>

              {/* Option 3: Installments */}
              <button
                type="button"
                onClick={() => setSelectedMethod("installments")}
                className={`p-3 sm:p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                  selectedMethod === "installments"
                    ? "border-orange-500 bg-orange-50/40 text-slate-900 shadow-sm ring-2 ring-orange-500/20"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <Calendar
                    className={`w-5 h-5 ${
                      selectedMethod === "installments"
                        ? "text-orange-500"
                        : "text-slate-400"
                    }`}
                  />
                  {selectedMethod === "installments" && (
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  )}
                </div>
                <div>
                  <span className="block font-black text-xs sm:text-sm">На рати</span>
                  <span className="text-[10px] text-slate-400 font-medium leading-none">
                    0% камата
                  </span>
                </div>
              </button>
            </div>

            {/* TAB CONTENT 1: CREDIT / DEBIT CARD */}
            {selectedMethod === "card" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Visual Card Mockup */}
                <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-orange-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-orange-500/20 rounded-full blur-2xl" />
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-300">
                      PazarMax Pay
                    </span>
                    <span className="font-black italic text-base tracking-wider text-orange-400">
                      Mastercard
                    </span>
                  </div>
                  <div className="font-mono text-lg sm:text-xl tracking-widest font-black mb-4">
                    {cardData.number || "•••• •••• •••• ••••"}
                  </div>
                  <div className="flex justify-between items-end text-[11px] font-mono text-slate-300">
                    <div>
                      <span className="text-[9px] block text-slate-400">СОПСТВЕНИК</span>
                      <span className="font-bold text-white uppercase">{cardData.holder}</span>
                    </div>
                    <div>
                      <span className="text-[9px] block text-slate-400">ВАЖИ ДО</span>
                      <span className="font-bold text-white">{cardData.expiry}</span>
                    </div>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Број на дебитна/кредитна картичка:
                    </label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) =>
                        setCardData((prev) => ({ ...prev, number: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white"
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Истекува (MM/YY):
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        maxLength={5}
                        onChange={(e) =>
                          setCardData((prev) => ({ ...prev, expiry: e.target.value }))
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-800 font-bold outline-none focus:border-orange-500 focus:bg-white"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        CVV / CVC код:
                      </label>
                      <input
                        type="password"
                        value={cardData.cvv}
                        maxLength={4}
                        onChange={(e) =>
                          setCardData((prev) => ({ ...prev, cvv: e.target.value }))
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-800 font-bold outline-none focus:border-orange-500 focus:bg-white"
                        placeholder="•••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Име и презиме на картичката:
                    </label>
                    <input
                      type="text"
                      value={cardData.holder}
                      onChange={(e) =>
                        setCardData((prev) => ({ ...prev, holder: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 uppercase text-slate-800 font-bold outline-none focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Трансакцијата е заштитена преку 3D Secure процесор. Банката ќе побара SMS
                    код за верификација.
                  </span>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: CASH ON DELIVERY */}
            {selectedMethod === "cod" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-orange-800 font-black text-sm">
                    <Banknote className="w-5 h-5 text-orange-600" />
                    <span>Плаќање во готовина при преземање</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Нарачката ќе ви биде доставена на вашата наведена адреса. Износот од{" "}
                    <strong className="text-slate-900 font-black">
                      {formatPrice(totalAmount, currency)}
                    </strong>{" "}
                    му го плаќате директно во готовина (кеш) на курирот при врачување на
                    пакетот.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Не се бара внес на банкарска картичка</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Добивате фискална сметка и испратница во пакетот</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Можност за проверка на пакетот пред исплата</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: INSTALLMENTS */}
            {selectedMethod === "installments" && (
              <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Изберете банка издавач на картичката:
                  </label>
                  <select
                    value={installmentsBank}
                    onChange={(e) => setInstallmentsBank(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white"
                  >
                    {banks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    Изберете број на месечни рати (0% камата):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 6, 12, 24].map((count) => {
                      const perMonth = Math.round(totalAmount / count);
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setInstallmentsCount(count)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            installmentsCount === count
                              ? "border-orange-500 bg-orange-500 text-white font-bold shadow-md"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <span className="block text-sm font-black">{count} рати</span>
                          <span
                            className={`text-[10px] block mt-0.5 ${
                              installmentsCount === count ? "text-orange-100" : "text-slate-500"
                            }`}
                          >
                            {formatPrice(perMonth, currency)}/месец
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span>Вкупен износ на рата:</span>
                  </div>
                  <span className="text-sm font-black text-purple-900">
                    {formatPrice(Math.round(totalAmount / installmentsCount), currency)} / месечно
                  </span>
                </div>
              </div>
            )}

            {/* Destination Summary */}
            {shippingAddress && (
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Испорака до:</span>
                <span className="font-bold text-slate-800">
                  {shippingAddress.street}, {shippingAddress.city}
                </span>
              </div>
            )}

            {/* Final Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePayNow}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
              >
                {selectedMethod === "card" && (
                  <>
                    <span>Плати {formatPrice(totalAmount, currency)} (3D Secure)</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
                {selectedMethod === "cod" && (
                  <>
                    <span>Потврди нарачка со плаќање во готовина</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
                {selectedMethod === "installments" && (
                  <>
                    <span>
                      Потврди {installmentsCount} рати ({formatPrice(totalAmount, currency)})
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
