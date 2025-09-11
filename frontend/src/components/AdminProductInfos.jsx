import { Box, Calendar, CreditCard, Hash } from "lucide-react";

const AdminProductInfos = ({
  product,
  setSelectedColor,
  setActiveImage,
  selectedColor,
}) => {
  // Handle color change
  const handleColorChange = (color) => {
    setSelectedColor(color);
    setActiveImage(0); // Reset to first image when color changes
  };

  // Trouver le code couleur correspondant à la couleur sélectionnée
  const getColorCode = (colorName) => {
    const variant = product.variants.find((v) => v.colorTitle === colorName);
    return variant ? variant.colorCode : "#CCCCCC"; // Couleur par défaut si non trouvée
  };

  // Filter variants by selected color
  const variantsByColor = product.variants.filter(
    (v) => v.colorTitle === selectedColor
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-2xl font-light uppercase tracking-wide">
          {product.name}
        </h2>
        <p className="text-gray-600 uppercase text-sm tracking-wide">
          {product.category} • {product.gender}
        </p>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-gray-100 border-l-4 border-black">
          <div className="flex items-center gap-3 text-gray-600">
            <Box size={18} />
            <span>
              Total Stock:{" "}
              <strong className="text-black">{product.stock} units</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <CreditCard size={18} />
            <span>
              Price:{" "}
              <strong className="text-black">{product.originalPrice} DH</strong>
            </span>
            {product.discount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                {product.discount}% OFF
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Hash size={18} />
            <span>
              SKU:{" "}
              <strong className="text-black">
                {product.variants[0]?.sku?.split("-")[0]}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar size={18} />
            <span>
              Created:{" "}
              <strong className="text-black">
                {new Date(product.createdAt).toLocaleDateString()}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium uppercase tracking-wide">
          Select Color
        </h3>
        <div className="flex flex-wrap gap-3">
          {product.imagesVariant.map((variant) => (
            <div
              key={variant.color}
              className={`flex flex-col items-center gap-2 p-3 border cursor-pointer transition-all min-w-20 ${
                selectedColor === variant.color
                  ? "border-black bg-gray-100"
                  : "border-gray-300"
              } hover:border-black hover:-translate-y-1`}
              onClick={() => handleColorChange(variant.color)}
            >
              <div
                className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                style={{
                  backgroundColor: getColorCode(variant.color),
                }}
              ></div>
              <span className="text-xs text-gray-600 uppercase">
                {variant.color}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Size and Stock */}
      {variantsByColor.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium uppercase tracking-wide">
            Available Sizes for {selectedColor}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {variantsByColor.map((variant, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 text-center transition-all hover:border-black hover:-translate-y-1"
              >
                <div className="font-medium text-black mb-2">
                  {variant.size}
                  <span className="ml-2 text-green-600 text-sm font-medium">
                    ({variant.stock})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductInfos;
