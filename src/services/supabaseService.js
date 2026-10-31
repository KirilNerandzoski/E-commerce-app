import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { PRODUCTS } from "../data/products";
import { CATEGORIES } from "../data/categories";

const WORKRELAY_BASE_URL = "https://wayktzmupzrdcwosgnfg.supabase.co/functions/v1";
const PAZARMAX_WORKRELAY_KEY = "wr_live_7b847f2c1add3658421721c15cf87207a4e49dd73f02463871f1ee11204f0cc2";
const PAZARMAX_STORE_ID = "pazarmax";

// Both Supabase projects owned by the user (if workrelay_relay SQL is installed on either one, it will work!)
const SUPABASE_RELAY_TARGETS = [
  {
    url: "https://qjxwnnrnxyznjymkfseb.supabase.co",
    anonKey: "sb_publishable_S415xwwZoyj7bet3paR2pQ_mFPEBlsL",
  },
  {
    url: "https://svcixkmutoygzzcsepuf.supabase.co",
    anonKey: "sb_publishable_i4Z0UTE9y3wZ3uvj1EoCEA_NVM9y7y1",
  },
];

async function relayToWorkRelay(endpointPath, payloadBody) {
  // 1. Try server-to-server Supabase pg_net RPC (bypasses browser CORS preflight 405 completely)
  for (const target of SUPABASE_RELAY_TARGETS) {
    try {
      const rpcRes = await fetch(`${target.url}/rest/v1/rpc/workrelay_relay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: target.anonKey,
          Authorization: `Bearer ${target.anonKey}`,
        },
        body: JSON.stringify({
          endpoint_path: endpointPath,
          payload_body: payloadBody,
          store_id: PAZARMAX_STORE_ID,
          api_key: PAZARMAX_WORKRELAY_KEY,
        }),
      });

      if (rpcRes.ok) {
        const rpcData = await rpcRes.json().catch(() => ({}));
        return {
          status: 200,
          ok: true,
          via: "supabase_pg_net",
          data: {
            status: "processed",
            applied: Array.isArray(payloadBody?.products) ? payloadBody.products.length : 1,
            ...(typeof rpcData === "object" ? rpcData : { request_id: rpcData }),
          },
        };
      }
    } catch (rpcErr) {
      // Continue to next relay target
    }
  }

  // 2. Try direct POST (works in server/CLI or if WorkRelay enables CORS preflight)
  try {
    const res = await fetch(`${WORKRELAY_BASE_URL}${endpointPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PAZARMAX_WORKRELAY_KEY}`,
        "X-Store-Id": PAZARMAX_STORE_ID,
      },
      body: JSON.stringify(payloadBody),
    });

    const data = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, via: "direct", data };
  } catch (browserCorsErr) {
    return {
      status: 503,
      ok: false,
      needsSupabaseSql: true,
      error: browserCorsErr,
      data: {
        error: "cors_blocked_needs_supabase_relay",
      },
    };
  }
}

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
        return { data: PRODUCTS, error };
      }

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
    // 1. Immediately send to WorkRelay Webhook (via Supabase pg_net relay)
    this.sendToWorkRelay(orderData);

    // 2. Also push updated stock quietly (quiet: true) so automatic sales never spam channel notifications
    this.syncInventoryToWorkRelay(PRODUCTS, { quiet: true }).catch(() => {});

    if (!isSupabaseConfigured || !supabase) {
      return { data: orderData, error: null };
    }

    try {
      const payload = {
        id: orderData.id,
        user_id: typeof userId === "string" && userId.length === 36 ? userId : null,
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
      return { data, error };
    } catch (err) {
      console.warn("Supabase database insert note:", err);
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

      return await relayToWorkRelay("/order-webhook", wrPayload);
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

    if (!error && data?.user) {
      this.sendCustomerToWorkRelay({
        id: data.user.id,
        email: data.user.email || email,
        name: fullName,
        phone: phone,
        registeredAt: new Date().toISOString(),
      });
    }

    return { data, error };
  },

  // --- WORKRELAY CUSTOMER SIGNUP WEBHOOK ---
  async sendCustomerToWorkRelay(customer) {
    try {
      const payload = {
        event_id: `cust_${customer.id || Date.now()}:created`,
        event_type: "customer.created",
        occurred_at: new Date().toISOString(),
        customer: {
          external_id: String(customer.id || Date.now()),
          email: customer.email,
          name: customer.name || "Корисник",
          phone: customer.phone || undefined,
          registered_at: customer.registeredAt || new Date().toISOString(),
        },
      };

      return await relayToWorkRelay("/customer-webhook", payload);
    } catch (err) {
      console.warn("WorkRelay customer signup webhook failed:", err);
    }
  },

  // --- WORKRELAY INVENTORY SYNC PUSH ---
  async syncInventoryToWorkRelay(productsList = PRODUCTS, options = {}) {
    try {
      const formatted = (productsList || PRODUCTS).map((p) => ({
        sku: p.id,
        name: p.title,
        stock: p.stock ?? (p.inStock ? 10 : 0),
        notify_on: 5,
        price_minor: Math.round((Number(p.price) || 0) * 100),
        currency: "MKD",
        unit: "pcs",
        category: p.category,
        updated_at: new Date().toISOString(),
      }));

      const bodyPayload = {
        products: formatted,
      };

      if (options.quiet === true) {
        bodyPayload.quiet = true;
      } else if (options.syncedBy && typeof options.syncedBy === "object") {
        const syncedByPayload = {};
        if (options.syncedBy.name && String(options.syncedBy.name).trim()) {
          syncedByPayload.name = String(options.syncedBy.name).trim().slice(0, 120);
        }
        if (options.syncedBy.role && String(options.syncedBy.role).trim()) {
          syncedByPayload.role = String(options.syncedBy.role).trim().slice(0, 60);
        }
        if (Object.keys(syncedByPayload).length > 0) {
          bodyPayload.synced_by = syncedByPayload;
        }
      }

      return await relayToWorkRelay("/inventory-webhook", bodyPayload);
    } catch (err) {
      console.error("WorkRelay inventory sync error:", err);
      return { status: 500, error: err };
    }
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
