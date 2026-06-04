import { useMemo, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import "./AdminStore.css";

const CATEGORIES = ["T-Shirts", "Shirts", "Pants", "Jerseys", "Hoodies", "Caps", "Sleeves", "Mousepads", "Accessories"];
const BADGES = ["", "NEW", "LIMITED", "BESTSELLER", "FEATURED"];
const ORDER_STATUSES = ["processing", "packed", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "cod_pending", "paid", "failed", "refunded"];

const EMPTY_FORM = {
  name: "",
  category: "Jerseys",
  price: "",
  stock: "",
  badge: "",
  featured: false,
  isActive: true,
  image: "",
  desc: "",
  sortOrder: 0,
};

const formatPrice = (value) => `INR ${Number(value || 0).toLocaleString("en-IN")}`;

function getDateLabel(value) {
  if (!value) return "New";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "New";
  return date.toLocaleString();
}

export default function AdminStore() {
  const {
    storeProducts,
    storeOrders,
    addStoreProduct,
    updateStoreProduct,
    deleteStoreProduct,
    updateStoreOrder,
    deleteStoreOrder,
    refreshStoreProducts,
    refreshStoreOrders,
  } = useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const products = storeProducts || [];
  const orders = storeOrders || [];

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const haystack = `${product.name} ${product.category} ${product.badge}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      }),
    [products, search],
  );

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const customer = order.customer || {};
        const haystack = `${order.orderNumber} ${customer.name} ${customer.email} ${customer.phone}`.toLowerCase();
        return haystack.includes(orderSearch.toLowerCase());
      }),
    [orders, orderSearch],
  );

  const revenue = orders
    .filter((order) => ["paid", "cod_pending"].includes(order.paymentStatus))
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const handleEdit = (product) => {
    setForm({
      name: product.name || "",
      category: product.category || "Jerseys",
      price: product.price ?? "",
      stock: product.stock ?? "",
      badge: product.badge || "",
      featured: Boolean(product.featured),
      isActive: product.isActive !== false,
      image: product.image || "",
      desc: product.desc || "",
      sortOrder: product.sortOrder ?? 0,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setConfirmDelete({ type: "product", id, name: "product" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      sortOrder: Number(form.sortOrder),
    };

    const ok = editingId
      ? await updateStoreProduct(editingId, payload)
      : await addStoreProduct(payload);

    setBusy(false);
    if (!ok) {
      showToast("Product save failed.");
      return;
    }

    showToast(editingId ? "Product updated." : "Product added.");
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleOrderChange = async (id, field, value) => {
    const ok = await updateStoreOrder(id, { [field]: value });
    showToast(ok ? "Order updated." : "Order update failed.");
  };

  const performConfirmedDelete = async () => {
    if (!confirmDelete) return;
    setBusy(true);
    try {
      if (confirmDelete.type === "product") {
        const ok = await deleteStoreProduct(confirmDelete.id);
        showToast(ok ? "Product deleted." : "Product delete failed.");
      } else if (confirmDelete.type === "order") {
        const ok = await deleteStoreOrder(confirmDelete.id);
        showToast(ok ? "Order deleted." : "Order delete failed.");
        if (ok) await refreshStoreOrders();
      }
    } catch (err) {
      showToast("Delete failed.");
    } finally {
      setBusy(false);
      setConfirmDelete(null);
    }
  };

  const cancelConfirmedDelete = () => setConfirmDelete(null);

  return (
    <div className="admin-store">
      {toast && <div className="admin-store-toast">{toast}</div>}
      {confirmDelete && (
        <div className="admin-confirm-toast">
          <div className="admin-confirm-msg">Confirm delete {confirmDelete.name}?</div>
          <div className="admin-confirm-actions">
            <button className="admin-confirm-yes" onClick={performConfirmedDelete} disabled={busy}>Yes</button>
            <button className="admin-confirm-no" onClick={cancelConfirmedDelete} disabled={busy}>Cancel</button>
          </div>
        </div>
      )}

      <div className="astore-stats-bar">
        <div className="astore-stat-card">
          <span className="astore-stat-val">{products.length}</span>
          <span className="astore-stat-label">Products</span>
        </div>
        <div className="astore-stat-card">
          <span className="astore-stat-val">{orders.length}</span>
          <span className="astore-stat-label">Orders</span>
        </div>
        <div className="astore-stat-card">
          <span className="astore-stat-val">{products.reduce((s, p) => s + Number(p.stock || 0), 0)}</span>
          <span className="astore-stat-label">Inventory</span>
        </div>
        <div className="astore-stat-card">
          <span className="astore-stat-val">{formatPrice(revenue)}</span>
          <span className="astore-stat-label">Tracked Revenue</span>
        </div>
      </div>

      <div className="astore-section-head">
        <div>
          <h3>Products</h3>
          <p>Catalog records are stored in Firestore collection storeProducts.</p>
        </div>
        <div className="astore-actions">
          <button className="astore-secondary-btn" onClick={refreshStoreProducts}>Refresh</button>
          <button
            className="astore-add-btn"
            onClick={() => {
              setForm({ ...EMPTY_FORM, sortOrder: products.length });
              setEditingId(null);
              setShowForm(true);
            }}
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="astore-toolbar">
        <input
          className="astore-search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="astore-form-overlay" onClick={() => setShowForm(false)}>
          <form className="astore-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
            <h3 className="astore-form-title">{editingId ? "Edit Product" : "New Product"}</h3>
            <div className="astore-form-grid">
              <label>
                Product Name
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="R17 Elite Jersey" />
              </label>
              <label>
                Category
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label>
                Price (INR)
                <input type="number" required min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="2999" />
              </label>
              <label>
                Stock Qty
                <input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="50" />
              </label>
              <label>
                Badge
                <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
                  {BADGES.map((badge) => <option key={badge} value={badge}>{badge || "None"}</option>)}
                </select>
              </label>
              <label>
                Sort Order
                <input type="number" min="0" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
              </label>
              <label className="astore-checkbox-label">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured Product
              </label>
              <label className="astore-checkbox-label">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                Active on Store
              </label>
              <label className="astore-form-full">
                Image URL
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </label>
              <label className="astore-form-full">
                Description
                <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Short product description" />
              </label>
            </div>
            <div className="astore-form-actions">
              <button type="submit" className="astore-save-btn" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
              <button type="button" className="astore-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="astore-table-wrap">
        <table className="astore-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="astore-no-data">No products found.</td></tr>
            ) : filtered.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="astore-product-cell">
                    {product.image && <img src={product.image} alt="" className="astore-thumb" />}
                    <span>{product.name}</span>
                  </div>
                </td>
                <td><span className="astore-category-tag">{product.category}</span></td>
                <td className="astore-price">{formatPrice(product.price)}</td>
                <td><span className={`astore-stock${Number(product.stock || 0) < 30 ? " low" : ""}`}>{product.stock}</span></td>
                <td>{product.isActive === false ? <span className="astore-none">Hidden</span> : <span className="astore-live">Live</span>}</td>
                <td>{product.featured ? <span className="astore-featured-yes">Yes</span> : <span className="astore-none">No</span>}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="astore-section-head astore-orders-head">
        <div>
          <h3>Orders</h3>
          <p>Checkout orders are stored in Firestore collection storeOrders.</p>
        </div>
        <div className="astore-actions">
          <button className="astore-secondary-btn" onClick={refreshStoreOrders}>Refresh</button>
        </div>
      </div>

      <div className="astore-toolbar">
        <input
          className="astore-search"
          placeholder="Search orders..."
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
        />
      </div>

      <div className="astore-orders-grid">
        {filteredOrders.length === 0 ? (
          <div className="astore-no-data">No orders found.</div>
        ) : filteredOrders.map((order) => {
          const customer = order.customer || {};
          return (
            <article className="astore-order-card" key={order.id}>
              <div className="astore-order-top">
                <div>
                  <strong>{order.orderNumber || order.id}</strong>
                  <span>{getDateLabel(order.createdAt)}</span>
                </div>
                <b>{formatPrice(order.total)}</b>
              </div>

              <div className="astore-order-customer">
                <span>{customer.name || "Guest"}</span>
                <span>{customer.phone || "No phone"}</span>
                <span>{customer.email || "No email"}</span>
                <p>{[customer.address, customer.city, customer.state, customer.pincode].filter(Boolean).join(", ")}</p>
              </div>

              <div className="astore-order-items">
                {(order.items || []).map((item) => (
                  <div key={`${order.id}-${item.productId}`}>
                    <span>{item.quantity}x {item.name}{item.selectedSize ? ` / Size ${item.selectedSize}` : ""}</span>
                    <b>{formatPrice(item.lineTotal)}</b>
                  </div>
                ))}
              </div>

              <div className="astore-order-controls">
                <label>
                  Fulfillment
                  <select value={order.fulfillmentStatus || "processing"} onChange={(e) => handleOrderChange(order.id, "fulfillmentStatus", e.target.value)}>
                    {ORDER_STATUSES.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <label>
                  Payment
                  <select value={order.paymentStatus || "pending"} onChange={(e) => handleOrderChange(order.id, "paymentStatus", e.target.value)}>
                    {PAYMENT_STATUSES.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <div className="astore-order-actions-right">
                  <button className="btn-delete-order" onClick={() => setConfirmDelete({ type: "order", id: order.id, name: order.orderNumber || order.id })}>Delete</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
