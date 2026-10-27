import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS } from "../data/products";
import { INITIAL_USER } from "../data/mockUserData";
import { COUPONS } from "../data/coupons";
import { FREE_SHIPPING_THRESHOLD } from "../utils/formatters";
import { supabaseService } from "../services/supabaseService";
import { supabase } from "../lib/supabase";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Products list (can receive new user reviews live)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("pazarmax_products");
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  // Currency
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("pazarmax_currency") || "MKD";
  });

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("pazarmax_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist (IDs)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("pazarmax_wishlist");
      return saved ? JSON.parse(saved) : ["prod-1", "prod-8", "prod-14"];
    } catch {
      return ["prod-1", "prod-8", "prod-14"];
    }
  });

  // Compare List (IDs, max 4)
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem("pazarmax_compare");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recently Viewed (IDs)
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem("pazarmax_recent");
      return saved ? JSON.parse(saved) : ["prod-2", "prod-3", "prod-5", "prod-9"];
    } catch {
      return ["prod-2", "prod-3", "prod-5", "prod-9"];
    }
  });

  // User Profile
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("pazarmax_user");
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Active View / Route
  // "home" | "catalog" | "product" | "cart" | "checkout" | "wishlist" | "profile"
  const [currentView, setCurrentView] = useState("home");
  const [currentProductId, setCurrentProductId] = useState(null);
  const [profileActiveTab, setProfileActiveTab] = useState("orders");

  // Catalog Filters & Search
  const [catalogFilters, setCatalogFilters] = useState({
    category: "all",
    subcategory: null,
    search: "",
    minPrice: 0,
    maxPrice: 150000,
    selectedBrands: [],
    minRating: 0,
    inStockOnly: false,
    discountOnly: false,
    directOnly: false,
    freeShippingOnly: false,
    sortBy: "popularity", // 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'newest'
  });

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Fetch live products from Supabase on mount if configured
  useEffect(() => {
    if (supabaseService.isConfigured) {
      supabaseService.getProducts().then(({ data }) => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      });


    }
  }, []);

  // Listen to Supabase auth state changes if configured
  useEffect(() => {
    if (supabase && supabaseService.isConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser((prev) => ({
              ...prev,
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || prev.name,
              phone: session.user.user_metadata?.phone || prev.phone,
            }));
          }
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("pazarmax_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("pazarmax_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("pazarmax_compare", JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem("pazarmax_recent", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem("pazarmax_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("pazarmax_currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("pazarmax_products", JSON.stringify(products));
  }, [products]);

  // Toast Helper
  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation Helper
  const navigateTo = (view, payload = null) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (view === "product" && payload) {
      setCurrentProductId(payload);
      trackProductView(payload);
    } else if (view === "profile" && payload) {
      setProfileActiveTab(payload);
    } else if (view === "catalog" && payload) {
      if (typeof payload === "string") {
        setCatalogFilters((prev) => ({
          ...prev,
          category: payload,
          subcategory: null,
          search: "",
        }));
      } else if (typeof payload === "object") {
        setCatalogFilters((prev) => ({
          ...prev,
          ...payload,
        }));
      }
    }
    setCurrentView(view);
  };

  // Track Recently Viewed
  const trackProductView = (productId) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  };

  // Cart operations
  const addToCart = (product, quantity = 1, variant = null, secondaryVariant = null) => {
    const cartItemId = `${product.id}-${variant || "standard"}-${secondaryVariant || "standard"}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock || 99),
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            product,
            quantity: Math.min(quantity, product.stock || 99),
            variant,
            secondaryVariant,
          },
        ];
      }
    });

    addToast(`"${product.title.slice(0, 32)}..." додадено во кошничка!`, "success");
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const validQty = Math.min(newQty, item.product.stock || 99);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    addToast("Производот е отстранет од кошничката", "info");
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId) => {
    const product = products.find((p) => p.id === productId);
    const prodName = product ? product.title.slice(0, 28) + "..." : "Производот";

    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      addToast(`${prodName} отстранет од омилени`, "info");
    } else {
      setWishlist((prev) => [...prev, productId]);
      addToast(`${prodName} додаден во омилени ❤️`, "success");
    }
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Compare operations
  const toggleCompare = (productId) => {
    const product = products.find((p) => p.id === productId);
    const prodName = product ? product.title.slice(0, 24) + "..." : "Производот";

    if (compareList.includes(productId)) {
      setCompareList((prev) => prev.filter((id) => id !== productId));
      addToast(`${prodName} отстранет од споредба`, "info");
    } else {
      if (compareList.length >= 4) {
        addToast("Можете да споредувате најмногу 4 производи истовремено!", "warning");
        return;
      }
      setCompareList((prev) => [...prev, productId]);
      addToast(`${prodName} додаден за споредба ⚖️`, "success");
    }
  };

  const isInCompare = (productId) => compareList.includes(productId);

  const clearCompare = () => {
    setCompareList([]);
  };

  // Coupons
  const applyCoupon = (code) => {
    if (!code) return { success: false, message: "Внесете купон код" };
    const cleaned = code.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code === cleaned);

    if (!found) {
      addToast("Невалиден или истечен купон код", "warning");
      return { success: false, message: "Невалиден купон" };
    }

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (found.minSpend && subtotal < found.minSpend) {
      addToast(`Овој купон важи за нарачки над ${found.minSpend.toLocaleString()} ден.`, "warning");
      return { success: false, message: "Не е исполнет минималниот износ" };
    }

    setAppliedCoupon(found);
    addToast(`Купонот ${found.code} е успешно активиран!`, "success");
    return { success: true, coupon: found };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast("Купонот е отстранет", "info");
  };

  // Cart Totals Calculation
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.type === "fixed") {
      cartDiscount = appliedCoupon.discountAmount;
    }
  }

  const isFreeShippingByAmount = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const isFreeShippingByCoupon = appliedCoupon?.type === "shipping" || appliedCoupon?.freeShipping;
  const standardShippingCost = cart.length === 0 || isFreeShippingByAmount || isFreeShippingByCoupon ? 0 : 150;

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + standardShippingCost);
  const cartTotalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout & Order Placement (with Supabase sync)
  const placeOrder = async (orderData) => {
    const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date();
    const dateFormatted = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${today.getFullYear()}`;

    const newOrder = {
      id: newOrderId,
      date: dateFormatted,
      status: "Во обработка",
      statusCode: "processing",
      trackingNumber: `PM-MK-${Math.floor(100000 + Math.random() * 900000)}`,
      deliveryMethod: orderData.deliveryMethodName || "Стандардна достава",
      paymentMethod: orderData.paymentMethodName || "Готовина при достава",
      address: `${orderData.address.street}, ${orderData.address.city}`,
      subtotal: cartSubtotal,
      shipping: orderData.shippingFee ?? standardShippingCost,
      discount: cartDiscount,
      total: Math.max(0, cartSubtotal - cartDiscount + (orderData.shippingFee ?? standardShippingCost)),
      items: cart.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
        variant: item.variant,
      })),
      timeline: [
        { step: "Нарачката е успешно креирана", date: `${dateFormatted} ${today.getHours()}:${today.getMinutes().toString().padStart(2, "0")}`, done: true },
        { step: "Подготовка во PazarMax централен магацин", date: "Очекувано денес", done: false },
        { step: "Преземање од брза пошта", date: "Очекувано утре", done: false },
        { step: "Достава на вашата адреса", date: "Очекувано за 24-48h", done: false },
      ],
    };

    // Save to local user state
    setUser((prev) => ({
      ...prev,
      orders: [newOrder, ...(Array.isArray(prev?.orders) ? prev.orders : [])],
    }));

    // Also persist to Supabase if configured
    if (supabaseService.isConfigured) {
      supabaseService.createOrder(newOrder, user?.id);
    }

    setLastPlacedOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);
    if (supabaseSuccess) {
      addToast(`Нарачката ${newOrderId} е зачувана во Supabase базата!`, "success");
    } else {
      addToast(`Нарачката ${newOrderId} е успешно креирана!`, "success");
    }
    return newOrder;
  };

  // Add review to product live (with Supabase sync)
  const addReviewToProduct = (productId, newReview) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const currentReviews = prod.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const newAvgRating = +(
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
          ).toFixed(1);

          return {
            ...prod,
            reviews: updatedReviews,
            rating: newAvgRating,
            reviewCount: updatedReviews.length,
          };
        }
        return prod;
      })
    );

    // Also persist to Supabase if configured
    if (supabaseService.isConfigured) {
      supabaseService.addReview({ ...newReview, productId });
    }

    addToast("Вашата рецензија е успешно објавена!", "success");
  };

  // Update user profile info (with Supabase sync)
  const updateUserProfile = (updatedData) => {
    setUser((prev) => ({
      ...prev,
      ...updatedData,
    }));

    if (supabaseService.isConfigured && user?.id) {
      supabaseService.updateProfile(user.id, {
        full_name: updatedData.name,
        phone: updatedData.phone,
        street: updatedData.defaultAddress?.street,
        city: updatedData.defaultAddress?.city,
        postal_code: updatedData.defaultAddress?.postalCode,
      });
    }

    addToast("Профилот е успешно ажуриран!", "success");
  };

  return (
    <AppContext.Provider
      value={{
        products,
        currency,
        setCurrency,
        cart,
        cartSubtotal,
        cartDiscount,
        standardShippingCost,
        cartTotal,
        cartTotalItemsCount,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        toggleCompare,
        clearCompare,
        isInCompare,
        recentlyViewed,
        trackProductView,
        user,
        setUser,
        updateUserProfile,
        currentView,
        currentProductId,
        navigateTo,
        profileActiveTab,
        setProfileActiveTab,
        catalogFilters,
        setCatalogFilters,
        quickViewProduct,
        setQuickViewProduct,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        placeOrder,
        lastPlacedOrder,
        setLastPlacedOrder,
        addReviewToProduct,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
