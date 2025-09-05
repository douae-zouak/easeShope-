import { Archive, Check, Save } from "lucide-react";
import ProductInfo from "../../components/ProductInfo";
import Pricing_Stock from "../../components/Pricing_Stock";
import ProductCategory from "../../components/ProductCategory"; // Ajout de l'import manquant
import { useEffect, useState } from "react";
import { useProductStore } from "../../store/product.store";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productGender, setProductGender] = useState("Unisex");
  const [category, setCategory] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [variants, setVariants] = useState([]);
  const [imgVariants, setImgVariants] = useState([]);

  const { updateProduct, getProductById } = useProductStore();

  const [product, setProduct] = useState(null);

  // Charger les données du produit à modifier
  useEffect(() => {
    const loadProductData = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);

        // Pré-remplir les champs avec les données existantes
        setProductName(data.name || "");
        setProductDescription(data.description || "");
        setProductGender(data.gender || "Unisex");
        setCategory(data.category || "");
        setOriginalPrice(data.originalPrice?.toString() || ""); // Utiliser originalPrice au lieu de price
        setDiscount(data.discount?.toString() || "");
        setDiscountType(data.discountType || "");
        setVariants(data.variants || []);
        setImgVariants(data.imagesVariant || []);

      } catch (error) {
        toast.error(`Error while loading product data: ${error.message}`);
        navigate("/vendor/products");
      }
    };

    if (id) {
      loadProductData();
    }
  }, [id, getProductById, navigate]);

  // Fonction pour convertir une valeur en nombre, retourne 0 si vide ou invalide
  const parseNumber = (value) => {
    if (value === "" || value === null || value === undefined) return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !productName ||
      !productDescription ||
      !category ||
      !originalPrice ||
      imgVariants.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await updateProduct(id, {
        name: productName,
        description: productDescription,
        gender: productGender,
        category: category,
        originalPrice: parseNumber(originalPrice), // Utiliser originalPrice
        discount: parseNumber(discount),
        discountType: discountType,
        imagesVariant: imgVariants,
        variants: variants,
        status: product?.status || "draft", // Conserver le statut existant
      });

      toast.success("Product updated successfully!");
      navigate("/vendor/products");
    } catch (err) {
      toast.error(`Error while updating product: ${err.message}`);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (
      !productName ||
      !productDescription ||
      !category ||
      !originalPrice ||
      imgVariants.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await updateProduct(id, {
        name: productName,
        description: productDescription,
        gender: productGender,
        category: category,
        originalPrice: parseNumber(originalPrice), // Utiliser originalPrice
        discount: parseNumber(discount),
        discountType: discountType,
        imagesVariant: imgVariants,
        variants: variants,
        status: "pending",
      });

      toast.success("Product updated and published successfully!");
      navigate("/vendor/products");
    } catch (err) {
      toast.error(`Error while updating product: ${err.message}`);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 mt-6">
        <h1 className="text-xl font-medium flex items-center gap-2 ml-4">
          <Archive size={20} />
          <span>Edit Product</span>
        </h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`w-40 flex items-center gap-1 px-3 py-2 text-md font-medium rounded-lg cursor-pointer transition-colors duration-200 ${
              product?.status === "draft"
                ? "text-gray-600 hover:bg-gray-300 hover:text-black border"
                : "bg-[#7D6BFB] text-white hover:bg-[#6a59d6]"
            }`}
            onClick={handleSubmit}
          >
            <Save size={18} />
            <span>Save Changes</span>
          </button>

          {product?.status === "draft" && (
            <button
              type="button"
              className="w-40 flex justify-center items-center gap-1 px-4 py-2 text-md font-medium bg-[#7D6BFB] text-white hover:bg-[#6a59d6] rounded-lg cursor-pointer transition-colors duration-200"
              onClick={handleSaveProduct}
            >
              <Check size={18} />
              <span>Publish Product</span>
            </button>
          )}
        </div>
      </div>

      <div className="ml-5 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.7fr]">
        {/* Colonne 1 */}
        <div className="grid gap-6">
          <ProductInfo
            productName={productName}
            setProductName={setProductName}
            productDescription={productDescription}
            setProductDescription={setProductDescription}
            productGender={productGender}
            setProductGender={setProductGender}
          />
          <Pricing_Stock
            originalPrice={originalPrice}
            setOriginalPrice={setOriginalPrice}
            discount={discount}
            setDiscount={setDiscount}
            discountType={discountType}
            setDiscountType={setDiscountType}
          />
        </div>

        {/* Colonne 2 */}
        <div className="grid gap-6">
          <ProductCategory
            variants={variants}
            setVariants={setVariants}
            productName={productName}
            category={category}
            setCategory={setCategory}
            imgVariants={imgVariants}
            setImgVariants={setImgVariants}
          />
        </div>
      </div>
    </>
  );
};

export default EditProductPage;