import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const Galery = ({ selectedVariant, product }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // Trouver les images pour la couleur sélectionnée
  const selectedColorImages = selectedVariant
    ? product.imagesVariant.find((v) => v.color === selectedVariant.colorTitle)
        ?.images || []
    : product.imagesVariant[0]?.images || [];

  const nextImage = () => {
    if (selectedImage < selectedColorImages.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const prevImage = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };
  return (
    <div className="md:w-1/2">
      <div className="sticky top-20">
        {/* Image principale */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-lg">
          {selectedColorImages.length > 0 ? (
            <img
              src={selectedColorImages[selectedImage]}
              alt={product.name}
              className="w-full  h-full object-contain p-4"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}

          {selectedColorImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                disabled={selectedImage === 0}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md disabled:opacity-50"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                disabled={selectedImage === selectedColorImages.length - 1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md disabled:opacity-50"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {product.discount > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{product.discount}%
            </div>
          )}
        </div>

        {selectedColorImages.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {selectedColorImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${
                  selectedImage === index
                    ? "border-indigo-500"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={img}
                  alt={`View ${index + 1} of ${product.name}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Galery;
