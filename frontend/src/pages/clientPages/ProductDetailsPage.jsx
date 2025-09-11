import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useProductStore } from "../../store/product.store";
import ShippingDetails from "../../components/ShippingDetails";
import SellerInfos from "../../components/SellerInfos";
import ProductDescription from "../../components/ProductDescription";
import ProductDetails from "../../components/ProductDetails";
import Galery from "../../components/Galery";
import CustumerProductReviews from "../../components/CustumerProductReviews";
import AddProductReview from "../../components/AddProductReview";
import { useCommentStore } from "../../store/comment.store";
import { useUserStore } from "../../store/user.store";
import { useAuthStore } from "../../store/auth.store";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Ajout pour la pagination
  const itemsPerPage = 5; // Définition du nombre d'items par page
  // const [newReview, setNewReview] = useState({
  //   rating: 5,
  //   comment: "",
  // });

  const { getProductById, isLoading } = useProductStore();
  const { getProductReviews, productReviews } = useCommentStore();
  const { commentedProduct, commentProductId } = useUserStore();
  const { isAuthenticated } = useAuthStore();

  const navigate = useNavigate();

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // Modifiez cet appel
    getProductReviews(id, currentPage, itemsPerPage);
    commentedProduct(id);
  }, [refresh, id, currentPage]); // Ajoutez currentPage aux dépendances

  useEffect(() => {
    const loadProductData = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.product);
        setSeller(data.seller);
        // Sélectionner la première variante par défaut
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        navigate("/home");
      }
    };

    if (id) {
      loadProductData();
    }
  }, [id, getProductById, navigate]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Product Not Found
          </h2>
          <p className="text-gray-600 mt-2">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="flex flex-row items-center gap-3 pt-5 ml-16">
        <Link to="/home">
          <MoveLeft
            size={18}
            className="fill-blue-500 text-blue-500 cursor-pointer"
          />
        </Link>
        <div className="flex flex-row items-center gap-2">
          <Link
            to="/home"
            className="text-blue-500 cursor-pointer hover:text-blue-700"
          >
            Home
          </Link>
          <span className="text-blue-500">-</span>
          <Link className="text-blue-500 cursor-pointer hover:text-blue-700">
            Product Details
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Galerie d'images */}
          <Galery selectedVariant={selectedVariant} product={product} />

          {/* Détails du produit */}
          <div className="md:w-1/2">
            <ProductDetails
              product={product}
              id={id}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
            />

            {/* Description */}
            <ProductDescription product={product} />

            {/* Shipping details */}
            <ShippingDetails />

            {/* Seller info */}
            <SellerInfos seller={seller} />
          </div>
        </div>

        <div className=" mt-10 flex ">
          <CustumerProductReviews
            productReviews={productReviews}
            renderStars={renderStars}
            commentId={commentProductId}
          />

          {/* Add Review Section */}
          {isAuthenticated && commentProductId && (
            <AddProductReview
              onReviewAdded={() => {
                // Rafraîchir les avis après ajout
                setRefresh((prev) => !prev);
                // Réinitialiser à la première page pour voir le nouvel avis
                setCurrentPage(1);
              }}
              productId={id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
