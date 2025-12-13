import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getCategories } from "../../api/categoryApi";
import { getCourses, deleteCourse } from "../../api/courseApi"; // Treat courses as products
import userApi from "../../api/userApi";
import { toast } from "react-hot-toast";
import {
  FaBoxOpen,
  FaList,
  FaUsers,
  FaRupeeSign,
  FaPlus,
  FaChartLine,
} from "react-icons/fa";

const AdminDashboard = () => {
  console.log("AdminDashboard - Rendering...");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); // Renamed courses to products
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Calculate Total Revenue (mock logic based on existing structure)
  // Assuming 'directPayments' exists on course/product object
  const totalRevenue = products.reduce(
    (acc, product) =>
      acc +
      (product.directPayments || []).reduce(
        (acc2, payment) => acc2 + (payment.paymentAmount || 0),
        0
      ),
    0
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Collections (Categories)
        try {
          const categoriesRes = await getCategories();
          const categoriesData = categoriesRes.data || categoriesRes || [];
          setCategories(categoriesData);
        } catch (error) {
          console.error("Error fetching categories:", error);
          toast.error("Failed to load collections");
        }

        // 2. Fetch Products (Courses)
        try {
          const productsRes = await getCourses();
          const productsData = productsRes.data || productsRes || [];
          setProducts(productsData);
        } catch (error) {
          console.error("Error fetching products:", error);
          toast.error("Failed to load products");
        }

        // 3. Fetch Customers (Users)
        try {
          const usersRes = await userApi.getUsers();
          const usersData = usersRes.data || usersRes || [];
          setUsers(usersData);
        } catch (error) {
          console.error("Error fetching users:", error);
          toast.error("Failed to load customers");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Quick Actions Config
  const quickActions = [
    {
      label: "Add New Product",
      icon: <FaPlus />,
      link: "/admin/collections/new",
      color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    },
    {
      label: "Add New Collection",
      icon: <FaPlus />,
      link: "/admin/categories/new",
      color: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    },
  ];

  // Dashboard Stats Cards
  const statsCards = [
    {
      title: "Total Products",
      value: products.length,
      icon: <FaBoxOpen className="w-6 h-6" />,
      color: "bg-emerald-500",
      link: "/admin/collections",
    },
    {
      title: "Collections",
      value: categories.length,
      icon: <FaList className="w-6 h-6" />,
      color: "bg-amber-500",
      link: "/admin/categories",
    },
    {
      title: "Total Customers",
      value: users.length,
      icon: <FaUsers className="w-6 h-6" />,
      color: "bg-blue-500",
      link: "/admin/users",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <FaRupeeSign className="w-6 h-6" />,
      color: "bg-rose-500",
      link: "/admin/payments",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 font-serif">
            Store Overview
          </h2>
          <p className="text-gray-500 mt-1">
            Welcome back, {currentUser?.fullname || "Admin"}. Here's what's
            happening today.
          </p>
        </div>
        <div className="hidden md:block">
          <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            onClick={() => navigate(stat.link)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                View
              </span>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaChartLine className="text-emerald-600" /> Quick Actions
          </h3>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.link)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${action.color}`}
              >
                <span className="font-semibold">{action.label}</span>
                <span className="bg-white/50 p-2 rounded-full text-sm">
                  {action.icon}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Products (Placeholder for Activity) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Recent Inventory
            </h3>
            <Link
              to="/admin/collections"
              className="text-sm text-emerald-600 font-semibold hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="pb-3 pl-2">Product Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {products.slice(0, 5).map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 pl-2 font-medium text-gray-800">
                      {product.title}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-emerald-700">
                      {product.price > 0 ? `₹${product.price}` : "Free"}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          product.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {product.isPublished ? "Live" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-400">
                      No products found. Start by adding one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
