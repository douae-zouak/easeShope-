import React, { useState } from "react";
import { Upload, FileText, X, Plus, Trash2 } from "lucide-react";

const SizeChartManager = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("manual");
  const [sizeData, setSizeData] = useState([
    { size: "", chest: "", length: "", sleeve: "" },
  ]);
  const [pdfFile, setPdfFile] = useState(null);

  const handleAddRow = () => {
    setSizeData([...sizeData, { size: "", chest: "", length: "", sleeve: "" }]);
  };

  const handleRemoveRow = (index) => {
    if (sizeData.length === 1) return;
    const newData = [...sizeData];
    newData.splice(index, 1);
    setSizeData(newData);
  };

  const handleInputChange = (index, field, value) => {
    const newData = [...sizeData];
    newData[index][field] = value;
    setSizeData(newData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
  };

  const handleSave = () => {
    if (activeTab === "manual") {
      console.log("Size data:", sizeData);
      alert("Size chart data saved successfully!");
    } else {
      console.log("PDF file:", pdfFile);
      alert("PDF uploaded successfully!");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Size Chart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "manual"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("manual")}
            >
              Manual Entry
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "pdf"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("pdf")}
            >
              Upload PDF
            </button>
          </div>

          {activeTab === "manual" ? (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Enter Size Information
                </h3>
                <p className="text-sm text-gray-600">
                  Add measurements for each size variant
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left text-sm font-medium text-gray-700">
                        Size
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">
                        Chest (in)
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">
                        Length (in)
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">
                        Sleeve (in)
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            value={row.size}
                            onChange={(e) =>
                              handleInputChange(index, "size", e.target.value)
                            }
                            placeholder="e.g., S, M, L"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            value={row.chest}
                            onChange={(e) =>
                              handleInputChange(index, "chest", e.target.value)
                            }
                            placeholder="Chest"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            value={row.length}
                            onChange={(e) =>
                              handleInputChange(index, "length", e.target.value)
                            }
                            placeholder="Length"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            value={row.sleeve}
                            onChange={(e) =>
                              handleInputChange(index, "sleeve", e.target.value)
                            }
                            placeholder="Sleeve"
                          />
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleRemoveRow(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                            disabled={sizeData.length === 1}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleAddRow}
                className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <Plus size={18} className="mr-1" />
                Add Another Size
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Upload Size Chart PDF
                </h3>
                <p className="text-sm text-gray-600">
                  Upload a PDF document containing your size chart information
                </p>
              </div>

              {pdfFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                  <FileText size={48} className="text-indigo-500 mb-3" />
                  <p className="font-medium text-gray-800">{pdfFile.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {(pdfFile.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    onClick={handleRemovePdf}
                    className="mt-4 text-red-500 hover:text-red-700 font-medium flex items-center"
                  >
                    <X size={16} className="mr-1" />
                    Remove File
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload size={48} className="text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF only</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={
                (activeTab === "manual" && sizeData.some((row) => !row.size)) ||
                (activeTab === "pdf" && !pdfFile)
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save Size Chart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage component with a trigger button
const SizeChart = () => {
  const [showSizeChart, setShowSizeChart] = useState(false);

  return (
    <div className="p-6">
      <button
        onClick={() => setShowSizeChart(true)}
        className="px-4 py-2 border-2 border-[#7D6BFB] text-sm text-black rounded-lg hover:scale-102 transition-all duration-300 cursor-pointer"
      >
        Manage Size Chart
      </button>

      {showSizeChart && (
        <SizeChartManager onClose={() => setShowSizeChart(false)} />
      )}
    </div>
  );
};

export default SizeChart;
