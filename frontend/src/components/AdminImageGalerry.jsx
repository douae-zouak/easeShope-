import { ChevronLeft, ChevronRight } from "lucide-react";

const AdminImageGalerry = ({
  activeImage,
  product,
  selectedColor,
  setActiveImage,
}) => {
  // Get images for the selected color only
  const getImagesForSelectedColor = () => {
    if (!product || !selectedColor) return [];

    const colorVariant = product.imagesVariant.find(
      (variant) => variant.color === selectedColor
    );

    return colorVariant
      ? colorVariant.images.map((img) => ({
          src: img,
          color: selectedColor,
        }))
      : [];
  };

  // Get images for the currently selected color
  const colorImages = getImagesForSelectedColor();

  return (
    <div className="flex flex-col gap-5">
      <div className="relative w-full h-[72vh] bg-gray-100 overflow-hidden group ">
        {colorImages.length > 0 ? (
          <img
            src={colorImages[activeImage]?.src}
            alt={`${product.name} - ${selectedColor}`}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No images available for {selectedColor}
          </div>
        )}

        {colorImages.length > 1 && (
          <>
            <div className="absolute top-1/2 w-full flex justify-between px-3 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((prev) =>
                    prev > 0 ? prev - 1 : colorImages.length - 1
                  );
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((prev) =>
                    prev < colorImages.length - 1 ? prev + 1 : 0
                  );
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded">
              {activeImage + 1} / {colorImages.length}
            </div>
          </>
        )}
      </div>

      {colorImages.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {colorImages.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className={`relative h-24 border cursor-pointer transition-all ${
                index === activeImage
                  ? "border-2 border-black"
                  : "border-gray-300"
              } hover:border-black`}
              onClick={() => setActiveImage(index)}
            >
              <img
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminImageGalerry;
