import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const FALLBACK_STATE_FILE = path.resolve(process.cwd(), ".r17-store-fallback.json");
const SHIPPING_THRESHOLD = 3000;
const SHIPPING_FEE = 99;
const CURRENCY = "INR";

const defaultStoreProducts = [
  {
    name: "R17 Pro Combat Jersey",
    category: "Jerseys",
    price: 2999,
    stock: 48,
    badge: "BESTSELLER",
    featured: true,
    isActive: true,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
    desc: "Official team jersey. Moisture-wicking tactical mesh.",
  },
  {
    name: "R17 Elite Hoodie",
    category: "Hoodies",
    price: 3499,
    stock: 22,
    badge: "NEW",
    featured: true,
    isActive: true,
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
    desc: "Heavyweight premium hoodie with embroidered R17 crest.",
  },
  {
    name: "R17 Tactical Cap",
    category: "Caps",
    price: 1199,
    stock: 75,
    badge: "",
    featured: false,
    isActive: true,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
    desc: "Structured 6-panel cap with tactical flat brim.",
  },
  {
    name: "R17 Gaming Sleeve - Crimson",
    category: "Sleeves",
    price: 799,
    stock: 130,
    badge: "LIMITED",
    featured: false,
    isActive: true,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    desc: "Anti-sweat compression arm sleeve for peak performance.",
  },
  {
    name: "R17 XL Control Mousepad",
    category: "Mousepads",
    price: 1599,
    stock: 60,
    badge: "FEATURED",
    featured: true,
    isActive: true,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    desc: "Desk-size precision cloth surface. 900x400mm tactical edition.",
  },
  {
    name: "R17 Dog Tag Set",
    category: "Accessories",
    price: 699,
    stock: 200,
    badge: "LIMITED",
    featured: false,
    isActive: true,
    image: "https://images.unsplash.com/photo-1620912189875-e3543dc34fde?w=800&q=80",
    desc: "Stainless steel tags with R17 unit designation engraving.",
  },
];

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function nowIso() {
  return new Date().toISOString();
}

function sanitizeStoreProduct(data = {}) {
  return {
    name: String(data.name || "").trim(),
    category: String(data.category || "Accessories").trim(),
    price: Number(data.price) || 0,
    stock: Number(data.stock) || 0,
    badge: String(data.badge || "").trim(),
    featured: Boolean(data.featured),
    isActive: data.isActive !== false,
    image: String(data.image || "").trim(),
    desc: String(data.desc || "").trim(),
    sortOrder: Number.isFinite(Number(data.sortOrder)) ? Number(data.sortOrder) : 0,
  };
}

function getDefaultStoreProductId(product = {}) {
  return String(product.name || "product")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeItems(items = []) {
  if (!Array.isArray(items) || !items.length) {
    throw validationError("Cart is empty");
  }

  return items.map((item) => {
    const productId = String(item.productId || item.id || "").trim();
    if (!productId) throw validationError("A product in your cart is missing its ID");

    return {
      productId,
      quantity: Math.max(1, Number(item.quantity) || 1),
      selectedSize: String(item.selectedSize || ""),
    };
  });
}

function totalQuantityByProduct(items) {
  return items.reduce((totals, item) => {
    totals.set(item.productId, (totals.get(item.productId) || 0) + item.quantity);
    return totals;
  }, new Map());
}

function fingerprintPayload(items, pricing) {
  return {
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
    })),
    subtotal: pricing.subtotal,
    shippingFee: pricing.shippingFee,
    total: pricing.total,
    currency: pricing.currency,
  };
}

function createInitialState() {
  const storeProducts = defaultStoreProducts.map((product, index) => ({
    id: getDefaultStoreProductId(product),
    ...sanitizeStoreProduct({ ...product, sortOrder: index }),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

  return {
    storeProducts,
    paymentAttempts: {},
    storeOrders: {},
  };
}

function readFallbackState() {
  try {
    if (!fs.existsSync(FALLBACK_STATE_FILE)) return createInitialState();
    const raw = fs.readFileSync(FALLBACK_STATE_FILE, "utf8").trim();
    if (!raw) return createInitialState();

    const parsed = JSON.parse(raw);
    return {
      ...createInitialState(),
      ...parsed,
      storeProducts: Array.isArray(parsed.storeProducts) && parsed.storeProducts.length
        ? parsed.storeProducts
        : createInitialState().storeProducts,
      paymentAttempts: parsed.paymentAttempts || {},
      storeOrders: parsed.storeOrders || {},
    };
  } catch {
    return createInitialState();
  }
}

function writeFallbackState(state) {
  fs.writeFileSync(FALLBACK_STATE_FILE, JSON.stringify(state, null, 2));
}

function updateFallbackState(mutator) {
  const state = readFallbackState();
  const nextState = mutator(state) || state;
  writeFallbackState(nextState);
  return nextState;
}

export function isFirestoreConnectivityError(error) {
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("unable to get local issuer certificate") ||
    message.includes("no connection established") ||
    message.includes("unavailable") ||
    Number(error?.code) === 14
  );
}

export async function getFallbackStoreProducts() {
  return readFallbackState().storeProducts;
}

export function calculateFallbackPricing(orderData = {}) {
  const items = normalizeItems(orderData.items);
  const quantitiesByProduct = totalQuantityByProduct(items);
  const state = readFallbackState();
  const productsById = new Map();

  for (const [productId, requestedQuantity] of quantitiesByProduct.entries()) {
    let product = state.storeProducts.find((entry) => entry.id === productId);
    if (!product) {
      const normalizedQuery = getDefaultStoreProductId({ name: productId });
      product = state.storeProducts.find((entry) => getDefaultStoreProductId(entry) === normalizedQuery || String(entry.id || "").trim().toLowerCase() === String(productId || "").trim().toLowerCase());
    }
    if (!product) {
      throw validationError("A product in your cart is no longer available");
    }
    if (product.isActive === false) {
      throw validationError(`${product.name || "This product"} is currently unavailable`);
    }

    const currentStock = Number(product.stock) || 0;
    if (currentStock < requestedQuantity) {
      throw validationError(`${product.name || "This product"} has only ${currentStock} left in stock`);
    }

    productsById.set(productId, product);
  }

  const pricedItems = items.map((item) => {
    const product = productsById.get(item.productId);
    const unitPrice = Number(product?.price) || 0;

    return {
      ...item,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    };
  });

  const subtotal = pricedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingFee = subtotal > 0 && subtotal < SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  const total = subtotal + shippingFee;
  const pricing = {
    items,
    pricedItems,
    subtotal,
    shippingFee,
    total,
    amountInPaise: Math.round(total * 100),
    currency: CURRENCY,
  };
  const fingerprint = crypto
    .createHash("sha256")
    .update(JSON.stringify(fingerprintPayload(items, pricing)))
    .digest("hex");

  return {
    ...pricing,
    fingerprint,
  };
}

export async function saveFallbackPaymentAttempt(razorpayOrder, pricing) {
  updateFallbackState((state) => {
    state.paymentAttempts[razorpayOrder.id] = {
      razorpayOrderId: razorpayOrder.id,
      amount: pricing.amountInPaise,
      currency: pricing.currency,
      cartFingerprint: pricing.fingerprint,
      status: "created",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    return state;
  });
}

export async function getFallbackPaymentAttempt(razorpayOrderId) {
  const state = readFallbackState();
  const paymentAttempt = state.paymentAttempts[razorpayOrderId];
  if (!paymentAttempt) {
    throw validationError("Payment session was not found. Please start checkout again.");
  }

  return paymentAttempt;
}

export async function markFallbackPaymentAttemptCompleted(razorpayOrderId, storeOrderId) {
  updateFallbackState((state) => {
    const attempt = state.paymentAttempts[razorpayOrderId];
    if (attempt) {
      attempt.status = "completed";
      attempt.storeOrderId = storeOrderId;
      attempt.updatedAt = nowIso();
    }
    return state;
  });
}

export async function createFallbackStoreOrder(orderData) {
  const itemRequests = Array.isArray(orderData.items) ? orderData.items : [];
  if (!itemRequests.length) throw validationError("Cart is empty");

  const normalizedItems = itemRequests.map((item) => {
    const productId = String(item.productId || item.id || "").trim();
    if (!productId) throw validationError("A product in your cart is missing its ID");

    return {
      productId,
      quantity: Math.max(1, Number(item.quantity) || 1),
      selectedSize: item.selectedSize || "",
    };
  });

  const state = readFallbackState();
  const productQuantities = normalizedItems.reduce((totals, item) => {
    totals.set(item.productId, (totals.get(item.productId) || 0) + item.quantity);
    return totals;
  }, new Map());

  const productsById = new Map();
  let subtotal = 0;
  const orderItems = [];

  for (const productId of productQuantities.keys()) {
    let productIndex = state.storeProducts.findIndex((entry) => entry.id === productId);
    if (productIndex < 0) {
      const normalizedQuery = getDefaultStoreProductId({ name: productId });
      productIndex = state.storeProducts.findIndex((entry) => getDefaultStoreProductId(entry) === normalizedQuery || String(entry.id || "").trim().toLowerCase() === String(productId || "").trim().toLowerCase());
    }
    if (productIndex < 0) {
      throw validationError("A product in your cart is no longer available");
    }

    const product = state.storeProducts[productIndex];
    if (product.isActive === false) {
      throw validationError(`${product.name} is currently unavailable`);
    }

    const currentStock = Number(product.stock) || 0;
    const requestedQuantity = productQuantities.get(productId);
    if (currentStock < requestedQuantity) {
      throw validationError(`${product.name} has only ${currentStock} left in stock`);
    }

    productsById.set(productId, {
      productIndex,
      product,
      currentStock,
      requestedQuantity,
    });
  }

  for (const item of normalizedItems) {
    const { product } = productsById.get(item.productId);
    const unitPrice = Number(product.price) || 0;
    subtotal += unitPrice * item.quantity;
    orderItems.push({
      productId: item.productId,
      name: product.name || "",
      category: product.category || "",
      image: product.image || "",
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    });
  }

  const shippingFee = Number(orderData.shippingFee) || 0;
  const total = subtotal + shippingFee;
  const paymentMethod = orderData.paymentMethod || "cod";
  const payment = orderData.payment || {};
  const isOnlinePayment = paymentMethod === "online";

  if (isOnlinePayment && payment.verified !== true) {
    throw validationError("Online payment must be verified before creating the order");
  }

  const orderNumber = `R17-${Date.now().toString(36).toUpperCase()}`;
  const id = `fallback_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const order = {
    orderNumber,
    items: orderItems,
    customer: orderData.customer || {},
    userId: orderData.userId || null,
    userEmail: orderData.userEmail || orderData.customer?.email || "",
    subtotal,
    shippingFee,
    total,
    currency: "INR",
    paymentMethod,
    paymentGateway: isOnlinePayment ? "razorpay" : "manual",
    paymentStatus: isOnlinePayment ? "paid" : "cod_pending",
    razorpayPaymentId: payment.razorpayPaymentId || "",
    razorpayOrderId: payment.razorpayOrderId || "",
    razorpaySignature: payment.razorpaySignature || "",
    fulfillmentStatus: "processing",
    status: "placed",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  for (const entry of productsById.values()) {
    state.storeProducts[entry.productIndex] = {
      ...entry.product,
      stock: entry.currentStock - entry.requestedQuantity,
      updatedAt: nowIso(),
    };
  }

  state.storeOrders[id] = order;
  writeFallbackState(state);
  return { id, ...order };
}
