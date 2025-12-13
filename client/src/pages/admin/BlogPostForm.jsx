import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
} from "../../api/blogApi";
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaGlobe,
  FaTags,
  FaPenNib,
} from "react-icons/fa";

const BlogPostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      status: "draft",
      tags: "",
      seo: {
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
      },
    },
  });

  // Watch title to auto-generate slug
  const titleValue = watch("title");
  const featuredImageValue = watch("featuredImage");

  // Fetch post data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const response = await getBlogPostById(id);
        const post = response.data?.post || response.post;

        // Reset form with fetched data
        reset({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featuredImage: post.featuredImage || "",
          status: post.status || "draft",
          tags: post.tags?.join(", ") || "",
          seo: {
            metaTitle: post.seo?.metaTitle || "",
            metaDescription: post.seo?.metaDescription || "",
            metaKeywords: Array.isArray(post.seo?.metaKeywords)
              ? post.seo.metaKeywords.join(", ")
              : post.seo?.metaKeywords || "",
          },
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post data");
        navigate("/admin/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, navigate, reset]);

  // Generate slug from title
  const generateSlug = (value) => {
    if (!value) return "";
    return value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  // Auto-generate slug when title changes (only if slug is empty or user hasn't manually edited it significantly)
  useEffect(() => {
    if (!isEditMode && titleValue) {
      const slug = generateSlug(titleValue);
      setValue("slug", slug);
    }
  }, [titleValue, isEditMode, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setSaving(true);

      // Process Tags and Keywords strings into Arrays
      const processCommaSeparated = (str) => {
        if (!str) return [];
        return str
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      };

      const postData = {
        ...data,
        tags: processCommaSeparated(data.tags),
        seo: {
          ...data.seo,
          metaKeywords: processCommaSeparated(data.seo.metaKeywords),
        },
      };

      if (isEditMode) {
        await updateBlogPost(id, postData);
        toast.success("Post updated successfully");
      } else {
        await createBlogPost(postData);
        toast.success("Post created successfully");
      }

      navigate("/admin/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} post`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/blog")}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-serif">
              {isEditMode ? "Edit Blog Post" : "Create New Article"}
            </h1>
            <p className="text-sm text-gray-500">
              Share wellness knowledge with your audience.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/blog")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-md transition-colors flex items-center gap-2"
          >
            {saving ? (
              <span className="loading loading-spinner loading-xs">
                Saving...
              </span>
            ) : (
              <>
                <FaSave /> {isEditMode ? "Update Post" : "Publish Post"}
              </>
            )}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Content Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
            <h2 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-2">
              <FaPenNib className="text-emerald-600" /> Article Content
            </h2>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "Title is required",
                    maxLength: 200,
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-serif text-lg"
                  placeholder="Enter an engaging title..."
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Slug (URL)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /blog/
                  </span>
                  <input
                    type="text"
                    {...register("slug", { required: "Slug is required" })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-600"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Excerpt
                </label>
                <textarea
                  {...register("excerpt", { maxLength: 300 })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm"
                  placeholder="A short summary of the post..."
                />
                <p className="text-xs text-gray-400 text-right mt-1">
                  Max 300 characters
                </p>
              </div>

              {/* Rich Text Editor */}
              <div className="h-[500px]">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Body Content
                </label>
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: "Content is required" }}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      className="h-[400px] bg-white rounded-lg"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link", "image", "code-block"],
                          ["clean"],
                        ],
                      }}
                    />
                  )}
                />
                {errors.content && (
                  <p className="text-red-500 text-xs mt-12">
                    {errors.content.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar Settings */}
        <div className="space-y-8">
          {/* Publish Settings */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
            <h2 className="text-sm font-bold text-emerald-900 mb-4 uppercase tracking-wide">
              Publishing
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
            <h2 className="text-sm font-bold text-emerald-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <FaImage className="text-emerald-600" /> Featured Image
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                {...register("featuredImage")}
                placeholder="Image URL (https://...)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />

              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl h-48 flex items-center justify-center overflow-hidden relative">
                {featuredImageValue ? (
                  <img
                    src={featuredImageValue}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <FaImage className="mx-auto text-3xl mb-2" />
                    <span className="text-xs">Image Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
            <h2 className="text-sm font-bold text-emerald-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <FaTags className="text-emerald-600" /> Tags
            </h2>
            <input
              type="text"
              {...register("tags")}
              placeholder="Wellness, Yoga, Herbs..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
            <p className="text-xs text-gray-400 mt-2">
              Separate tags with commas.
            </p>
          </div>

          {/* SEO Settings */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
            <h2 className="text-sm font-bold text-emerald-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <FaGlobe className="text-emerald-600" /> SEO Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  {...register("seo.metaTitle")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  placeholder="SEO Title"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Meta Description
                </label>
                <textarea
                  {...register("seo.metaDescription")}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none"
                  placeholder="Description for search results..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Keywords
                </label>
                <input
                  type="text"
                  {...register("seo.metaKeywords")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  placeholder="keyword1, keyword2..."
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
