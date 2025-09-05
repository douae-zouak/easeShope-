import {
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  SquarePen,
  BadgePercent,
} from "lucide-react";

const ProductCard = ({ product, onEdit, onDelete }) => {
  // Récupère la dernière image du tableau
  const mainImage =
    product.imagesVariant[0].images[product.imagesVariant[0].images.length - 1];

  // Configuration des couleurs selon le statut
  const statusConfig = {
    active: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="w-4 h-4" />,
      text: "Active",
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="w-4 h-4" />,
      text: "Pending",
    },
    out_of_stock: {
      color: "bg-red-100 text-red-800",
      icon: <AlertTriangle className="w-4 h-4" />,
      text: "Out of Stock",
    },
    draft: {
      color: "bg-gray-100 text-gray-800",
      icon: <SquarePen className="w-4 h-4" />,
      text: "Draft",
    },
  };

  const { color, icon, text } = statusConfig[product.status];

  // Configuration du style de discount selon le pourcentage
  const getDiscountStyle = (discount) => {
    if (discount >= 50) {
      return {
        bg: "bg-gradient-to-r from-red-500 to-pink-600",
        icon: <Flame className="size-4" />,
        text: "text-white",
        pulse: true,
      };
    } else if (discount >= 30) {
      return {
        bg: "bg-gradient-to-r from-orange-500 to-amber-600",
        icon: <Zap className="size-4" />,
        text: "text-white",
        pulse: false,
      };
    } else if (discount >= 15) {
      return {
        bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
        icon: <Sparkles className="size-4" />,
        text: "text-white",
        pulse: false,
      };
    } else {
      return {
        bg: "bg-gradient-to-r from-cyan-500 to-blue-600",
        icon: <BadgePercent className="size-4" />,
        text: "text-white",
        pulse: false,
      };
    }
  };

  const discountStyle =
    product.discount > 0 ? getDiscountStyle(product.discount) : null;

  // Calcul du prix après réduction
  const discountedPrice =
    product.discount > 0 ? product.price * (1 - product.discount / 100) : null;

  return (
    <div
      className={`relative border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md `}
    >
      {/* Image principale */}
      <div className="aspect-square bg-gray-100 relative">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Badge de statut */}
      <div
        className={`absolute top-2 right-2 flex items-center px-2 py-1 rounded-full text-xs ${color}`}
      >
        {icon}
        <span className="ml-1">{text}</span>
      </div>

      {/* Badge de discount moderne */}
      {product.discount > 0 && (
        <div
          className={`absolute top-2 left-2 z-1 ${
            discountStyle.pulse ? "animate-pulse" : ""
          }`}
        >
          <div
            className={`${discountStyle.bg} text-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transform transition-all duration-300 group-hover:scale-105`}
          >
            {discountStyle.icon}
            <span className="font-bold text-sm">{product.discount}% OFF</span>
          </div>

          {/* Triangle décoratif */}
          <div
            className={`absolute -bottom-1 left-3 w-3 h-3 ${
              discountStyle.bg.split(" ")[0]
            } rotate-45`}
          ></div>
        </div>
      )}

      {/* Contenu texte */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
          <div className="flex flex-col items-end">
            {discountedPrice ? (
              <>
                <span className="text-lg font-semibold text-green-700">
                  {discountedPrice.toFixed(2)}DH
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {product.price.toFixed(2)}DH
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold">
                {product.price.toFixed(2)}DH
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3">{product.category}</p>

        {/* Stock et actions */}
        <div className="flex justify-between items-center pt-3 border-t">
          <span
            className={`text-sm ${
              product.stock < 5 ? "text-red-500" : "text-gray-600"
            }`}
          >
            Stock: {product.stock}
          </span>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(product._id)}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
              aria-label="Edit product"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              aria-label="Delete product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
