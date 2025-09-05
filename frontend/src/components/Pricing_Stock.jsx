const Pricing_Stock = ({
  originalPrice,
  setOriginalPrice,
  discount,
  setDiscount,
  discountType,
  setDiscountType,
}) => {
  return (
    <div className="w-full mx-auto p-6 bg-gray-50 rounded-lg shadow-lg mb-10">
      <h2 className="text-lg font-semibold mb-6 text-gray-800">
        Pricing And Stock
      </h2>

      <div className="flex flex-col gap-2">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="product-price"
          >
            Base Pricing
          </label>
          <div className="relative">
            <input
              type="number"
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500  transition-all duration-200"
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              value={originalPrice}
              id="product-price"
              min="0"
            />
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="product-discount"
          >
            Discount
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500  transition-all duration-200"
              onChange={(e) => setDiscount(Number(e.target.value))}
              value={discount}
              id="product-discount"
              min="0"
              max={discountType === "percentage" ? "100" : undefined}
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none text-gray-500">
              %
            </span>
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="product-discount-type"
          >
            Discount Type
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500  transition-all duration-200"
            onChange={(e) => setDiscountType(e.target.value)}
            value={discountType}
            id="product-discount-type"
          />
        </div>
      </div>
    </div>
  );
};

export default Pricing_Stock;
