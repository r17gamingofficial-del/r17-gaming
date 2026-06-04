import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useAppContext } from "../../Context/AppContext";
import "./Store.css";

const CATEGORIES = [
  "All",
  "T-Shirts",
  "Shirts",
  "Pants",
  "Jerseys",
  "Hoodies",
  "Caps",
  "Sleeves",
  "Mousepads",
  "Accessories",
];

const APPAREL_CATEGORIES = new Set([
  "t-shirts",
  "shirts",
  "pants",
  "jerseys",
  "hoodies",
]);

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

const SIZE_CHART = [
  { size: "XS", chest: "34-36", waist: "28-30", length: "26" },
  { size: "S", chest: "36-38", waist: "30-32", length: "27" },
  { size: "M", chest: "38-40", waist: "32-34", length: "28" },
  { size: "L", chest: "40-42", waist: "34-36", length: "29" },
  { size: "XL", chest: "42-44", waist: "36-38", length: "30" },
  { size: "XXL", chest: "44-46", waist: "38-40", length: "31" },
];

const BADGE_COLORS = {
  BESTSELLER: "#ff9900",
  NEW: "#00d4ff",
  LIMITED: "#ff2233",
  FEATURED: "#c678dd",
};

const formatPrice = (value) => `INR ${Number(value || 0).toLocaleString("en-IN")}`;
const needsSize = (product) => APPAREL_CATEGORIES.has(String(product?.category || "").toLowerCase());

function getCreatedTime(product) {
  const value = product?.createdAt;
  if (!value) return 0;
  if (typeof value.toDate === "function") return value.toDate().getTime();
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function matchesPrice(product, priceRange) {
  const price = Number(product.price || 0);
  if (priceRange === "under1000") return price < 1000;
  if (priceRange === "1000-2500") return price >= 1000 && price <= 2500;
  if (priceRange === "2500-4000") return price > 2500 && price <= 4000;
  if (priceRange === "4000plus") return price > 4000;
  return true;
}

export default function Store() {
  const navigate = useNavigate();
  const {
    storeProducts,
    storeCart,
    addStoreCartItem,
    loading,
  } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [latestOnly, setLatestOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [cartNotice, setCartNotice] = useState(null);

  const products = useMemo(
    () => (storeProducts || []).filter((product) => product.isActive !== false),
    [storeProducts],
  );

  const filtered = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return products
      .filter((product) => {
        if (activeCategory !== "All" && product.category !== activeCategory) return false;
        if (!matchesPrice(product, priceRange)) return false;
        if (availabilityFilter === "inStock" && Number(product.stock || 0) <= 0) return false;
        if (featuredOnly && !product.featured) return false;
        if (sizeFilter !== "all" && !needsSize(product)) return false;
        if (search) {
          const keywords = [
            product.name,
            product.category,
            product.desc,
            product.badge,
            product.featured ? "featured" : "",
          ].join(" ").toLowerCase();
          if (!keywords.includes(search)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (latestOnly || sortBy === "latest") return getCreatedTime(b) - getCreatedTime(a);
        if (sortBy === "priceLow") return Number(a.price || 0) - Number(b.price || 0);
        if (sortBy === "priceHigh") return Number(b.price || 0) - Number(a.price || 0);
        if (sortBy === "name") return String(a.name || "").localeCompare(String(b.name || ""));
        return Number(b.featured || 0) - Number(a.featured || 0);
      });
  }, [
    activeCategory,
    availabilityFilter,
    featuredOnly,
    latestOnly,
    priceRange,
    products,
    searchTerm,
    sizeFilter,
    sortBy,
  ]);

  const cartCount = storeCart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = storeCart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0,
  );

  const showCartNotice = (text, title = "Added to cart") => {
    setCartNotice({ title, text });
    window.setTimeout(() => setCartNotice(null), 1800);
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setDetailQuantity(1);
    setSelectedSize(needsSize(product) ? "M" : "");
  };

  const addToCart = (product, quantity = 1) => {
    if (needsSize(product) && !selectedSize) {
      showCartNotice("Select a size first.", "Size required");
      return false;
    }

    const ok = addStoreCartItem(product, {
      quantity,
      selectedSize: needsSize(product) ? selectedSize : "",
    });

    if (ok) {
      showCartNotice(`${product.name} added to cart.`);
    } else {
      showCartNotice("This product is out of stock.", "Unavailable");
    }

    return ok;
  };

  const handleBuyNow = (product) => {
    if (addToCart(product, detailQuantity)) {
      setSelectedProduct(null);
      navigate("/checkout");
    }
  };

  return (
    <div className="store-page">
      <Navbar hideOnScroll />

      {cartNotice && (
        <div className="store-add-toast">
          <span>{cartNotice.title}</span>
          <strong>{cartNotice.text}</strong>
        </div>
      )}

      <section className="store-hero">
        <div className="store-hero-bg" />
        <div className="store-hero-grid" />
        <div className="store-hero-content">
          <div className="store-hero-label">R17 OFFICIAL MERCHANDISE</div>
          <h1 className="store-hero-title">
            GEAR UP.<br />
            <span className="store-hero-accent">SUIT UP.</span>
          </h1>
          <p className="store-hero-sub">
            Elite esports apparel and tactical accessories backed by live inventory.
          </p>
          <div className="store-hero-stats">
            <div className="store-stat"><span>{products.length}</span><small>Products</small></div>
            <div className="store-stat-divider" />
            <div className="store-stat"><span>{products.filter((p) => p.featured).length}</span><small>Featured</small></div>
            <div className="store-stat-divider" />
            <div className="store-stat"><span>{products.reduce((sum, p) => sum + Number(p.stock || 0), 0)}</span><small>In Stock</small></div>
          </div>
        </div>
        <div className="store-hero-hud-ring" />
        <div className="store-hero-hud-ring store-hero-hud-ring--2" />
      </section>

      <section className="store-categories">
        <div className="store-controls">
          <div className="store-search-wrap">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products, categories, keywords..."
              aria-label="Search store products"
            />
          </div>

          <button
            className={`store-filter-toggle${showFilters ? " active" : ""}`}
            onClick={() => setShowFilters((open) => !open)}
          >
            Filters
          </button>

          <select
            className="store-sort-select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Featured First</option>
            <option value="latest">Latest Products</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>

          <button className="store-control-cart" onClick={() => navigate("/checkout")}>
            Cart {cartCount > 0 ? `(${cartCount})` : ""}
          </button>
        </div>

        {showFilters && (
          <div className="store-filter-panel">
            <label>
              Category
              <select value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)}>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>

            <label>
              Price Range
              <select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>
                <option value="all">All Prices</option>
                <option value="under1000">Under INR 1,000</option>
                <option value="1000-2500">INR 1,000 - 2,500</option>
                <option value="2500-4000">INR 2,500 - 4,000</option>
                <option value="4000plus">Above INR 4,000</option>
              </select>
            </label>

            <label>
              Sizes
              <select value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value)}>
                <option value="all">All Sizes</option>
                {SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>

            <label>
              Availability
              <select value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value)}>
                <option value="all">All Products</option>
                <option value="inStock">In Stock</option>
              </select>
            </label>

            <label className="store-filter-check">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(event) => setFeaturedOnly(event.target.checked)}
              />
              Featured Products
            </label>

            <label className="store-filter-check">
              <input
                type="checkbox"
                checked={latestOnly}
                onChange={(event) => setLatestOnly(event.target.checked)}
              />
              Latest Products
            </label>
          </div>
        )}
      </section>

      <section className="store-grid-section">
        <div className="store-grid-header">
          <h2 className="store-section-title">
            {activeCategory === "All" ? "ALL PRODUCTS" : activeCategory.toUpperCase()}
          </h2>
          <span className="store-count">
            {loading ? "Syncing inventory" : `${filtered.length} items`}
          </span>
        </div>

        <div className="store-grid">
          {filtered.map((product) => (
            <article
              className="store-card"
              key={product.id}
              role="button"
              tabIndex={0}
              onClick={() => openProductDetails(product)}
              onKeyDown={(event) => {
                if (event.key === "Enter") openProductDetails(product);
              }}
            >
              {product.badge && (
                <span
                  className="store-card-badge"
                  style={{ background: BADGE_COLORS[product.badge] || "#555" }}
                >
                  {product.badge}
                </span>
              )}
              <div className="store-card-img-wrap">
                <img src={product.image} alt={product.name} className="store-card-img" />
                <div className="store-card-overlay" />
              </div>
              <div className="store-card-body">
                <p className="store-card-category">{product.category}</p>
                <h3 className="store-card-name">{product.name}</h3>
                <p className="store-card-desc">{product.desc}</p>
                <div className="store-card-meta">
                  <span>{Number(product.stock || 0)} in stock</span>
                  {needsSize(product) && <span>Sizes XS-XXL</span>}
                  {product.featured && <span>Featured</span>}
                </div>
                <div className="store-card-footer">
                  <span className="store-card-price">{formatPrice(product.price)}</span>
                  <button
                    className="store-card-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      openProductDetails(product);
                    }}
                    disabled={!product.stock}
                  >
                    {product.stock ? "View" : "Sold Out"}
                  </button>
                </div>
              </div>
              <div className="store-card-border-glow" />
            </article>
          ))}
        </div>

        {!loading && !filtered.length && (
          <div className="store-empty">No products are live in this category.</div>
        )}
      </section>

      {cartCount > 0 && (
        <div className="store-cart-indicator">
          <span className="store-cart-count">{cartCount}</span>
          <span className="store-cart-label">{formatPrice(cartTotal)}</span>
          <button className="store-cart-open" onClick={() => navigate("/checkout")}>Checkout</button>
        </div>
      )}

      {selectedProduct && (
        <div className="store-product-overlay" onClick={() => setSelectedProduct(null)}>
          <section className="store-product-panel" onClick={(event) => event.stopPropagation()}>
            <button className="store-product-close" onClick={() => setSelectedProduct(null)}>Close</button>
            <div className="store-product-media">
              {selectedProduct.badge && (
                <span
                  className="store-card-badge"
                  style={{ background: BADGE_COLORS[selectedProduct.badge] || "#555" }}
                >
                  {selectedProduct.badge}
                </span>
              )}
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>

            <div className="store-product-info">
              <p className="store-card-category">{selectedProduct.category}</p>
              <h2>{selectedProduct.name}</h2>
              <div className="store-product-rating">
                <span>4.6</span>
                <b>Customer rating</b>
                <small>128 verified buyers</small>
              </div>

              <div className="store-product-price">{formatPrice(selectedProduct.price)}</div>
              <p className="store-product-tax">Inclusive of all taxes. Free shipping above INR 3,000.</p>
              <p className="store-product-desc">{selectedProduct.desc}</p>

              {needsSize(selectedProduct) && (
                <div className="store-size-block">
                  <div className="store-size-head">
                    <strong>Select Size</strong>
                    <span>Size chart in inches</span>
                  </div>
                  <div className="store-size-options">
                    {SIZE_OPTIONS.map((size) => (
                      <button
                        key={size}
                        className={selectedSize === size ? "active" : ""}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <div className="store-size-chart">
                    <div className="store-size-row store-size-row--head">
                      <span>Size</span><span>Chest</span><span>Waist</span><span>Length</span>
                    </div>
                    {SIZE_CHART.map((row) => (
                      <div className="store-size-row" key={row.size}>
                        <span>{row.size}</span>
                        <span>{row.chest}</span>
                        <span>{row.waist}</span>
                        <span>{row.length}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="store-product-offers">
                <div>
                  <strong>Bank offer</strong>
                  <span>Save more when Razorpay online payments go live.</span>
                </div>
                <div>
                  <strong>Delivery</strong>
                  <span>Dispatch in 2-4 business days after confirmation.</span>
                </div>
                <div>
                  <strong>Replacement</strong>
                  <span>7-day replacement for damaged or incorrect items.</span>
                </div>
              </div>

              <div className="store-product-stock">
                <span>{Number(selectedProduct.stock || 0)} units available</span>
                <b>{selectedProduct.stock ? "In stock" : "Currently sold out"}</b>
              </div>

              <div className="store-product-purchase">
                <div className="store-detail-qty">
                  <button onClick={() => setDetailQuantity((q) => Math.max(1, q - 1))}>-</button>
                  <span>{detailQuantity}</span>
                  <button
                    onClick={() =>
                      setDetailQuantity((q) =>
                        Math.min(Number(selectedProduct.stock || 1), q + 1),
                      )
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="store-add-large"
                  onClick={() => addToCart(selectedProduct, detailQuantity)}
                  disabled={!selectedProduct.stock}
                >
                  Add to Cart
                </button>
                <button
                  className="store-buy-large"
                  onClick={() => handleBuyNow(selectedProduct)}
                  disabled={!selectedProduct.stock}
                >
                  Buy Now
                </button>
              </div>

              <div className="store-product-specs">
                <span>Secure COD checkout</span>
                <span>Live inventory lock</span>
                <span>Admin-tracked fulfillment</span>
              </div>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}
