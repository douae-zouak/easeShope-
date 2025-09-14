const ProductInfo = ({
  productName,
  setProductName,
  productDescription,
  setProductDescription,
  productGender,
  setProductGender,
}) => {
  const genders = ["Men", "Women", "Unisex"];

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 rounded-lg shadow-lg mb-10">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        General Information
      </h2>

      <div className="mb-6">
        <label className="text-md font-normal mb-2" htmlFor="product-name">
          Name Product
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500  transition-all duration-200"
          onChange={(e) => setProductName(e.target.value)}
          value={productName}
          id="product-name"
        />
      </div>

      <div className="">
        <label
          className="text-md font-normal mb-2"
          htmlFor="product-description"
        >
          Description Product
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500  transition-all duration-200 "
          rows={5}
          onChange={(e) => setProductDescription(e.target.value)}
          value={productDescription}
          id="product-description"
        />
      </div>

      <div>
        <p className="text-md font-normal mb-2">Gender</p>
        <div className="flex flex-wrap gap-4">
          {genders.map((gender) => (
            <label
              key={gender}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                className="w-4 h-4 border-gray-300"
                name="gender"
                value={gender}
                checked={gender === productGender}
                onChange={() => setProductGender(gender)}
              />
              <span className="text-sm text-gray-700">{gender}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
