import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { PRODUCTS } from "../data/products";
import { CATEGORIES } from "../data/categories";

export const supabaseService = {
  isConfigured: isSupabaseConfigured,

  // --- PRODUCTS ---
  async getProducts() {
    if (!isSupabaseConfigured || !supabase) {
      return { data: PRODUCTS, error: null };
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        // Fallback to local mock data if table is empty or error
        return { data: PRODUCTS, error };
      }

      // Map snake_case database columns to frontend camelCase
      const mapped = data.map((item) => ({
        ...item,
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        price: Number(item.price),
        reviewCount: item.review_count,
        inStock: item.in_stock,
        isDirectDelivery: item.is_direct_delivery,
        isDealOfTheDay: item.is_deal_of_the_day,
        isBestSeller: item.is_best_seller,
        isTrending: item.is_trending,
        isNew: item.is_new,
        freeShipping: item.free_shipping,
      }));

      return { data: mapped, error: null };
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local products:", err);
      return { data: PRODUCTS, error: err };
    }
  },

  // --- CATEGORIES ---
  async getCategories() {
    if (!isSupabaseConfigured || !supabase) {
      return { data: CATEGORIES, error: null };
    }

    try {
      const { data, error } = await supabase.from("categories").select("*");
      if (error || !data || data.length === 0) {
        return { data: CATEGORIES, error };
      }
      return { data, error: null };
    } catch (err) {
      return { data: CATEGORIES, error: err };
    }
  },

  // --- ORDERS ---
  async createOrder(orderData, userId = null) {
    if (!isSupabaseConfigured || !supabase) {
      return { data: orderData, error: null };
    }

    try {
      const payload = {
        id: orderData.id,
        user_id: (typeof userId === "string" && userId.length === 36 ? userId : null),
        date: orderData.date,
        status: orderData.status,
        status_code: orderData.statusCode,
        tracking_number: orderData.trackingNumber,
        delivery_method: orderData.deliveryMethod,
        payment_method: orderData.paymentMethod,
        address: orderData.address,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        discount: orderData.discount,
        total: orderData.total,
        items: orderData.items,
        timeline: orderData.timeline,
      };

      const { data, error } = await supabase.from("orders").insert(payload).select().single();

      // Send directly to WorkRelay Webhook
      this.sendToWorkRelay(orderData);

      return { data, error };
    } catch (err) {
      console.error("Failed to insert order to Supabase:", err);
      return { data: orderData, error: err };
    }
  },

  // --- WORKRELAY WEBHOOK DISPATCH ---
  async sendToWorkRelay(orderData) {
    try {
      const items = (orderData.items || []).map((item) => ({
        sku: String(item.id || item.title || "ITEM").slice(0, 32),
        name: String(item.title || "Производ"),
        quantity: Number(item.quantity) || 1,
        unit_price_minor: Math.round((Number(item.price) || 0) * 100),
      }));

      const wrPayload = {
        event_id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        event_type: "order.created",
        occurred_at: new Date().toISOString(),
        order: {
          external_id: String(orderData.id),
          order_number: `#${orderData.id}`,
          currency: "MKD",
          customer: {
            name: orderData.customerName || "Купувач",
            email: orderData.customerEmail || "customer@pazarmax.mk",
          },
          totals: {
            subtotal_minor: Math.round(
              (Number(orderData.subtotal) || Number(orderData.total) || 0) * 100
            ),
            shipping_minor: Math.round((Number(orderData.shipping) || 0) * 100),
            total_minor: Math.round((Number(orderData.total) || 0) * 100),
          },
          status: "pending",
          payment_status: "paid",
          fulfillment_status: "unfulfilled",
          items:
            items.length > 0
              ? items
              : [
                  {
                    sku: "ITEM-1",
                    name: "Нарачка",
                    quantity: 1,
                    unit_price_minor: Math.round((Number(orderData.total) || 0) * 100),
                  },
                ],
        },
      };

      await fetch(
        "https://wayktzmupzrdcwosgnfg.supabase.co/functions/v1/order-webhook",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer wr_live_7b847f2c1add3658421721c15cf87207a4e49dd73f02463871f1ee11204f0cc2",
            "X-Store-Id": "pazarmax",
          },
          body: JSON.stringify(wrPayload),
        }
      );
    } catch (err) {
      console.warn("WorkRelay webhook dispatch failed:", err);
    }
  },

  async getUserOrders(userId) {
    if (!isSupabaseConfigured || !supabase || !userId) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) return { data: [], error };
      return { data, error: null };
    } catch (err) {
      return { data: [], error: err };
    }
  },

  // --- REVIEWS ---
  async addReview(reviewData) {
    if (!isSupabaseConfigured || !supabase) {
      return { data: reviewData, error: null };
    }

    try {
      const payload = {
        id: reviewData.id,
        product_id: reviewData.productId,
        user_name: reviewData.user,
        rating: reviewData.rating,
        date: reviewData.date,
        comment: reviewData.comment,
      };

      const { data, error } = await supabase.from("reviews").insert(payload).select().single();
      return { data, error };
    } catch (err) {
      return { data: reviewData, error: err };
    }
  },

  // --- AUTHENTICATION ---
  async signUp(email, password, fullName, phone) {
    if (!isSupabaseConfigured || !supabase) {
      return { error: { message: "Supabase не е конфигуриран. Додајте VITE_SUPABASE_URL во .env" } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });

    return { data, error };
  },

  async signIn(email, password) {
    if (!isSupabaseConfigured || !supabase) {
      return { error: { message: "Supabase не е конфигуриран. Додајте VITE_SUPABASE_URL во .env" } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  },

  async signOut() {
    if (!isSupabaseConfigured || !supabase) return { error: null };
    return await supabase.auth.signOut();
  },

  async getSession() {
    if (!isSupabaseConfigured || !supabase) return { session: null };
    const { data } = await supabase.auth.getSession();
    return data;
  },

  async updateProfile(userId, updates) {
    if (!isSupabaseConfigured || !supabase || !userId) {
      return { data: updates, error: null };
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
      .select()
      .single();

    return { data, error };
  },
};
