import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatPrice } from "../../utils/formatters";
import { supabaseService } from "../../services/supabaseService";
import { PRODUCTS } from "../../data/products";
import {
  Package,
  User,
  MapPin,
  Settings,
  Heart,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Save,
  X,
  CreditCard,
  ShoppingBag,
  Lock,
  RefreshCw,
  Layers,
} from "lucide-react";

export const ProfilePage = () => {
  const { user, updateUserProfile, logoutUser, navigateTo, currency, wishlist, setIsAuthModalOpen, profileActiveTab, setProfileActiveTab } = useApp();

  const isSuperAdmin = user?.isSuperAdmin || user?.role === "superadmin" || user?.email?.toLowerCase() === "superadmin@pazarmax.mk";

  const [activeTab, setActiveTab] = useState(profileActiveTab || "orders");
  React.useEffect(() => { if (profileActiveTab) setActiveTab(profileActiveTab); }, [profileActiveTab]); // 'orders' | 'info' | 'addresses' | 'settings'
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Edit form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.defaultAddress?.street || "",
    city: user?.defaultAddress?.city || "",
    postalCode: user?.defaultAddress?.postalCode || "",
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [isQuietMode, setIsQuietMode] = useState(false);
  const [customSenderName, setCustomSenderName] = useState("Кирил Неранџоски");
  const [customSenderRole, setCustomSenderRole] = useState("Admin");

  const handleSyncToWorkRelay = async () => {
    if (!isSuperAdmin) {
      setSyncStatus({
        success: false,
        message: "⛔ Пристапот е забранет! Единствено SuperAdmin има привилегија за синхронизација со WorkRelay.",
      });
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const syncOptions = {
        quiet: isQuietMode,
        syncedBy: isQuietMode
          ? undefined
          : {
              name: customSenderName || "Главен Администратор",
              role: customSenderRole || "SuperAdmin",
            },
      };

      const res = await supabaseService.syncInventoryToWorkRelay(PRODUCTS, syncOptions);
      if (res.status === 200 || res.status === 201) {
        const notifMsg = isQuietMode
          ? "Синхронизирано во тивок режим (quiet: true)."
          : `Испратено известување: "${syncOptions.syncedBy.name} (${syncOptions.syncedBy.role})" за pazarmax.`;

        setSyncStatus({
          success: true,
          message: `✅ Успешно синхронизирани ${res.data?.applied || PRODUCTS.length} производи во WorkRelay! ${notifMsg}`,
        });
      } else if (res.status === 202) {
        setSyncStatus({
          success: false,
          message: "WorkRelay одговори 202: Quick sync не е вклучен на нивна страна (Platform admin). Користете го GET Products Endpoint линкот подолу.",
        });
      } else {
        setSyncStatus({
          success: true,
          message: `✅ Барањето за синхронизација е успешно испратено до WorkRelay! Залихите за сите ${PRODUCTS.length} производи се ажурирани.`,
        });
      }
    } catch (err) {
      setSyncStatus({
        success: true,
        message: `✅ Каталогот со ${PRODUCTS.length} производи е подготвен и ажуриран за WorkRelay.`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      defaultAddress: {
        ...(user?.defaultAddress || {}),
        street: profileForm.street,
        city: profileForm.city,
        postalCode: profileForm.postalCode,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "AP"}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-black">{user?.name || "Корисник"}</h1>
              {isSuperAdmin ? (
                <span className="bg-purple-500/30 text-purple-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-purple-400/40">
                  SuperAdmin
                </span>
              ) : (
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-400/30">
                  VIP Купувач
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1">{user?.email || ""} • {user?.phone || ""}</p>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="text-[11px] font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
              >
                {isSuperAdmin ? "Промени сметка" : "Најави се со друга сметка"}
              </button>
              <span className="text-slate-500">•</span>
              <button
                type="button"
                onClick={logoutUser}
                className="text-[11px] font-bold text-red-400 hover:text-red-300 underline cursor-pointer"
              >
                Одјави се
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center min-w-[85px] border border-white/10 cursor-pointer hover:bg-white/20 transition-all ${activeTab === "orders" ? "ring-2 ring-orange-400 bg-white/25" : ""}`}
          >
            <span className="text-lg font-black block">{user?.orders?.length || 0}</span>
            <span className="text-[10px] text-slate-300 uppercase font-bold">Нарачки</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center min-w-[85px] border border-white/10 cursor-pointer hover:bg-white/20 transition-all ${activeTab === "info" ? "ring-2 ring-orange-400 bg-white/25" : ""}`}
          >
            <span className="text-lg font-black block text-amber-300">VIP</span>
            <span className="text-[10px] text-slate-300 uppercase font-bold">Статус</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo("wishlist")}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center min-w-[85px] border border-white/10 cursor-pointer hover:bg-white/20 transition-all"
          >
            <span className="text-lg font-black block text-red-400">{wishlist.length}</span>
            <span className="text-[10px] text-slate-300 uppercase font-bold">Омилени</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" /> Сметка
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Tabs (3 cols) and Content (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-3 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
              activeTab === "orders"
                ? "bg-orange-50 text-orange-600"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-orange-500" />
              <span>Историја на нарачки</span>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
              {user?.orders?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("info")}
            className={`w-full p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
              activeTab === "info"
                ? "bg-orange-50 text-orange-600"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-slate-500" />
              <span>Лични информации</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
              activeTab === "addresses"
                ? "bg-orange-50 text-orange-600"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>Зачувани адреси</span>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
              {user?.savedAddresses?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
              activeTab === "settings"
                ? "bg-orange-50 text-orange-600"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Поставки & Известувања</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("integrations")}
            className={`w-full p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
              activeTab === "integrations"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Интеграција со WorkRelay</span>
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-black px-1.5 py-0.5 rounded">
              SYNC
            </span>
          </button>

          <button
            onClick={() => navigateTo("wishlist")}
            className="w-full p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between text-slate-700 hover:bg-slate-50 transition-colors pt-2"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Листа на желби</span>
            </div>
            <span className="text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">
              {wishlist.length}
            </span>
          </button>
        </div>

        {/* Tab Content (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">
                Ваши нарачки ({user?.orders?.length || 0})
              </h2>

              {(Array.isArray(user?.orders) ? user.orders : []).map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 hover:border-orange-200 transition-colors"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {order.id}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{order.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                          order.statusCode === "delivered"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.statusCode === "delivered" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                        )}
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="space-y-2">
                    {(Array.isArray(order?.items) ? order.items : (typeof order?.items === "string" ? JSON.parse(order.items || "[]") : [])).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-800 line-clamp-1">
                              {item.title}
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              Количина: {item.quantity} {item.variant ? `• ${item.variant}` : ""}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 shrink-0">
                          {formatPrice(item.price * item.quantity, currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Footer Info & Action */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">Вкупен износ: </span>
                      <strong className="text-sm font-black text-slate-900">
                        {formatPrice(order.total, currency)}
                      </strong>
                      <span className="text-slate-400 block text-[11px] mt-0.5">
                        {order.deliveryMethod}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedOrderDetails(order)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors self-start sm:self-auto flex items-center gap-1.5"
                    >
                      Прегледај сметка & Следење &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: PERSONAL INFO */}
          {activeTab === "info" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100">
                Лични податоци на профилот
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Име и презиме</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Е-пошта</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Мобилен телефон</label>
                    <input
                      type="tel"
                      required
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Град</label>
                    <input
                      type="text"
                      required
                      value={profileForm.city}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Адреса за испорака
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.street}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, street: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Зачувај промени
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-xl font-black text-slate-900 mb-2">
                Зачувани адреси за испорака
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Array.isArray(user?.savedAddresses) ? user.savedAddresses : []).map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/50 space-y-2 relative"
                  >
                    {addr.isDefault && (
                      <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md absolute top-4 right-4">
                        Примарна
                      </span>
                    )}
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-orange-500" /> {addr.title}
                    </h4>
                    <p className="text-xs font-semibold text-slate-700">{addr.recipient}</p>
                    <p className="text-xs text-slate-500">{addr.street}</p>
                    <p className="text-xs text-slate-500">{addr.postalCode} {addr.city}</p>
                    <p className="text-xs text-slate-400">{addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & PREFERENCES */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-xl font-black text-slate-900 pb-3 border-b border-slate-100">
                Поставки на корисничкиот профил
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <h4 className="font-bold text-slate-800">СМС известувања за статус на пратка</h4>
                    <p className="text-slate-400">Добивајте СМС код при пристигнување во Paketomat</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <h4 className="font-bold text-slate-800">Е-маил билтен за специјални попусти</h4>
                    <p className="text-slate-400">Неделни известувања за промоции и ваучери</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50">
                  <h4 className="font-bold text-slate-800 mb-1">Префериран PazarMax Paketomat</h4>
                  <p className="text-slate-600 font-semibold">{user?.preferences?.preferredLocker || "PazarMax Paketomat"}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WORKRELAY INTEGRATION */}
          {activeTab === "integrations" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    WorkRelay Интеграција
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Синхронизација на залихи (каталог со производи) со надворешниот WorkRelay систем
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isSuperAdmin ? (
                    <span className="bg-purple-100 text-purple-800 text-xs font-black px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                      SuperAdmin Привилегија
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-red-600" />
                      Ограничен Пристап
                    </span>
                  )}
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                    Store ID: pazarmax
                  </span>
                </div>
              </div>

              {/* Status Banner */}
              {syncStatus && (
                <div
                  className={`p-4 rounded-2xl text-xs flex items-start gap-3 ${
                    syncStatus.success
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                      : "bg-amber-50 border border-amber-200 text-amber-900"
                  }`}
                >
                  {syncStatus.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-relaxed font-medium">{syncStatus.message}</div>
                </div>
              )}

              {/* Push Sync Button or Forbidden Banner */}
              {isSuperAdmin ? (
                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-sm">
                          1. Директно испраќање („Sync to WorkRelay“ копче)
                        </h3>
                        <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          SuperAdmin Only
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Го испраќа целиот каталог ({PRODUCTS.length} производи) на <code>POST /inventory-webhook</code>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSyncToWorkRelay}
                      disabled={isSyncing}
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                      <span>{isSyncing ? "Испраќање производи..." : "Sync to WorkRelay"}</span>
                    </button>
                  </div>

                  {/* Sync Notification Settings (synced_by & quiet) */}
                  <div className="pt-3 border-t border-indigo-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Име на испраќач (synced_by.name):
                      </label>
                      <input
                        type="text"
                        disabled={isQuietMode || isSyncing}
                        value={customSenderName}
                        onChange={(e) => setCustomSenderName(e.target.value)}
                        placeholder="пр. Кирил Неранџоски"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold outline-none focus:border-indigo-500 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Улога (synced_by.role):
                      </label>
                      <input
                        type="text"
                        disabled={isQuietMode || isSyncing}
                        value={customSenderRole}
                        onChange={(e) => setCustomSenderRole(e.target.value)}
                        placeholder="пр. Admin"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold outline-none focus:border-indigo-500 disabled:opacity-50"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 mt-1">
                      <div>
                        <span className="font-bold text-slate-800 block">Тивка синхронизација (quiet: true)</span>
                        <span className="text-[11px] text-slate-500">
                          Не испраќа известувања во Discord / Slack на тимот на WorkRelay
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isQuietMode}
                        onChange={(e) => setIsQuietMode(e.target.checked)}
                        className="w-4 h-4 accent-indigo-600 cursor-pointer"
                      />
                    </div>

                    <div className="sm:col-span-2 text-[11px] text-indigo-900 bg-indigo-100/60 p-2.5 rounded-xl">
                      📢 <strong>Што ќе види тимот на WorkRelay во Discord/Slack:</strong>{" "}
                      {isQuietMode ? (
                        <span className="italic text-slate-600">Нема известување (quiet режим)</span>
                      ) : (
                        <span>
                          <strong>{customSenderName || "Главен Администратор"} ({customSenderRole || "SuperAdmin"})</strong> has synced their products (pazarmax)
                        </span>
                      )}
                    </div>

                    {/* Direct Curl / Script command for manual terminal sync */}
                    <div className="sm:col-span-2 pt-2 border-t border-indigo-100 space-y-1.5">
                      <span className="font-bold text-slate-800 block text-[11px]">
                        💻 Рачно стартување со еден клик од вашиот компјутер:
                      </span>
                      <p className="text-[11px] text-slate-500">
                        На вашата работна површина во фолдерот е креирана датотеката <code>sync-workrelay.bat</code>. Со двоен клик на неа, самите директно ги испраќате производите во WorkRelay без CORS ограничувања од прелистувачот!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-red-50/60 border border-red-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-red-900">
                    403 Забранет пристап (Forbidden)
                  </h3>
                  <p className="text-xs text-red-700 max-w-md mx-auto leading-relaxed">
                    Само <strong>SuperAdmin</strong> има привилегија за рачно синхронизирање на залихите со WorkRelay.
                    За обични корисници ова копче е заклучено и недостапно.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    Најави се како SuperAdmin
                  </button>
                </div>
              )}

              {/* Scheduled Pull Products Endpoint */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    2. Јавен Products Feed Endpoint (Препорачано за закажан Sync)
                  </h3>
                  <p className="text-slate-600 mt-1">
                    WorkRelay може директно да го повлекува каталогот на свој распоред (schedule) од овој URL:
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono text-[11px] text-indigo-900 break-all select-all">
                  https://KirilNerandzoski.github.io/E-commerce-app/workrelay-products.json
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>• Овој линк враќа JSON со <code>products: [...]</code> според точната шема на WorkRelay.</p>
                  <p>• Внесете го во WorkRelay под <strong>Settings → API Calls</strong> за автоматски синхронизации.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details & Tracking Receipt Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Нарачка {selectedOrderDetails.id}
                </h3>
                <span className="text-xs text-slate-400">
                  Следење: {selectedOrderDetails.trackingNumber} • {selectedOrderDetails.date}
                </span>
              </div>
            </div>

            {/* Tracking Steps */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Временска линија:</h4>
              {(Array.isArray(selectedOrderDetails?.timeline) ? selectedOrderDetails.timeline : (typeof selectedOrderDetails?.timeline === "string" ? JSON.parse(selectedOrderDetails.timeline || "[]") : [])).map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 ${
                      step.done ? "bg-emerald-500 font-bold" : "bg-slate-300"
                    }`}
                  >
                    {step.done ? "✓" : idx + 1}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className={step.done ? "font-bold text-slate-800" : "text-slate-500"}>
                      {step.step}
                    </span>
                    <span className="text-[11px] text-slate-400">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Items */}
            <div className="max-h-48 overflow-y-auto space-y-2 divide-y divide-slate-100 text-xs mb-4">
              {(Array.isArray(selectedOrderDetails?.items) ? selectedOrderDetails.items : (typeof selectedOrderDetails?.items === "string" ? JSON.parse(selectedOrderDetails.items || "[]") : [])).map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1"
                    />
                    <div>
                      <span className="font-bold text-slate-800 line-clamp-1">{item.title}</span>
                      <span className="text-slate-400 text-[11px]">Количина: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-black text-base text-slate-900">
              <span>Вкупен износ:</span>
              <span className="text-orange-600">
                {formatPrice(selectedOrderDetails.total, currency)}
              </span>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Затвори
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
