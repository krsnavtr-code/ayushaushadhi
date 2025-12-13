import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaFilePdf,
  FaPaperPlane,
  FaBoxOpen,
  FaLeaf,
  FaFilter,
} from "react-icons/fa";
import {
  getCourses,
  deleteCourse,
  getCategoriesForForm,
} from "../../../api/courseApi"; // Treat courses as products
import api from "../../../api/axios";
import SendCoursePdfModal from "./SendCoursePdfModal"; // Renaming conceptually to SendProductBrochure

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHomeFilter, setShowHomeFilter] = useState("all");

  // PDF State
  const [generatingPdf, setGeneratingPdf] = useState(null);
  const [deletingPdf, setDeletingPdf] = useState(null);
  const [pdfUrls, setPdfUrls] = useState(() => {
    const saved = localStorage.getItem("pdfUrls");
    return saved ? JSON.parse(saved) : {};
  });
  const [productsWithPdf, setProductsWithPdf] = useState(() => {
    const saved = localStorage.getItem("coursesWithPdf"); // Keeping key for compatibility
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [showSendPdfModal, setShowSendPdfModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch Data
  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Fetch Categories
      const categoriesData = await getCategoriesForForm();
      setCategories(categoriesData);

      // Build params
      const params = {
        category: selectedCategory || undefined,
        search: searchTerm || undefined,
        showOnHome:
          showHomeFilter !== "all"
            ? showHomeFilter === "yes"
              ? "true"
              : "false"
            : undefined,
        all: "true",
      };

      // Clean params
      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );

      // Fetch Products
      const response = await getCourses(
        new URLSearchParams(params).toString(),
        true
      );

      let productsData = [];
      if (Array.isArray(response)) {
        productsData = response;
      } else if (response && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response?.data && typeof response.data === "object") {
        productsData = Object.values(response.data);
      }

      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load inventory.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm, showHomeFilter]);

  // Persist PDF state
  useEffect(() => {
    localStorage.setItem(
      "coursesWithPdf",
      JSON.stringify(Array.from(productsWithPdf))
    );
    localStorage.setItem("pdfUrls", JSON.stringify(pdfUrls));
  }, [productsWithPdf, pdfUrls]);

  // Handlers
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This cannot be undone."
      )
    ) {
      try {
        await deleteCourse(id);
        setProducts(products.filter((p) => p._id !== id));
        toast.success("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleGeneratePdf = async (product) => {
    try {
      setGeneratingPdf(product._id);
      // Endpoint logic remains same, just conceptually handling product data
      const response = await api.post(
        `/collections/${product._id}/generate-pdf`
      );

      const newProductsWithPdf = new Set([...productsWithPdf, product._id]);
      const newPdfUrls = {
        ...pdfUrls,
        [product._id]: {
          url: response.data.fileUrl,
          filename: response.data.filename,
        },
      };

      setProductsWithPdf(newProductsWithPdf);
      setPdfUrls(newPdfUrls);
      toast.success("Brochure generated successfully.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate brochure");
    } finally {
      setGeneratingPdf(null);
    }
  };

  const handleDeletePdf = async (product) => {
    if (!window.confirm("Delete this brochure?")) return;

    try {
      setDeletingPdf(product._id);
      const pdfInfo = pdfUrls[product._id];
      if (!pdfInfo?.url) throw new Error("PDF URL not found");

      await api.delete(`/collections/${product._id}/pdf`, {
        data: { fileUrl: pdfInfo.url },
      });

      const newPdfUrls = { ...pdfUrls };
      delete newPdfUrls[product._id];

      const newProductsWithPdf = new Set(productsWithPdf);
      newProductsWithPdf.delete(product._id);

      setPdfUrls(newPdfUrls);
      setProductsWithPdf(newProductsWithPdf);
      toast.success("Brochure deleted successfully");
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast.error("Failed to delete brochure");
    } finally {
      setDeletingPdf(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaBoxOpen className="text-emerald-600" /> Product Inventory
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your herbal products, update prices, and generate brochures.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="new"
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="mt-6 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-xs font-bold text-gray-500 uppercase mb-1"
            >
              Search Products
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="Name, SKU, or Keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label
              htmlFor="category-filter"
              className="block text-xs font-bold text-gray-500 uppercase mb-1"
            >
              Filter by Collection
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400 text-xs" />
              </div>
              <select
                id="category-filter"
                className="block w-full pl-8 pr-10 py-2 text-sm border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Collections</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Home Visibility Filter */}
          <div>
            <label
              htmlFor="home-filter"
              className="block text-xs font-bold text-gray-500 uppercase mb-1"
            >
              Store Visibility
            </label>
            <select
              id="home-filter"
              className="block w-full px-3 py-2 text-sm border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg"
              value={showHomeFilter}
              onChange={(e) => setShowHomeFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="yes">Featured on Home</option>
              <option value="no">Hidden from Home</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 md:rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6"
                    >
                      Product Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      Featured
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-3 py-12 text-sm text-gray-500 text-center"
                      >
                        <FaLeaf className="mx-auto text-4xl text-gray-300 mb-3" />
                        <p>No products found matching your criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                              {product.image || product.thumbnail ? (
                                <img
                                  className="h-full w-full object-cover"
                                  src={product.image || product.thumbnail}
                                  alt={product.title}
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/48?text=Img";
                                  }}
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                  <FaBoxOpen />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {product.title}
                              </div>
                              <div className="text-gray-500 text-xs">
                                SKU: {product._id.slice(-6).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {product.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-700">
                          ₹ {product.price?.toFixed(2) || "0.00"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                          <span
                            className={`inline-flex rounded-full h-2 w-2 ${
                              product.showOnHome
                                ? "bg-amber-400"
                                : "bg-gray-300"
                            }`}
                            title={
                              product.showOnHome
                                ? "Featured on Home"
                                : "Not Featured"
                            }
                          ></span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              product.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {product.isPublished ? "Live" : "Draft"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end space-x-3">
                            <Link
                              to={`/admin/collections/${product._id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              title="Edit Product"
                            >
                              <FaEdit className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowSendPdfModal(true);
                              }}
                              className="text-emerald-600 hover:text-emerald-900 transition-colors"
                              title="Send Brochure"
                            >
                              <FaPaperPlane className="w-4 h-4" />
                            </button>

                            {/* PDF Generation Button */}
                            {pdfUrls[product._id] ? (
                              <button
                                onClick={() => handleDeletePdf(product)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Delete Brochure"
                                disabled={deletingPdf === product._id}
                              >
                                {deletingPdf === product._id ? (
                                  <span className="loading loading-spinner loading-xs">
                                    ...
                                  </span>
                                ) : (
                                  <FaTrash className="w-4 h-4" />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleGeneratePdf(product)}
                                disabled={generatingPdf === product._id}
                                className={`${
                                  generatingPdf === product._id
                                    ? "text-gray-400"
                                    : "text-amber-600 hover:text-amber-800"
                                } transition-colors`}
                                title="Generate Brochure"
                              >
                                {generatingPdf === product._id ? (
                                  <span className="loading loading-spinner loading-xs">
                                    ...
                                  </span>
                                ) : (
                                  <FaFilePdf className="w-4 h-4" />
                                )}
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete Product"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Send Brochure Modal */}
      {selectedProduct && (
        <SendCoursePdfModal
          course={selectedProduct} // Passing product as course prop
          isOpen={showSendPdfModal}
          onClose={() => {
            setShowSendPdfModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => fetchProducts()}
        />
      )}
    </div>
  );
};

export default ProductsList;
