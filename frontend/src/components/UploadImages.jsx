import { useCallback, useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useProductStore } from "../store/product.store";
import {
  Image,
  ImageUp,
  ChevronLeft,
  ChevronRight,
  MoveRight,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

const UploadImages = ({ variants, imgVariants, setImgVariants }) => {
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [uploadPhase, setUploadPhase] = useState("idle");
  const { uploadedImages, uploadImages, deleteImage } = useProductStore();

  const colors = [
    ...new Map(
      variants.map((v) => [v.colorTitle, v]) // clé = colorTitle → garde le premier trouvé
    ).values(),
  ];

  const [color, setColor] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (isUploading) return;

      setError(null);
      setIsUploading(true);
      setUploadProgress(0);
      setUploadPhase("uploading");
      setCurrentIndex(0); // Reset index when new files are uploaded

      try {
        // Create progress callback
        const progressCallback = (progress, phase) => {
          setUploadProgress(progress);
          if (phase) setUploadPhase(phase);
        };

        await uploadImages(acceptedFiles, progressCallback, color);
      } catch (err) {
        setError(err.message || "Something went wrong while uploading");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadPhase("idle");
      }
    },
    [isUploading, uploadImages, color]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: true,
    maxFiles: 10,
    disabled: isUploading,
  });

  const imagesOfSelectedColor = useMemo(() => {
    return uploadedImages.find((group) => group.color === color)?.images || [];
  }, [uploadedImages, color]);

  const imageUrls = imagesOfSelectedColor.map((img) => img.url);

  const canGoRight = currentIndex + 4 < imageUrls.length;
  const canGoLeft = currentIndex > 0;

  const goLeft = () => {
    if (canGoLeft) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goRight = () => {
    if (canGoRight) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleDelete = async (image) => {
    try {
      await deleteImage(image.public_id);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  const addImageVariant = () => {
    if (color && imageUrls.length > 0) {
      setImgVariants([...imgVariants, { color: color, images: imageUrls }]);
      console.log(imageUrls);
      setColor("");
      setCurrentIndex(0); // reset carrousel
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 mb-10 mt-7">
      <div className="flex flex-row justify-between items-center mb-7">
        <div>
          <h2 className="text-lg font-medium mb-2">Upload Images</h2>

          <p className="block text-sm font-medium text-gray-700 ">
            Choose product images depending on category variants
            <span className="text-red-500 ml-1">*</span>
          </p>
        </div>

        {variants.length !== 0 && (
          <div className="flex gap-5 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <select
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="">Select a color</option>
                {colors.map((variant, index) => (
                  <option key={index} value={variant.colorTitle}>
                    {variant.colorTitle}{" "}
                    {/* Optionnel : tu peux ajouter "●" et colorCode si tu veux */}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={addImageVariant}
              disabled={!color || imagesOfSelectedColor.length === 0}
              className="h-[45px] flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Plus size={18} className="mr-2" /> Add Variant
            </button>
          </div>
        )}
      </div>
      <div
        // getRootProps() → te donne tous les props nécessaires pour transformer ton <div> en une "zone réactive" (dropzone).
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive ? "bg-[#7D6BFB] text-white" : "border-[#c0b8f4] bg-white"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input {...getInputProps()} />
        {/* getInputProps() → te donne les props pour un <input type="file"> caché. */}
        <div
          className={`flex flex-col items-center justify-center space-y-4  w-70 h-40 text-center mx-auto ${
            isDragActive ? "bg-[#7D6BFB]" : "bg-white"
          }`}
        >
          {/* isDragActive → un booléen qui dit si un fichier est actuellement en train d’être glissé au-dessus de ta zone. */}
          {isDragActive ? (
            <>
              <Image size={40} color="#ffff" className="" />
              <p className="text-white font-medium text-lg">
                Drop your images here !
              </p>
            </>
          ) : (
            <>
              <ImageUp size={40} color="#878787" />
              <p className="text-gray-600 font-medium">
                <span className="text-lg">
                  Drag & Drop{" "}
                  <span className="text-[#7D6BFB] font-bold">images</span>
                </span>
                <br />
                <span className="text-gray-500">
                  or{" "}
                  <span className="underline text-[#7D6BFB]">browse files</span>{" "}
                  in your computer
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-gray-800 pt-2 flex items-center justify-center gap-2">
        <MoveRight className="inline-block" />
        <span>The last picture you add will be used as the cover</span>
      </p>

      {/* Progress bar */}
      {isUploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#7D6BFB] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-1">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Image gallery with navigation */}
      {imagesOfSelectedColor.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <button
              onClick={goLeft}
              disabled={!canGoLeft}
              className={`p-2 rounded-full ${
                canGoLeft
                  ? "text-[#7D6BFB] hover:bg-gray-100"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex flex-1 justify-center space-x-4 pt-2">
              {imagesOfSelectedColor
                .slice(currentIndex, currentIndex + 4)
                .map((image, index) => {
                  const actualIndex = currentIndex + index;
                  return (
                    <div
                      key={actualIndex}
                      className="flex-shrink-0 w-24 h-24 rounded-md border border-gray-200 relative"
                    >
                      <img
                        src={image.url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        className="absolute -top-1 -right-2 p-1 bg-red-600 text-white rounded-full cursor-pointer"
                        aria-label="Delete image"
                        onClick={() => handleDelete(image)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              {/* {visibleImages.map((image, index) => {
                const actualIndex = currentIndex + index;
                return (
                  <div
                    key={actualIndex}
                    className="flex-shrink-0 w-24 h-24 rounded-md border border-gray-200 relative"
                  >
                    {image ? (
                      <>
                        <img
                          src={
                            image.url ||
                            (image instanceof File
                              ? URL.createObjectURL(image)
                              : "")
                          }
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          className="absolute -top-1 -right-2 p-1  bg-red-600 text-white rounded-full cursor-pointer"
                          aria-label="Delete image"
                          onClick={() => handleDelete(image)}
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                );
              })} */}
            </div>

            <button
              onClick={goRight}
              disabled={!canGoRight}
              className={`p-2 rounded-full ${
                canGoRight
                  ? "text-[#7D6BFB] hover:bg-gray-100"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            {currentIndex + 1}-
            {Math.min(currentIndex + 3, imagesOfSelectedColor.length)} of{" "}
            {imagesOfSelectedColor.length} images
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadImages;
