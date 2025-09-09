const ProductDescription = ({product}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h1 className="text-gray-900 text-2xl font-medium font-title">
        Description & Fit
      </h1>
      <p className="text-gray-600 mt-2 leading-relaxed">
        {product.description}
      </p>
    </div>
  );
};

export default ProductDescription;
