import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { formatPrice } from "../../utils/formatters";
import { soundFX } from "../../utils/soundEffects";
import {
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  Truck,
  Package,
  Phone,
  ChevronDown,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export const OrderCompletedChatBubble = () => {
  const {
    lastPlacedOrder,
    setLastPlacedOrder,
    isOrderChatBubbleOpen,
    setIsOrderChatBubbleOpen,
    hasOrderNotification,
    setHasOrderNotification,
    currency,
    navigateTo,
    theme,
  } = useApp();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize or update chat messages
  useEffect(() => {
    if (lastPlacedOrder) {
      const initialMessages = [
        {
          id: "msg-1",
          sender: "bot",
          text: `👋 Здраво, ${lastPlacedOrder.customerName || "Купувач"}! Вашата нарачка е успешно комплетирана! 🎉`,
          timestamp: "Штотуку",
        },
        {
          id: "msg-2",
          sender: "bot",
          isOrderCard: true,
          order: lastPlacedOrder,
          timestamp: "Штотуку",
        },
        {
          id: "msg-3",
          sender: "bot",
          text: `📦 Вашата пратка веќе се подготвува во AURA централниот центар во Скопје. Наскоро ќе добиете SMS и е-пошта со број за следење (${lastPlacedOrder.trackingNumber}).`,
          timestamp: "Штотуку",
        },
      ];
      setMessages(initialMessages);
    } else {
      const welcomeMessages = [
        {
          id: "msg-welcome-1",
          sender: "bot",
          text: "👋 Добредојдовте во AURA! Јас сум вашиот личен AI Консиерж. Како можам да ви помогнам денес со вашиот избор?",
          timestamp: "Штотуку",
        },
        {
          id: "msg-welcome-2",
          sender: "bot",
          text: "💡 Можете да ме прашате за услови за бесплатна достава, купување на 24 рати, AuraBox пакетоматите или препорака за производ!",
          timestamp: "Штотуку",
        },
      ];
      setMessages(welcomeMessages);
    }
  }, [lastPlacedOrder?.id]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOrderChatBubbleOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOrderChatBubbleOpen, isTyping]);



  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    soundFX.playPop();

    // Automated smart assistant response
    setTimeout(() => {
      let botReply = "";
      const lower = query.toLowerCase();

            if (lower.includes("кога") || lower.includes("стигне") || lower.includes("рок") || lower.includes("доста")) {
        if (lastPlacedOrder) {
          botReply = `🚚 Доставата на вашата нарачка #${lastPlacedOrder.id} е со ${lastPlacedOrder.deliveryMethod} и пристигнува за 24-48 работни часа на ${lastPlacedOrder.address}!`;
        } else {
          botReply = "🚚 Доставата низ цела Македонија се врши за 24 до 48 работни часа директно до вашата врата! За сите нарачки над 1.500 ден. доставата е потполно БЕСПЛАТНА.";
        }
      } else if (lower.includes("плаќа") || lower.includes("картичка") || lower.includes("готовина") || lower.includes("рати")) {
        if (lastPlacedOrder) {
          botReply = `💳 Плаќањето е со "${lastPlacedOrder.paymentMethod}". Вкупниот износ е ${formatPrice(lastPlacedOrder.total, currency)}. Фискална сметка ќе биде приложена во пакетот.`;
        } else {
          botReply = "💳 Поддржуваме плаќање со кредитни/дебитни картички (Visa, Mastercard), плаќање во готово при преземање на пратката, како и купување до 24 рати без камата за сите производи над 3.000 ден.";
        }
      } else if (lower.includes("гаранци") || lower.includes("сервис") || lower.includes("оригинал")) {
        botReply = "🛡️ Сите производи во AURA се 100% оригинални со официјална гаранција од 24 месеци и овластен сервис во Скопје и Македонија.";
      } else if (lower.includes("враќа") || lower.includes("замен")) {
        botReply = "🔄 Имате загарантирано право на бесплатно враќање или замена на производите во рок од 14 дена од приемот, без комплицирани процедури.";
      } else if (lower.includes("aurabox") || lower.includes("пакетомат")) {
        botReply = "📦 AuraBox се наши паметни пакетомати распоредени на 50+ локации ширум Македонија каде пратката можете да ја подигнете 0-24 часа кога вам ви одговара со едноставен SMS код.";
      } else if (lower.includes("фала") || lower.includes("благодарам") || lower.includes("супер") || lower.includes("ок")) {
        botReply = "😊 Секогаш со задоволство! Ви благодариме што сте со AURA. Уживајте во вашиот шопинг! ✨";
      } else {
        botReply = "✅ Ви благодариме на прашањето! Нашиот тим за корисничка поддршка е исто така достапен на 02 3100 500 (секој ден од 08:00 до 22:00 ч).";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
      soundFX.playPop();
    }, 900);
  };

  const handleToggleOpen = () => {
    setIsOrderChatBubbleOpen((prev) => !prev);
    if (hasOrderNotification) {
      setHasOrderNotification(false);
    }
  };

  // Only render after an order is completed, avoiding any overlap with the Lucky Wheel
  // Guard is placed strictly AFTER all React hooks to preserve Hook execution order
  if (!lastPlacedOrder) {
    return null;
  }

  return (
    <aside aria-label="AURA Консиерж Чат за Нарачки" className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 right-3 sm:right-6 z-50 flex flex-col items-end">
      {/* 1. EXPANDED CHAT WINDOW */}
      {isOrderChatBubbleOpen && (
        <div
          className={`w-[360px] sm:w-[390px] max-w-[calc(100vw-32px)] h-[520px] max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-3.5 border transition-all animate-in slide-in-from-bottom-5 duration-300 ${
            theme === "light"
              ? "bg-[#FFFFFF] border-[#E5DDD2] text-[#1A1614] shadow-black/15"
              : "bg-[#1A1614] border-[#2A2520] text-[#FAF6F0] shadow-black/60"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#A33D1E] via-[#C8522C] to-[#D49A55] p-4 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-[#141210] flex items-center justify-center font-black text-sm text-[#D49A55] border border-white/20 shadow-xs">
                  AU
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#141210] rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-black text-sm leading-tight text-white">
                  <span>AURA Консиерж</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#F5BA58]" />
                </div>
                <span className="text-[11px] text-white/85 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                  Нарачка #{lastPlacedOrder?.id} • Активна
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleOpen}
                className="p-1.5 rounded-xl hover:bg-black/20 text-white transition-colors cursor-pointer"
                title="Минимизирај"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOrderChatBubbleOpen(false);
                  setHasOrderNotification(false);
                  setLastPlacedOrder(null);
                  try {
                    sessionStorage.removeItem("aura_last_order");
                  } catch {}
                }}
                className="p-1.5 rounded-xl hover:bg-black/20 text-white transition-colors cursor-pointer"
                title="Затвори целосно"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div
            className={`flex-1 p-4 overflow-y-auto space-y-3 text-xs ${
              theme === "light" ? "bg-[#FAF7F2]" : "bg-[#141210]"
            }`}
          >
            {messages.map((m) => {
              if (m.isOrderCard && m.order) {
                return (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl border shadow-xs space-y-2.5 my-2 animate-in fade-in duration-200 ${
                      theme === "light"
                        ? "bg-white border-[#E5DDD2]"
                        : "bg-[#1F1C18] border-[#2A2520]"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-1.5 text-emerald-500 font-black text-xs uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Комплетирана нарачка</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#D49A55] bg-[#D49A55]/15 px-2 py-0.5 rounded-md">
                        #{m.order.id}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-[#8C8377]">Вкупно за плаќање:</span>
                        <span className="font-black text-[#F5BA58]">
                          {formatPrice(m.order.total || 0, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8C8377]">Начин на плаќање:</span>
                        <span className="font-semibold text-right truncate max-w-[170px]">
                          {m.order.paymentMethod || "Готовина"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8C8377]">Достава:</span>
                        <span className="font-semibold">{m.order.deliveryMethod || "Стандардна"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8C8377]">Адреса:</span>
                        <span className="font-semibold text-right truncate max-w-[170px]">
                          {m.order.address || "Адреса"}
                        </span>
                      </div>
                    </div>

                    {/* Purchased items preview */}
                    {Array.isArray(m.order.items) && m.order.items.length > 0 && (
                      <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {m.order.items.slice(0, 3).map((it, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 shrink-0 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg text-[10px]">
                            {it.image && (
                              <img
                                src={it.image}
                                alt={it.title || "производ"}
                                className="w-5 h-5 rounded object-cover"
                              />
                            )}
                            <span className="truncate max-w-[90px] font-medium">{it.title}</span>
                            <span className="text-[#8C8377]">x{it.quantity}</span>
                          </div>
                        ))}
                        {m.order.items.length > 3 && (
                          <span className="text-[10px] text-[#8C8377] font-bold">
                            +{m.order.items.length - 3} уште
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              const isBot = m.sender === "bot";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed shadow-xs text-xs ${
                      isBot
                        ? theme === "light"
                          ? "bg-white text-[#1A1614] border border-[#E5DDD2] rounded-tl-xs"
                          : "bg-[#25211D] text-[#FAF6F0] border border-[#2A2520] rounded-tl-xs"
                        : "bg-gradient-to-r from-[#C8522C] to-[#E26D46] text-white font-medium rounded-tr-xs"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-[#8C8377] mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 text-[11px] text-[#8C8377]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E26D46] animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#D49A55] animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#F5BA58] animate-bounce [animation-delay:0.4s]"></div>
                <span className="ml-1">AURA подготвува одговор...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips */}
          <div
            className={`px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 ${
              theme === "light" ? "bg-white border-[#E5DDD2]" : "bg-[#1A1614] border-[#2A2520]"
            }`}
          >
            <button
              type="button"
              onClick={() => handleSendMessage("Кога точно ќе ми стигне нарачката?")}
              className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors cursor-pointer flex items-center gap-1 ${
                theme === "light"
                  ? "bg-[#FAF7F2] border-[#E5DDD2] text-[#5C544B] hover:border-[#C84E25] hover:text-[#C84E25]"
                  : "bg-[#25211D] border-[#2A2520] text-[#A8A095] hover:border-[#E26D46] hover:text-[#FAF6F0]"
              }`}
            >
              <Truck className="w-3 h-3 text-[#D49A55]" /> Кога ќе стигне?
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("Може ли промена на адреса или податоци?")}
              className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors cursor-pointer flex items-center gap-1 ${
                theme === "light"
                  ? "bg-[#FAF7F2] border-[#E5DDD2] text-[#5C544B] hover:border-[#C84E25] hover:text-[#C84E25]"
                  : "bg-[#25211D] border-[#2A2520] text-[#A8A095] hover:border-[#E26D46] hover:text-[#FAF6F0]"
              }`}
            >
              <Phone className="w-3 h-3 text-[#D49A55]" /> Контакт / Промена
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOrderChatBubbleOpen(false);
                navigateTo("catalog");
              }}
              className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors cursor-pointer flex items-center gap-1 ${
                theme === "light"
                  ? "bg-[#FAF7F2] border-[#E5DDD2] text-[#5C544B] hover:border-[#C84E25] hover:text-[#C84E25]"
                  : "bg-[#25211D] border-[#2A2520] text-[#A8A095] hover:border-[#E26D46] hover:text-[#FAF6F0]"
              }`}
            >
              <Package className="w-3 h-3 text-[#D49A55]" /> Продолжи со купување
            </button>
          </div>

          {/* Interactive Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className={`p-3 border-t flex items-center gap-2 shrink-0 ${
              theme === "light" ? "bg-white border-[#E5DDD2]" : "bg-[#1A1614] border-[#2A2520]"
            }`}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Прашајте нешто за нарачката..."
              className={`flex-1 text-xs px-3.5 py-2 rounded-xl border focus:outline-none transition-colors ${
                theme === "light"
                  ? "bg-[#FAF7F2] border-[#E5DDD2] text-[#1A1614] focus:border-[#C84E25]"
                  : "bg-[#25211D] border-[#2A2520] text-[#FAF6F0] focus:border-[#E26D46]"
              }`}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-[#C8522C] to-[#E26D46] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition-opacity cursor-pointer shadow-md"
              title="Испрати"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 2. FLOATING CHAT BUBBLE BUTTON (When closed or alongside) */}
      {!isOrderChatBubbleOpen && (
        <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-300">
          {/* Sneak peek notification message pill */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleOpen}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl shadow-xl border text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                theme === "light"
                  ? "bg-white border-[#E5DDD2] text-[#1A1614]"
                  : "bg-[#1D1A17] border-[#2A2520] text-[#FAF6F0]"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Вашата нарачка #{lastPlacedOrder?.id} е завршена!</span>
              <span className="text-[10px] text-[#E26D46] font-black underline">Отвори чат &rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOrderChatBubbleOpen(false);
                setHasOrderNotification(false);
                setLastPlacedOrder(null);
                try {
                  sessionStorage.removeItem("aura_last_order");
                } catch {}
              }}
              className={`hidden sm:flex items-center justify-center w-7 h-7 rounded-xl border text-xs font-bold transition-all hover:bg-red-500/10 hover:text-red-500 cursor-pointer ${
                theme === "light"
                  ? "bg-white border-[#E5DDD2] text-[#5C544B]"
                  : "bg-[#1D1A17] border-[#2A2520] text-[#A8A095]"
              }`}
              title="Отстрани го известувањето"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Circular Chat Trigger Icon */}
          <button
            type="button"
            onClick={handleToggleOpen}
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#C8522C] via-[#E26D46] to-[#D49A55] text-white flex items-center justify-center shadow-2xl shadow-[#E26D46]/40 hover:scale-105 active:scale-95 transition-all border-2 border-white/20 cursor-pointer"
            title="Отвори известување за нарачката"
          >
            <MessageSquare className="w-6 h-6 fill-white text-white" />
            
            {/* Pulsing online badge */}
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#141210] rounded-full animate-pulse"></span>

            {/* Unread badge */}
            {hasOrderNotification && (
              <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#141210] shadow-sm animate-bounce">
                1
              </span>
            )}
          </button>
        </div>
      )}
    </aside>
  );
};
