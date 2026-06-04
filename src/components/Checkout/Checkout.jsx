import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useAppContext } from "../../Context/AppContext";
import { useAuth } from "../../hooks/useAuth";
import "./Checkout.css";

const EMPTY_CHECKOUT = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  paymentMethod: "cod",
};

const formatPrice = (value) => `INR ${Number(value || 0).toLocaleString("en-IN")}`;

function loadRazorpayCheckout() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout"));
    document.body.appendChild(script);
  });
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || "Payment request failed");
  }
  return data;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const {
    storeCart,
    updateStoreCartQuantity,
    removeStoreCartItem,
    clearStoreCart,
    createStoreOrder,
  } = useAppContext();
  const [checkout, setCheckout] = useState(() => ({
    ...EMPTY_CHECKOUT,
    name: profile?.name || user?.displayName || "",
    email: user?.email || "",
  }));
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [orderReceipt, setOrderReceipt] = useState(null);

  useEffect(() => {
    setCheckout((current) => ({
      ...current,
      name: current.name || profile?.name || user?.displayName || "",
      email: current.email || user?.email || "",
    }));
  }, [profile?.name, user?.displayName, user?.email]);

  const subtotal = useMemo(
    () => storeCart.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    [storeCart],
  );
  const shippingFee = subtotal > 0 && subtotal < 3000 ? 99 : 0;
  const total = subtotal + shippingFee;

  const validateCheckout = () => {
    const required = ["name", "email", "phone", "address", "city", "state", "pincode"];
    const missing = required.filter((field) => !String(checkout[field] || "").trim());
    if (missing.length) {
      return `Please fill ${missing.join(", ")} before placing the order.`;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkout.email.trim())) {
      return "Please enter a valid email address.";
    }
    if (!/^\d{6}$/.test(checkout.pincode.trim())) {
      return "Please enter a valid 6 digit pincode.";
    }
    return "";
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setPageError("");
    if (!storeCart.length) {
      setPageError("Your cart is empty. Add products before checkout.");
      return;
    }

    const validationError = validateCheckout();
    if (validationError) {
      setPageError(validationError);
      return;
    }

    const orderPayload = {
      items: storeCart.map((item) => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
        selectedSize: item.selectedSize || "",
      })),
      customer: {
        name: checkout.name.trim(),
        email: checkout.email.trim(),
        phone: checkout.phone.trim(),
        address: checkout.address.trim(),
        city: checkout.city.trim(),
        state: checkout.state.trim(),
        pincode: checkout.pincode.trim(),
      },
      paymentMethod: checkout.paymentMethod,
      shippingFee,
      userId: user?.uid || null,
      userEmail: user?.email || checkout.email.trim(),
    };

    try {
      setSubmitting(true);
      let created;

      if (checkout.paymentMethod === "online") {
        const razorpayOrder = await postJson("/create-order", orderPayload);

        await loadRazorpayCheckout();

        const paymentResponse = await new Promise((resolve, reject) => {
          const checkoutInstance = new window.Razorpay({
            key: razorpayOrder.keyId,
            amount: razorpayOrder.order.amount,
            currency: razorpayOrder.order.currency,
            name: "R17 Esports Store",
            description: "Official R17 merchandise order",
            order_id: razorpayOrder.order.id,
            prefill: {
              name: checkout.name.trim(),
              email: checkout.email.trim(),
              contact: checkout.phone.trim(),
            },
            notes: {
              source: "r17-store",
              pincode: checkout.pincode.trim(),
            },
            theme: { color: "#ff2233" },
            config: {
              display: {
                blocks: {
                  r17Methods: {
                    name: "UPI, Cards, Wallets, Net Banking",
                    instruments: [
                      { method: "upi" },
                      { method: "card" },
                      { method: "wallet" },
                      { method: "netbanking" },
                    ],
                  },
                },
                sequence: ["block.r17Methods"],
                preferences: { show_default_blocks: true },
              },
            },
            handler: resolve,
            modal: {
              ondismiss: () => reject(new Error("Payment was cancelled before completion.")),
            },
          });

          checkoutInstance.open();
        });

        const verification = await postJson("/verify-payment", {
          payment: paymentResponse,
          orderData: orderPayload,
        });
        if (!verification.verified || !verification.order) {
          throw new Error("Payment verification failed.");
        }

        created = verification.order;
      } else {
        // Optimistic UI for COD: show immediate receipt while backend completes
        const placeholder = {
          orderNumber: `R17-PENDING-${Date.now().toString(36).toUpperCase()}`,
          items: orderPayload.items,
          customer: orderPayload.customer,
          subtotal,
          shippingFee,
          total,
          currency: 'INR',
          paymentMethod: 'cod',
          paymentStatus: 'cod_pending',
          fulfillmentStatus: 'processing',
        };

        // show placeholder immediately and clear cart for UX
        setOrderReceipt(placeholder);
        clearStoreCart();

        try {
          const real = await createStoreOrder(orderPayload);
          // replace placeholder with real server-created order
          setOrderReceipt(real);
        } catch (err) {
          // restore error state and inform user
          setPageError(err?.message || 'Unable to create order (COD).');
          // Do not auto-restore cart to avoid duplicate ordering; admin can reconcile.
          setOrderReceipt(null);
          throw err;
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setPageError(error?.message || "Unable to place order right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />

      <main className="checkout-shell">
        <div className="checkout-head">
          <Link to="/store" className="checkout-back">Back to store</Link>
          <div>
            <p>R17 Secure Checkout</p>
            <h1>Review and place your order</h1>
          </div>
        </div>

        {orderReceipt ? (
          <section className="checkout-success">
            <span>Order confirmed</span>
            <h2>{orderReceipt.orderNumber}</h2>
            <p>Your order has been saved and inventory is locked. Admin can track payment and fulfillment from the store dashboard.</p>
            <button onClick={() => navigate("/store")}>Continue Shopping</button>
          </section>
        ) : (
          <form className="checkout-layout" onSubmit={handleCheckout}>
            <section className="checkout-card checkout-items-card">
              <div className="checkout-section-title">
                <h2>Cart Items</h2>
                <span>{storeCart.length} products</span>
              </div>

              {storeCart.length ? (
                <div className="checkout-items">
                  {storeCart.map((item) => (
                    <div className="checkout-item" key={item.cartKey}>
                      <img src={item.image} alt="" />
                      <div className="checkout-item-main">
                        <strong>{item.name}</strong>
                        <span>{item.category}{item.selectedSize ? ` / Size ${item.selectedSize}` : ""}</span>
                        <b>{formatPrice(item.price)}</b>
                      </div>
                      <div className="checkout-qty">
                        <button type="button" onClick={() => updateStoreCartQuantity(item.cartKey, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateStoreCartQuantity(item.cartKey, item.quantity + 1)}>+</button>
                      </div>
                      <button type="button" className="checkout-remove" onClick={() => removeStoreCartItem(item.cartKey)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="checkout-empty">
                  <h2>Your cart is empty</h2>
                  <p>Add a product from the store to continue checkout.</p>
                  <Link to="/store">Browse Products</Link>
                </div>
              )}
            </section>

            <section className="checkout-card">
              <div className="checkout-section-title">
                <h2>Shipping Details</h2>
                <span>Required</span>
              </div>

              {pageError && <div className="checkout-error">{pageError}</div>}

              <div className="checkout-form-grid">
                <label>
                  Full Name
                  <input value={checkout.name} onChange={(e) => setCheckout({ ...checkout, name: e.target.value })} />
                </label>
                <label>
                  Email
                  <input value={checkout.email} onChange={(e) => setCheckout({ ...checkout, email: e.target.value })} />
                </label>
                <label>
                  Phone
                  <input value={checkout.phone} onChange={(e) => setCheckout({ ...checkout, phone: e.target.value })} />
                </label>
                <label>
                  Pincode
                  <input value={checkout.pincode} onChange={(e) => setCheckout({ ...checkout, pincode: e.target.value })} />
                </label>
                <label>
                  City
                  <input value={checkout.city} onChange={(e) => setCheckout({ ...checkout, city: e.target.value })} />
                </label>
                <label>
                  State
                  <input value={checkout.state} onChange={(e) => setCheckout({ ...checkout, state: e.target.value })} />
                </label>
                <label className="checkout-span">
                  Full Address
                  <textarea value={checkout.address} onChange={(e) => setCheckout({ ...checkout, address: e.target.value })} />
                </label>
              </div>
            </section>

            <aside className="checkout-card checkout-summary">
              <div className="checkout-section-title">
                <h2>Order Summary</h2>
                <span>Secure</span>
              </div>

              <div className="checkout-payment">
                <label className={checkout.paymentMethod === "cod" ? "active" : ""}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={checkout.paymentMethod === "cod"}
                    onChange={() => setCheckout({ ...checkout, paymentMethod: "cod" })}
                  />
                  Cash on delivery
                </label>
              </div>

              <div className="checkout-totals">
                <span>Subtotal</span><strong>{formatPrice(subtotal)}</strong>
                <span>Shipping</span><strong>{shippingFee ? formatPrice(shippingFee) : "Free"}</strong>
                <span>Total</span><strong>{formatPrice(total)}</strong>
              </div>

              <button className="checkout-place" type="submit" disabled={submitting || !storeCart.length}>
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </aside>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
