import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/product.store";
import toast from "react-hot-toast";
import ViewProductHeader from "../../components/ViewProductHeader";
import AdminImageGalerry from "../../components/AdminImageGalerry";
import AdminProductInfos from "../../components/AdminProductInfos";

const ViewProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAdminProductDetails, isLoading } = useProductStore();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getAdminProductDetails(id);
        setProduct(productData);
        if (productData && productData.imagesVariant.length > 0) {
          setSelectedColor(productData.imagesVariant[0].color);
        }
      } catch (error) {
        toast.error(error.message);
        navigate("/vendor/products");
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, getAdminProductDetails, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 font-sans text-gray-900 bg-white min-h-screen">
      {/* Header */}
      <ViewProductHeader product={product} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1.5fr] gap-10 mb-16">
        {/* Image Gallery - Sticky */}
        <div className="lg:sticky lg:top-20 lg:self-start ">
          <AdminImageGalerry
            activeImage={activeImage}
            product={product}
            selectedColor={selectedColor}
            setActiveImage={setActiveImage}
          />
        </div>

        {/* Right Column - Scrollable Content */}
        <div className="space-y-6">
          {/* Product Info */}
          <AdminProductInfos
            product={product}
            setSelectedColor={setSelectedColor}
            setActiveImage={setActiveImage}
            selectedColor={selectedColor}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage;
