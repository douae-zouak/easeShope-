import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/product.store";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Info,
  Package,
  CreditCard,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import "./AdminProductDetailsPage.css";

const AdminProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAdminProductDetails, isLoading, approveProduct, rejectProduct } =
    useProductStore();
  const [product, setProduct] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getAdminProductDetails(id);
        setProduct(productData);
      } catch (error) {
        toast.error(error.message);
        navigate("/admin/products-activation");
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, getAdminProductDetails, navigate]);

  const handleApprove = async () => {
    try {
      await approveProduct(id);
      toast.success("Product approved successfully");
      navigate("/admin/pending-products");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectProduct(id, rejectionReason);
      toast.success("Product rejected successfully");
      navigate("/admin/pending-products");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-product-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="admin-product-not-found">
        <div className="not-found-content">
          <h2>Product not found</h2>
          <p>The requested product could not be loaded.</p>
          <button
            onClick={() => navigate("/admin/pending-products")}
            className="back-button"
          >
            <ArrowLeft size={16} />
            Back to pending products
          </button>
        </div>
      </div>
    );
  }

  // Get all images from all variants
  const allImages = product.imagesVariant.flatMap((variant) =>
    variant.images.map((img) => ({ src: img, color: variant.color }))
  );

  return (
    <div className="admin-product-details-container">
      <div className="admin-product-header">
        <button
          onClick={() => navigate("/admin/pending-products")}
          className="back-button"
        >
          <ArrowLeft size={20} />
          Back to Pending Products
        </button>
        <h1>Product Review</h1>
        <div className="product-status-badge">
          {product.status === "pending" && (
            <span className="status-pending">Pending Review</span>
          )}
        </div>
      </div>

      <div className="admin-product-content">
        {/* Image Gallery */}
        <div className="product-gallery-section">
          <div className="gallery-main">
            <img
              src={allImages[activeImage]?.src}
              alt={`${product.name} - ${allImages[activeImage]?.color}`}
              className="main-product-image"
            />
          </div>
          <div className="gallery-thumbnails">
            {allImages.slice(0, 6).map((image, index) => (
              <div
                key={index}
                className={`thumbnail-item ${
                  index === activeImage ? "active" : ""
                }`}
                onClick={() => setActiveImage(index)}
              >
                <img src={image.src} alt={`Thumbnail ${index + 1}`} />
                <span className="thumbnail-color-badge">{image.color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Tabs */}
        <div className="product-info-section">
          <div className="info-tabs">
            <button
              className={`tab-button ${
                activeTab === "details" ? "active" : ""
              }`}
              onClick={() => setActiveTab("details")}
            >
              <Info size={18} />
              Details
            </button>
            <button
              className={`tab-button ${
                activeTab === "variants" ? "active" : ""
              }`}
              onClick={() => setActiveTab("variants")}
            >
              <Package size={18} />
              Variants
            </button>
            <button
              className={`tab-button ${
                activeTab === "pricing" ? "active" : ""
              }`}
              onClick={() => setActiveTab("pricing")}
            >
              <CreditCard size={18} />
              Pricing
            </button>
            <button
              className={`tab-button ${activeTab === "seller" ? "active" : ""}`}
              onClick={() => setActiveTab("seller")}
            >
              <User size={18} />
              Seller
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "details" && (
              <div className="details-tab">
                <h2>{product.name}</h2>
                <p className="product-description">{product.description}</p>

                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{product.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value capitalize">
                      {product.gender}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Stock:</span>
                    <span className="detail-value">{product.stock} units</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created At:</span>
                    <span className="detail-value">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "variants" && (
              <div className="variants-tab">
                <div className="variants-header">
                  <h3>Product Variants</h3>
                  <span className="variant-count">
                    {product.variants.length} variants
                  </span>
                </div>

                <div className="variants-grid">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="variant-card">
                      <div className="variant-color">
                        <div
                          className="color-swatch"
                          style={{ backgroundColor: variant.colorCode }}
                        ></div>
                        <span>{variant.colorTitle}</span>
                      </div>
                      <div className="variant-details">
                        <div className="variant-property">
                          <span className="property-label">Size:</span>
                          <span className="property-value">{variant.size}</span>
                        </div>
                        <div className="variant-property">
                          <span className="property-label">Stock:</span>
                          <span className="property-value">
                            {variant.stock}
                          </span>
                        </div>
                        <div className="variant-property">
                          <span className="property-label">SKU:</span>
                          <span className="property-value sku">
                            {variant.sku}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="pricing-tab">
                <h3>Pricing Information</h3>

                <div className="pricing-card">
                  <div className="price-row">
                    <span className="price-label">Original Price:</span>
                    <span className="price-value">
                      {product.originalPrice} DH
                    </span>
                  </div>

                  {product.discount > 0 && (
                    <>
                      <div className="price-row">
                        <span className="price-label">Discount:</span>
                        <span className="price-value discount">
                          {product.discount}% ({product.discountType})
                        </span>
                      </div>
                      <div className="price-row final">
                        <span className="price-label">Final Price:</span>
                        <span className="price-value final">
                          {Math.round(
                            product.originalPrice * (1 - product.discount / 100)
                          )}{" "}
                          DH
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === "seller" && (
              <div className="seller-tab">
                <h3>Seller Information</h3>

                <div className="seller-card">
                  <div className="seller-avatar">
                    {product.seller.profilePhoto ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${
                          product.seller.profilePhoto
                        }`}
                        alt={product.seller.fullName}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <User size={24} />
                      </div>
                    )}
                  </div>

                  <div className="seller-info">
                    <h4 className="seller-name capitalize">
                      {product.seller.fullName}
                    </h4>
                    <p className="seller-email">{product.seller.email}</p>

                    <div className="seller-meta">
                      <div className="meta-item">
                        <span className="meta-label">Member since:</span>
                        <span className="meta-value">
                          {new Date(
                            product.seller.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Status:</span>
                        <span className="meta-value status-verified">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approval Actions */}
      <div className="approval-actions-section">
        <div className="section-header">
          <Shield size={20} />
          <h2>Product Validation</h2>
        </div>

        <div className="rejection-reason">
          <label htmlFor="rejectionReason" className="input-label">
            Rejection Reason (required for rejection)
          </label>
          <textarea
            id="rejectionReason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Please provide a clear explanation for rejecting this product..."
            className="reason-textarea"
            rows="3"
          />
        </div>

        <div className="action-buttons">
          <button
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
            className="reject-button"
          >
            <XCircle size={18} />
            Reject Product
          </button>
          <button onClick={handleApprove} className="approve-button">
            <CheckCircle size={18} />
            Approve Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetailsPage;
