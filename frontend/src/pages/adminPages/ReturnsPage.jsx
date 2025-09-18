import { useState, useEffect } from "react";
import { Package, CheckCircle, DollarSign, Search } from "lucide-react";
import VendorNav from "../../components/VendorNav";
import { useReturnStore } from "../../store/return.store";

const ReturnsPage = () => {
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { getApprovedReturn, approvedReturn, isLoading } = useReturnStore();

  useEffect(() => {
    getApprovedReturn();
  }, []);

  // Transformer les données de l'API pour qu'elles correspondent à l'interface attendue
  useEffect(() => {
    if (approvedReturn) {
      // Aplatir tous les éléments de retour de toutes les commandes
      const allReturnItems = approvedReturn.flatMap((order) =>
        order.items.map((item) => ({
          ...item,
          orderNumber: order.orderNumber,
          shippingAddress: order.shippingAddress,
          // Ajouter le nom du produit depuis productId si disponible
          productName:
            item.productId?.name ||
            item.productName ||
            "Product Name Not Available",
        }))
      );

      if (searchTerm === "") {
        setFilteredReturns(allReturnItems);
      } else {
        const filtered = allReturnItems.filter(
          (item) =>
            item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.shippingAddress.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
        setFilteredReturns(filtered);
      }
    }
  }, [searchTerm, approvedReturn]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <header className="fixed top-0 left-0 right-0 h-16 z-10">
        <VendorNav />
      </header>
      <div className="max-w-7xl mx-auto mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Approved Returns</h1>
          <p className="text-gray-600 mt-2">
            View all approved product return requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Package className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredReturns.length}
                </h2>
                <p className="text-gray-600">Total Returns</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredReturns.length}
                </h2>
                <p className="text-gray-600">Approved Returns</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredReturns
                    .reduce(
                      (total, item) =>
                        total +
                        (item.priceAtPurchase || 0) * (item.quantity || 0),
                      0
                    )
                    .toFixed(2)}{" "}
                  DH
                </h2>
                <p className="text-gray-600">Total Refund Amount</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by product or order ID"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Returns Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {filteredReturns.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No return requests found
              </h3>
              <p className="mt-1 text-gray-500">
                There are currently no approved return requests.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Return Reason
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Refund Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReturns.map((item, index) => (
                    <tr
                      key={`${item._id}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {item.colorImages && item.colorImages.length > 0 ? (
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={item.colorImages[0]}
                                alt={item.productName}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.productName}
                            </div>
                            <div className="text-sm text-gray-500">
                              <span className="inline-flex items-center">
                                {item.colorCode && (
                                  <span
                                    className="h-3 w-3 rounded-full inline-block mr-1 border border-gray-300"
                                    style={{ backgroundColor: item.colorCode }}
                                  ></span>
                                )}
                                {item.colorTitle && `${item.colorTitle}, `}
                                {item.size}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Qty: {item.quantity || 1}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(item.returnDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.shippingAddress?.name ||
                            "Customer Name Not Available"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.returnReason || "No reason provided"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {(
                            (item.priceAtPurchase || 0) * (item.quantity || 1)
                          ).toFixed(2)}{" "}
                          DH
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
