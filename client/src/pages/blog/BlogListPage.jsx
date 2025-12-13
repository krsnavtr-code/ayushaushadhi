import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SEO from "../../components/SEO";
import { getBlogPosts } from "../../api/blogApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  FaCalendarAlt,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaLeaf,
  FaSearch,
  FaBookOpen,
} from "react-icons/fa";

dayjs.extend(relativeTime);

export default function BlogListPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getBlogPosts({
          page,
          limit: pageSize,
          status: "published",
        });
        setPosts(response.data?.posts || []);
        setTotal(response.data?.total || 0);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setPosts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(total / pageSize);

  const renderPostCard = (post) => (
    <div
      key={post._id}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
    >
      {post.featuredImage ? (
        <Link
          to={`/blog/${post.slug}`}
          className="relative h-56 overflow-hidden block"
        >
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
        </Link>
      ) : (
        <div className="h-56 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <FaLeaf className="text-4xl text-emerald-300 dark:text-emerald-700" />
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        {/* Categories */}
        {post.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((category) => (
              <span
                key={category._id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 uppercase tracking-wide"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 space-x-4">
          <span className="flex items-center">
            <FaCalendarAlt className="mr-1.5 text-emerald-500" />
            {dayjs(post.createdAt).format("MMM D, YYYY")}
          </span>
          <span className="flex items-center">
            <FaClock className="mr-1.5 text-emerald-500" />
            {Math.ceil(post.readingTime || 5)} min read
          </span>
        </div>

        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white font-serif leading-tight group-hover:text-emerald-700 transition-colors line-clamp-2">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow text-sm leading-relaxed">
          {post.excerpt ||
            post.content?.substring(0, 150).replace(/<[^>]+>/g, "") + "..."}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <Link
            to={`/blog/${post.slug}`}
            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold text-sm inline-flex items-center group-hover:translate-x-1 transition-transform"
          >
            Read Full Article
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEO
        title="Wellness Journal | Ayushaushadhi Blog"
        description="Explore articles on Ayurveda, holistic health, natural remedies, and lifestyle tips. Expert insights for a balanced life."
        keywords="ayurveda blog, herbal remedies, holistic health, wellness tips, ayurvedic lifestyle, health articles"
        og={{
          title: "Ayushaushadhi Wellness Journal",
          description:
            "Expert articles and tips on living a healthier, balanced life through Ayurveda.",
          type: "website",
        }}
      />

      {/* Hero Section */}
      <div className="bg-emerald-900 py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <FaLeaf className="text-[10rem] text-white absolute -top-10 -left-10 transform -rotate-45" />
          <FaLeaf className="text-[12rem] text-white absolute -bottom-20 -right-20 transform rotate-12" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
            Wellness Journal
          </h1>
          <div className="h-1 w-24 bg-amber-400 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-emerald-100 font-light">
            Ancient wisdom for modern living. Discover tips, recipes, and
            insights.
          </p>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Stats */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">
            Latest Articles
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
            Page {page} of {totalPages || 1}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden h-96 animate-pulse"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 w-full"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(renderPostCard)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm isolate space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="sr-only">Previous</span>
                    <FaChevronLeft className="h-4 w-4 mr-1" /> Prev
                  </button>

                  {/* Simple Page Indicator */}
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-emerald-600">
                    {page}
                  </span>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <FaChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-900/30 mb-4">
              <FaBookOpen className="text-4xl text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No articles found
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Check back later for new wellness tips.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
