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
} from "../../../api/courseApi";
import userApi from "../../../api/userApi";
import {
  FaBoxOpen,
  FaLeaf,
  FaCloudUploadAlt,
  FaTrash,
  FaPlus,
  FaExclamationTriangle,
  FaInfoCircle,
  FaPills,
} from "react-icons/fa";

// --- Components ---

const FileUploadInput = ({ value, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large. Max 5MB.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadCourseImage(formData);
      if (response && response.success) {
        // We set the URL string as requested
        onChange(response.location || response.fullUrl);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter Image URL or Upload..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
        />
        <label
          className={`cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 ${
            isUploading ? "opacity-50" : ""
          }`}
        >
          <FaCloudUploadAlt />
          <span className="text-sm font-medium">
            {isUploading ? "..." : "Upload"}
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
      {value && (
        <div className="w-32 h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative group">
          <img
            src={
              value.startsWith("http")
                ? value
                : `${import.meta.env.VITE_API_BASE_URL}${value}`
            }
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaTrash size={10} />
          </button>
        </div>
      )}
    </div>
  );
};

const DynamicList = ({
  fields,
  append,
  remove,
  register,
  name,
  placeholder,
  label,
  icon: Icon,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 h-full">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
        {Icon && <Icon className="text-emerald-500" />} {label}
      </h3>
      <button
        type="button"
        onClick={() => append("")}
        className="text-xs font-bold text-emerald-600 hover:text-emerald-800 uppercase tracking-wide flex items-center gap-1"
      >
        <FaPlus /> Add
      </button>
    </div>
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <input
            {...register(`${name}.${index}`)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaTrash />
          </button>
        </div>
      ))}
      {fields.length === 0 && (
        <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          No items added.
        </p>
      )}
    </div>
  </div>
);

// --- Main Form Component ---

export const CourseForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      description: "",
      category: "",
      instructor: "Ayushaushadhi",
      price: 0,
      originalPrice: 0,
      isFree: false,
      // Ayurveda Specifics
      ingredients: [],
      benefits: [],
      warnings: [],
      storage: "",
      additionalInfo: {
        packagingSize: "",
        packagingType: "",
        form: "Capsule",
        shelfLife: "24 Months",
        countryOfOrigin: "Made in India",
        directionOfUse: "",
        gender: "Unisex",
      },
      // System fields
      isFeatured: false,
      isPublished: false,
      showOnHome: false,
      image: "",
      thumbnail: "",
      curriculum: [{ week: 1, title: "Dosage", description: "", topics: [""] }], // Usage Guide
    },
  });

  // Dynamic Fields
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: "ingredients" });
  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({ control, name: "benefits" });
  const {
    fields: warningFields,
    append: appendWarning,
    remove: removeWarning,
  } = useFieldArray({ control, name: "warnings" });
  const {
    fields: usageFields,
    append: appendUsage,
    remove: removeUsage,
  } = useFieldArray({ control, name: "curriculum" });

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [cats, users] = await Promise.all([
          getCategoriesForForm(),
          userApi.getUsers({ role: "instructor" }),
        ]);
        setCategories(cats);
        setInstructors(users);

        if (isEdit && id) {
          const response = await getCourseById(id);
          const data = response.data;

          // Map DB structure to Form
          reset({
            ...data,
            category: data.category?._id || data.category,
            ingredients: data.ingredients?.length
              ? data.ingredients
              : data.prerequisites || [], // Fallback for old data
            benefits: data.benefits || [],
            warnings: data.warnings || [],
            storage: data.storage || "",
            additionalInfo: {
              packagingSize: data.additionalInfo?.packagingSize || "",
              packagingType: data.additionalInfo?.packagingType || "",
              form: data.additionalInfo?.form || data.level || "Capsule",
              shelfLife:
                data.additionalInfo?.shelfLife || data.duration || "24 Months",
              countryOfOrigin:
                data.additionalInfo?.countryOfOrigin || "Made in India",
              directionOfUse: data.additionalInfo?.directionOfUse || "",
              gender: data.additionalInfo?.gender || "Unisex",
            },
            // Map usage guide
            curriculum: data.curriculum?.length
              ? data.curriculum
              : [{ week: 1, title: "Dosage", topics: [""] }],
          });
        }
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id, isEdit, reset]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      // Structure data for DB
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        // Sync top-level fields for compatibility
        level: formData.additionalInfo.form,
        duration: formData.additionalInfo.shelfLife,
        // Ensure arrays are clean strings
        ingredients: formData.ingredients.filter(Boolean),
        benefits: formData.benefits.filter(Boolean),
        warnings: formData.warnings.filter(Boolean),
        // Map Usage Guide
        curriculum: formData.curriculum.map((item, idx) => ({
          ...item,
          week: idx + 1,
          duration: "5 min",
        })),
      };

      if (isEdit) {
        await updateCourse(id, payload);
        toast.success("Product updated!");
      } else {
        await createCourse(payload);
        toast.success("Product created!");
      }
      navigate("/admin/collections");
    } catch (error) {
      toast.error("Save failed. Check console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (val) =>
    val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-serif flex items-center gap-3">
          <FaBoxOpen className="text-emerald-600" />
          {isEdit ? "Edit Product" : "Add New Remedy"}
        </h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/collections")}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-md"
          >
            Save Product
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* --- 1. Basic Info --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
          <h3 className="text-lg font-bold text-emerald-900 mb-6 pb-2 border-b border-gray-100">
            Basic Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Product Title *
              </label>
              <input
                {...register("title", { required: "Required" })}
                onChange={(e) => setValue("slug", generateSlug(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg font-serif"
                placeholder="e.g. 365 Capsule For Men Power"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">Title is required</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Slug
              </label>
              <input
                {...register("slug", { required: true })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm text-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Category *
              </label>
              <select
                {...register("category", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Collection</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Short Description
              </label>
              <textarea
                {...register("shortDescription")}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Brief summary for cards..."
              />
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <label className="block text-xs font-bold text-emerald-800 uppercase mb-2">
                Product Image (URL)
              </label>
              <Controller
                name="image"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FileUploadInput
                    value={value}
                    onChange={(val) => {
                      onChange(val);
                      setValue("thumbnail", val); // Sync thumbnail
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* --- 2. Pricing & Specs --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
          <h3 className="text-lg font-bold text-emerald-900 mb-6 pb-2 border-b border-gray-100">
            Pricing & Specifications
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Sale Price (₹)
              </label>
              <input
                type="number"
                {...register("price", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-bold text-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                MRP (₹)
              </label>
              <input
                type="number"
                {...register("originalPrice")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 line-through"
              />
            </div>

            {/* Additional Info Fields */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Packaging Size
              </label>
              <input
                {...register("additionalInfo.packagingSize")}
                placeholder="e.g. 60 Capsules"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Form
              </label>
              <select
                {...register("additionalInfo.form")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Capsule">Capsule</option>
                <option value="Tablet">Tablet</option>
                <option value="Syrup">Syrup</option>
                <option value="Powder">Powder</option>
                <option value="Oil">Oil</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Shelf Life
              </label>
              <input
                {...register("additionalInfo.shelfLife")}
                placeholder="e.g. 24 Months"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Brand
              </label>
              <input
                {...register("instructor")}
                placeholder="Ayushaushadhi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="mt-6 flex flex-wrap gap-6 bg-gray-50 p-4 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="w-4 h-4 text-emerald-600 rounded"
              />{" "}
              <span className="text-sm font-medium">Bestseller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("showOnHome")}
                className="w-4 h-4 text-emerald-600 rounded"
              />{" "}
              <span className="text-sm font-medium">Show on Home</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isPublished")}
                className="w-4 h-4 text-emerald-600 rounded"
              />{" "}
              <span className="text-sm font-bold text-emerald-700">
                Publish Live
              </span>
            </label>
          </div>
        </div>

        {/* --- 3. Product Content (Ingredients, Benefits, Warnings) --- */}
        <div className="grid md:grid-cols-2 gap-8">
          <DynamicList
            fields={ingredientFields}
            append={appendIngredient}
            remove={removeIngredient}
            register={register}
            name="ingredients"
            label="Key Ingredients"
            icon={FaLeaf}
            placeholder="e.g. Ashwagandha"
          />
          <DynamicList
            fields={benefitFields}
            append={appendBenefit}
            remove={removeBenefit}
            register={register}
            name="benefits"
            label="Health Benefits"
            icon={FaPills}
            placeholder="e.g. Boosts Stamina"
          />
        </div>

        {/* --- 4. Safety & Description --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
          <h3 className="text-lg font-bold text-emerald-900 mb-6 pb-2 border-b border-gray-100">
            Detailed Information
          </h3>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Full Description
            </label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field: { onChange, value } }) => (
                <ReactQuill
                  theme="snow"
                  value={value || ""}
                  onChange={onChange}
                  className="h-48 mb-12 rounded-lg"
                />
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                <FaExclamationTriangle /> Safety Warnings
              </h4>
              <div className="space-y-2">
                {warningFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`warnings.${index}`)}
                      className="flex-1 px-3 py-2 border border-red-200 bg-red-50 rounded text-sm"
                      placeholder="Warning..."
                    />
                    <button
                      type="button"
                      onClick={() => removeWarning(index)}
                      className="text-red-400"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendWarning("")}
                  className="text-xs font-bold text-red-600"
                >
                  + Add Warning
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-700 uppercase mb-2 flex items-center gap-2">
                <FaInfoCircle /> Storage Instructions
              </label>
              <textarea
                {...register("storage")}
                rows={3}
                className="w-full px-4 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm"
                placeholder="e.g. Store in a cool, dry place..."
              />
            </div>
          </div>
        </div>

        {/* --- 5. Usage Guide --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-emerald-900">
              Dosage & Usage
            </h3>
            <button
              type="button"
              onClick={() =>
                appendUsage({
                  week: usageFields.length + 1,
                  title: "",
                  topics: [""],
                })
              }
              className="text-sm font-bold text-emerald-600 hover:underline"
            >
              + Add Usage Step
            </button>
          </div>

          <div className="space-y-4">
            {usageFields.map((item, index) => (
              <div
                key={item.id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-700">
                    Step {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeUsage(index)}
                    className="text-red-500 text-xs uppercase font-bold"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3">
                  <input
                    {...register(`curriculum.${index}.title`)}
                    placeholder="Title (e.g. Morning Dose)"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <textarea
                    {...register(`curriculum.${index}.description`)}
                    placeholder="Instructions..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />

                  {/* Nested Topics for specific steps */}
                  <Controller
                    control={control}
                    name={`curriculum.${index}.topics`}
                    render={({ field }) => (
                      <input
                        value={field.value?.[0] || ""}
                        onChange={(e) => field.onChange([e.target.value])}
                        placeholder="Specific instruction (e.g. Take with warm milk)"
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
