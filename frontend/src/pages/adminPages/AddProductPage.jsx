/* eslint-disable no-unused-vars */
import { Archive, Check, Save } from "lucide-react";
import ProductInfo from "../../components/ProductInfo";
import Pricing_Stock from "../../components/Pricing_Stock";
import { useState } from "react";
import { useProductStore } from "../../store/product.store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ProductCategory from "../../components/ProductCategory";

const AddProductPage = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productGender, setProductGender] = useState("Unisex");
  const [category, setCategory] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [variants, setVariants] = useState([]);
  const [imgVariants, setImgVariants] = useState([]);

  const { AddNewProduct } = useProductStore();

  const navigate = useNavigate();

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
      await AddNewProduct({
        name: productName,
        description: productDescription,
        gender: productGender,
        category: category,
        originalPrice: parseFloat(originalPrice),
        discount: discount ? parseFloat(discount) : 0,
        discountType: discountType,
        imagesVariant: imgVariants,
        variants: variants,
      });

      toast.success("Product added successfully!");
      navigate("/vendor/products");
    } catch (err) {
      toast.error(`error adding product : ${err.message || err}`);
    }
  };

  const handleDraft = async (e) => {
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
      await AddNewProduct({
        name: productName,
        description: productDescription,
        gender: productGender,
        category: category,
        originalPrice: parseFloat(originalPrice),
        discount: discount ? parseFloat(discount) : 0,
        discountType: discountType,
        imagesVariant: imgVariants,
        variants: variants,
        status: "draft",
      });

      toast.success("Product saved in draft successfully!");
      navigate("/vendor/products");
    } catch (err) {
      toast.error(`error adding product : ${err.message || err}`);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 mt-6">
        <h1 className="text-xl font-medium flex items-center gap-2 ml-4">
          <Archive size={20} />
          <span>Add New Product</span>
        </h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="w-30 flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-300 hover:text-black border rounded-lg cursor-pointer transition-colors duration-200"
            onClick={handleDraft}
          >
            <Save size={18} />
            Save draft
          </button>
          <button
            type="button"
            className="w-35 flex justify-center items-center gap-1 px-4 py-2 text-sm font-medium bg-[#7D6BFB] text-white hover:bg-[#6a59d6] rounded-lg cursor-pointer transition-colors duration-200"
            onClick={handleSubmit}
          >
            <Check size={18} />
            <span>Add Product</span>
          </button>
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

export default AddProductPage;
