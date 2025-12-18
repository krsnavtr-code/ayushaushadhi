import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  createCourse,
  updateCourse,
  getCourseById,
  getCategoriesForForm,
  uploadCourseImage,
} from "../../../api/courseApi"; // Using existing API endpoints
import userApi from "../../../api/userApi";
import {
  FaBoxOpen,
  FaLeaf,
  FaCloudUploadAlt,
  FaTrash,
  FaPlus,
  FaExclamationCircle,
} from "react-icons/fa";

// Error boundary for file upload
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in FileUploadInput:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 p-4 border border-red-300 bg-red-50 rounded flex items-center gap-2">
          <FaExclamationCircle />
          <div>
            <p>Something went wrong with the file upload.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-1 text-sm text-emerald-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// File Upload Component
const FileUploadInput = ({ onFileSelect, thumbnail, onRemove }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large. Maximum size is 5MB.");
        return;
      }

      e.target.value = ""; // Reset input

      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadCourseImage(formData);

      if (!response || !response.success) {
        throw new Error(response?.message || "Upload failed");
      }

      const imagePath = response.location;
      onFileSelect(imagePath);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error in file upload:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const getThumbnailUrl = (thumb) => {
    if (!thumb) return "";
    try {
      if (thumb.startsWith("http")) return thumb;
      const baseUrl = import.meta.env.VITE_API_URL;
      const path = thumb.startsWith("/") ? thumb : `/${thumb}`;
      return `${baseUrl}${path}`;
    } catch (error) {
      return "";
    }
  };

  const thumbnailUrl = getThumbnailUrl(thumbnail);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div className="flex-shrink-0 relative group">
        <div className="w-40 h-40 bg-emerald-50 rounded-xl overflow-hidden border-2 border-dashed border-emerald-200 flex items-center justify-center relative">
          {thumbnail ? (
            <img
              src={thumbnailUrl}
              alt="Product thumbnail"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/400x400?text=No+Image";
              }}
            />
          ) : (
            <div className="text-center p-4">
              <FaLeaf className="mx-auto text-3xl text-emerald-200 mb-2" />
              <span className="text-emerald-400 text-xs">No image</span>
            </div>
          )}

          {thumbnail && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              title="Remove Image"
            >
              <FaTrash className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1">
        <label
          className={`relative cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-emerald-300 shadow-sm text-sm font-medium rounded-lg text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <span className="loading loading-spinner loading-xs"></span>{" "}
              Uploading...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FaCloudUploadAlt className="text-lg" /> Choose Image
            </span>
          )}
          <input
            type="file"
            className="sr-only"
            accept="image/*"
            disabled={isUploading}
            onChange={handleFileChange}
          />
        </label>
        <p className="mt-3 text-xs text-gray-500">
          Recommended: Square (1000x1000px). Max 5MB.
        </p>
      </div>
    </div>
  );
};

// Usage Guide (Curriculum) Item
const UsageGuideItem = ({
  week,
  weekIndex,
  removeWeek,
  register,
  control,
  errors,
}) => {
  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: `curriculum.${weekIndex}.topics`,
  });

  return (
    <div className="mb-6 border border-emerald-100 bg-emerald-50/30 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-emerald-100">
        <h4 className="text-md font-bold text-emerald-800 flex items-center gap-2">
          <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">
            {weekIndex + 1}
          </span>
          Usage Phase / Method
        </h4>
        <button
          type="button"
          onClick={() => removeWeek(weekIndex)}
          className="text-xs text-red-500 hover:text-red-700 font-medium uppercase tracking-wide flex items-center gap-1"
        >
          <FaTrash /> Remove Phase
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Method Title *
          </label>
          <input
            type="text"
            {...register(`curriculum.${weekIndex}.title`, {
              required: "Title is required",
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            placeholder="e.g., Morning Routine"
          />
          {errors.curriculum?.[weekIndex]?.title && (
            <p className="mt-1 text-xs text-red-600">
              {errors.curriculum[weekIndex].title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Description / Note
          </label>
          <textarea
            {...register(`curriculum.${weekIndex}.description`)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            placeholder="Brief instruction..."
          />
        </div>

        <input
          type="hidden"
          {...register(`curriculum.${weekIndex}.duration`)}
          value="5 mins"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
          Steps / Actions
        </label>
        <div className="space-y-2">
          {stepFields.map((step, stepIndex) => (
            <div key={step.id} className="flex items-center gap-2">
              <input
                type="text"
                {...register(`curriculum.${weekIndex}.topics.${stepIndex}`, {
                  required: "Step is required",
                })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                placeholder={`Step ${stepIndex + 1}`}
              />
              <button
                type="button"
                onClick={() => removeStep(stepIndex)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendStep("")}
            className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 uppercase tracking-wide"
          >
            <FaPlus /> Add Step
          </button>
        </div>
      </div>
    </div>
  );
};

export const CourseForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]); // Brands/Vaidyas

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      description: "",
      category: "",
      instructor: "",
      isFree: false,
      price: 0,
      originalPrice: 0,
      totalHours: 100, // Net Qty
      duration: "12 Months", // Shelf Life
      level: "Tablet", // Product Form
      language: "Ayurveda",
      certificateIncluded: false, // Prescription Req
      isFeatured: false,
      isPublished: false,
      showOnHome: false,
      status: "draft",
      image: "",
      thumbnail: "",
      // Mapped Arrays
      prerequisites: ["Ashwagandha"], // Ingredients
      whatYouWillLearn: ["Boosts Immunity"], // Benefits
      requirements: ["Store in cool place"], // Storage
      whoIsThisFor: ["Adults"], // Target Audience
      skills: ["Immunity"], // Tags
      faqs: [],
      curriculum: [
        {
          week: 1,
          title: "Standard Dosage",
          description: "Recommended daily intake",
          duration: "0 min",
          topics: ["Take 1 tablet twice daily with warm water"],
        },
      ],
    },
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({ control, name: "faqs" });
  const {
    fields: curriculumFields,
    append: appendWeek,
    remove: removeWeek,
  } = useFieldArray({ control, name: "curriculum" });

  // Custom Arrays for Product Details
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: "prerequisites" });
  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({ control, name: "whatYouWillLearn" });
  const {
    fields: storageFields,
    append: appendStorage,
    remove: removeStorage,
  } = useFieldArray({ control, name: "requirements" });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategoriesForForm();
        setCategories(categoriesData);

        const instructorsData = await userApi.getUsers({ role: "instructor" });
        setInstructors(instructorsData);

        if (isEdit && id) {
          const response = await getCourseById(id);
          const productData = response.data;

          const ensureArray = (arr) =>
            Array.isArray(arr) && arr.length > 0 ? arr : [""];

          reset({
            ...productData,
            category: productData.category?._id || productData.category || "",
            // Mapping fields back
            prerequisites: ensureArray(productData.prerequisites), // Ingredients
            whatYouWillLearn: ensureArray(productData.whatYouWillLearn), // Benefits
            requirements: ensureArray(productData.requirements), // Storage
            whoIsThisFor: ensureArray(productData.whoIsThisFor), // Target Audience
            skills: ensureArray(productData.skills), // Tags
            curriculum: productData.curriculum?.length
              ? productData.curriculum
              : [{ week: 1, title: "Dosage", topics: [""] }],

            isFree: Boolean(productData.isFree),
            isFeatured: Boolean(productData.isFeatured),
            isPublished: Boolean(productData.isPublished),
            showOnHome: Boolean(productData.showOnHome),
            certificateIncluded: productData.certificateIncluded, // Prescription Req
          });
        }
      } catch (error) {
        toast.error("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, isEdit, reset]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const price = formData.isFree
        ? 0
        : Math.max(0, Number(formData.price) || 0);

      const dataToSend = {
        ...formData,
        price,
        originalPrice: Math.max(0, Number(formData.originalPrice) || price),
        totalHours: Math.max(0, Number(formData.totalHours) || 0), // Net Qty

        // Clean Arrays
        prerequisites: formData.prerequisites
          .filter((i) => i && i.toString().trim() !== "")
          .map((i) => i.toString().trim()),
        whatYouWillLearn: formData.whatYouWillLearn
          .filter((b) => b && b.toString().trim() !== "")
          .map((b) => b.toString().trim()),
        requirements: formData.requirements
          .filter((r) => r && r.toString().trim() !== "")
          .map((r) => r.toString().trim()),

        curriculum: formData.curriculum.map((week, index) => ({
          week: Number(week.week) || index + 1,
          title: week.title?.toString().trim() || `Phase ${index + 1}`,
          description: week.description?.toString().trim() || "",
          duration: "5 min",
          topics: Array.isArray(week.topics)
            ? week.topics.filter((t) => t).map((t) => t.toString().trim())
            : [],
        })),

        // Product Metadata
        level: formData.level, // Form
        language: "Ayurveda",
      };

      if (isEdit) {
        await updateCourse(id, dataToSend);
        toast.success("Product updated successfully!");
      } else {
        await createCourse(dataToSend);
        toast.success("Product created successfully!");
      }
      navigate("/admin/collections");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const updateSlug = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-gray-800">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif flex items-center gap-2">
            <FaBoxOpen className="text-emerald-600" />
            {isEdit ? "Edit Product" : "Add New Remedy"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage inventory details, pricing, and health benefits.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate("/admin/collections")}
            className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg shadow-md text-white bg-emerald-600 hover:bg-emerald-700 font-medium text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <FaPlus />
            )}
            {isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-50">
          <h3 className="text-lg font-bold text-emerald-900 mb-6 pb-2 border-b border-gray-100">
            Basic Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Product Name *
              </label>
              <input
                type="text"
                {...register("title", { required: "Name is required" })}
                onChange={(e) => setValue("slug", updateSlug(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-serif"
                placeholder="e.g., Ashwagandha Immunity Booster"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                URL Slug
              </label>
              <input
                type="text"
                {...register("slug", { required: "Slug is required" })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Collection (Category) *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Collection</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Brand / Formulator *
              </label>
              <select
                {...register("instructor", { required: "Required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Brand</option>
                <option value="Ayushaushadhi">Ayushaushadhi (In-house)</option>
                {instructors.map((inst, index) => (
                  <option key={index} value={inst._id}>
                    {inst.fullname || inst.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Product Form
              </label>
              <select
                {...register("level")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Tablet">Tablet</option>
                <option value="Syrup">Syrup</option>
                <option value="Oil">Oil</option>
                <option value="Powder">Powder (Churan)</option>
                <option value="Capsule">Capsule</option>
                <option value="Raw Herb">Raw Herb</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Short Summary *
            </label>
            <textarea
              {...register("shortDescription", {
                required: "Required",
                maxLength: { value: 300, message: "Max 300 chars" },
              })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="Brief description for product cards..."
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-50">
          <h3 className="text-lg font-bold text-emerald-900 mb-6 pb-2 border-b border-gray-100">
            Pricing & Attributes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Sale Price (₹)
              </label>
              <input
                type="number"
                {...register("price", {
                  required: true,
                  min: 0,
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-700 text-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                MRP (₹)
              </label>
              <input
                type="number"
                {...register("originalPrice", { min: 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500 line-through decoration-red-400"
              />
            </div>

            {/* Net Quantity */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Net Qty / Weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register("totalHours", { min: 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <span className="absolute right-4 top-3.5 text-gray-400 text-xs font-bold">
                  g / ml
                </span>
              </div>
            </div>

            {/* Shelf Life */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Shelf Life
              </label>
              <input
                type="text"
                {...register("duration", { required: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="e.g. 24 Months"
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium">Bestseller</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
              <input
                type="checkbox"
                {...register("showOnHome")}
                className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium">Featured on Home</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
              <input
                type="checkbox"
                {...register("isPublished")}
                className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
              />
              <span className="text-sm font-bold text-emerald-700">
                Publish Live
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
              <input
                type="checkbox"
                {...register("certificateIncluded")}
                className="w-5 h-5 text-red-500 rounded border-gray-300 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-red-600">
                Prescription Req.
              </span>
            </label>
          </div>
        </div>

        {/* Dynamic Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Key Ingredients */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-emerald-900">
                Key Ingredients
              </h3>
              <button
                type="button"
                onClick={() => appendIngredient("")}
                className="text-sm text-emerald-600 font-bold hover:underline"
              >
                + Add Ingredient
              </button>
            </div>
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-3">
                <input
                  {...register(`prerequisites.${index}`)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder={`Ingredient ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-400 hover:text-red-600 p-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {ingredientFields.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                No ingredients added yet.
              </p>
            )}
          </div>

          {/* Health Benefits */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-emerald-900">
                Health Benefits
              </h3>
              <button
                type="button"
                onClick={() => appendBenefit("")}
                className="text-sm text-emerald-600 font-bold hover:underline"
              >
                + Add Benefit
              </button>
            </div>
            {benefitFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-3">
                <input
                  {...register(`whatYouWillLearn.${index}`)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder={`Benefit ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="text-red-400 hover:text-red-600 p-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {benefitFields.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                No benefits listed.
              </p>
            )}
          </div>
        </div>

        {/* Detailed Info */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-50">
          <h3 className="text-lg font-bold text-emerald-900 mb-4">
            Detailed Description
          </h3>
          <div className="prose max-w-none">
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field: { onChange, value } }) => (
                <ReactQuill
                  theme="snow"
                  value={value || ""}
                  onChange={onChange}
                  className="h-64 mb-12 rounded-lg overflow-hidden"
                />
              )}
            />
          </div>
        </div>

        {/* Usage Guide (Curriculum) */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-emerald-900">
              Dosage & Usage Guide
            </h3>
            <button
              type="button"
              onClick={() =>
                appendWeek({
                  week: curriculumFields.length + 1,
                  title: "",
                  description: "",
                  topics: [""],
                })
              }
              className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-bold hover:bg-amber-200 transition-colors shadow-sm"
            >
              + Add Usage Phase
            </button>
          </div>
          <div className="space-y-4">
            {curriculumFields.map((week, index) => (
              <UsageGuideItem
                key={week.id}
                week={week}
                weekIndex={index}
                removeWeek={removeWeek}
                register={register}
                control={control}
                errors={errors}
              />
            ))}
            {curriculumFields.length === 0 && (
              <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-sm">
                  No usage instructions added yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-50">
          <h3 className="text-lg font-bold text-emerald-900 mb-4">
            Product Image
          </h3>
          <ErrorBoundary>
            <Controller
              name="thumbnail"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FileUploadInput
                  thumbnail={value}
                  onFileSelect={(path) => onChange(path)}
                  onRemove={() => onChange("")}
                />
              )}
            />
          </ErrorBoundary>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
