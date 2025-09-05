import { Palette, Plus, Trash2 } from "lucide-react";
import UploadImages from "./UploadImages";
import { useState } from "react";

const ProductCategory = ({
  variants,
  setVariants,
  productName,
  category,
  setCategory,
  imgVariants,
  setImgVariants,
}) => {
  const [newVariant, setNewVariant] = useState({
    size: "",
    colorTitle: "",
    colorCode: "#000000",
    stock: "",
    sku: "",
  });

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const shoeSizes = [
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
  ];
  const years = [
    "4Y",
    "5Y",
    "6Y",
    "7Y",
    "8Y",
    "9Y",
    "10Y",
    "11Y",
    "12Y",
    "13Y",
    "14Y",
  ];

  const CATEGORIES = [
    {
      name: "Electronics",
      subcategories: [
        "Mobile Phones",
        "Laptops",
        "Tablets",
        "Cameras",
        "Accessories",
      ],
    },
    {
      name: "Clothing",
      subcategories: [
        "T-Shirts",
        "Shirts",
        "Jeans",
        "Dresses",
        "Jackets",
        "Sweaters",
        "Shoes",
        "Accessories",
      ],
    },
    {
      name: "Home & Kitchen",
      subcategories: ["Cookware", "Bedding", "Decor", "Storage", "Lighting"],
    },
    {
      name: "Beauty",
      subcategories: ["Skincare", "Makeup", "Hair Care", "Accessories"],
    },
    {
      name: "Sports",
      subcategories: [
        "Fitness Equipment",
        "Athletic Shoes",
        "Apparel",
        "Outdoor Gear",
        "Sports Accessories",
      ],
    },
    {
      name: "Books",
      subcategories: [
        "Fiction",
        "Non-Fiction",
        "Comics",
        "Educational",
        "Children's Books",
      ],
    },
    {
      name: "Kids",
      subcategories: ["Clothing", "Toys", "School Supplies", "Footwear"],
    },
  ];

  const isClothingCategory =
    category &&
    [
      "T-Shirts",
      "Shirts",
      "Jeans",
      "Dresses",
      "Jackets",
      "Sweaters",
      "Shoes",
      "Accessories",
      "Apparel",
      "Athletic Shoes",
      "Footwear",
      "Clothing",
    ].includes(category);

  const addVariant = () => {
    if (
      newVariant.size &&
      newVariant.colorTitle &&
      newVariant.colorCode &&
      parseInt(newVariant.stock) >= 0 && // S'assurer que c'est un nombre valide
      !isNaN(parseInt(newVariant.stock))
    ) {
      // Générer le SKU automatiquement
      const sku =
        newVariant.sku ||
        `${productName
          .toUpperCase()
          .replace(
            /\s+/g,
            "-"
          )}-${newVariant.size.toUpperCase()}-${newVariant.colorTitle.toUpperCase()}`;

      setVariants([...variants, { ...newVariant, sku }]);
      setNewVariant({
        size: "",
        colorTitle: "",
        colorCode: "#000000",
        stock: "",
        sku: "",
      });
    }
  };

  const removeVariant = (index) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(index, 1);
    setVariants(updatedVariants);
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;

    // Regénérer le SKU si le nom, la taille ou la couleur change
    if (field === "size" || field === "colorTitle") {
      const variant = updatedVariants[index];
      updatedVariants[index].sku = `${productName
        .toUpperCase()
        .replace(
          /\s+/g,
          "-"
        )}-${variant.size.toUpperCase()}-${variant.colorTitle.toUpperCase()}`;
    }

    setVariants(updatedVariants);
  };

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 rounded-lg shadow-lg mb-10 min-h-screen flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Product Variants
        </h2>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="product-category"
          >
            Select a category
          </label>
          <select
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500  transition-all duration-200"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            id="product-category"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((cat) => (
              <optgroup key={cat.name} label={cat.name}>
                {cat.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {isClothingCategory && (
          <div className="flex justify-between mb-6 p-4 bg-indigo-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {category === "Clothing" ? "Year" : "Size"}
              </label>
              <select
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                value={newVariant.size}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, size: e.target.value })
                }
              >
                <option value="">
                  Select {category === "Clothing" ? "year" : "size"}
                </option>
                {category === "Shoes" ||
                category === "Athletic Shoes" ||
                category === "Footwear"
                  ? shoeSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))
                  : category === "Clothing"
                  ? years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))
                  : sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Title
              </label>
              {/* Champ texte pour le titre */}
              <input
                type="text"
                placeholder="Color name"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                value={newVariant.colorTitle}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, colorTitle: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Picker
              </label>
              {/* Custom Color Picker */}
              <div className=" group">
                <input
                  type="color"
                  className="absolute opacity-0 w-0 h-0"
                  value={newVariant.colorCode}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, colorCode: e.target.value })
                  }
                  id="color-picker"
                />

                <label
                  htmlFor="color-picker"
                  className="block w-22 h-12 rounded-xl cursor-pointer border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group-hover:border-gray-200"
                  style={{ backgroundColor: newVariant.colorCode }}
                >
                  <div className="w-full h-full rounded-lg flex items-center justify-center">
                    <Palette
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md"
                      size={20}
                    />
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                placeholder="0"
                value={newVariant.stock}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    stock: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={addVariant}
            disabled={
              !isClothingCategory ||
              !newVariant.size ||
              !newVariant.colorTitle ||
              !newVariant.colorCode
            }
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Plus size={18} className="mr-2" /> Add Variant
          </button>
        </div>

        {variants.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-medium mb-4 text-gray-800">
              Added Variants
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <div className="max-h-60 overflow-y-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                        Size
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                        Color
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                        Stock
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                        SKU
                      </th>
                      <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 border-b">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((variant, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 border-b">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                            {variant.size}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b">
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                              style={{ backgroundColor: variant.colorCode }}
                            ></div>
                            <span>{variant.colorTitle}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b">
                          <input
                            type="number"
                            min="0"
                            className="w-20 px-3 py-1 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                            value={parseInt(variant.stock)}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "stock",
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </td>
                        <td className="py-3 px-4 border-b">
                          <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {variant.sku}
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Total Stock:</span>{" "}
                {variants.reduce((sum, v) => sum + v.stock, 0)} units
              </p>
            </div>
          </div>
        )}

        {!isClothingCategory && category && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              Variants management is only available for clothing and footwear
              categories.
            </p>
          </div>
        )}
      </div>
      <UploadImages
        variants={variants}
        imgVariants={imgVariants}
        setImgVariants={setImgVariants}
      />
    </div>
  );
};

export default ProductCategory;
