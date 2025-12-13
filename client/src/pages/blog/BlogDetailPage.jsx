import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";
import {
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaArrowLeft,
  FaShareAlt,
  FaTags,
  FaLeaf,
  FaExclamationCircle,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getBlogPostBySlug, getPostsByCategory } from "../../api/blogApi";
import { toast } from "react-hot-toast"; // Replaced antd message with toast
import "github-markdown-css/github-markdown.css"; // Kept as requested, though Tailwind typography is applied

dayjs.extend(relativeTime);

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRelatedLoading, setIsRelatedLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("Fetching blog post with slug:", slug);
        setIsLoading(true);
        const response = await getBlogPostBySlug(slug);
        console.log("API Response:", response);

        const postData = response?.data?.post || response?.post;

        if (!postData) {
          console.error("No post data in response:", response);
          throw new Error("No post data received");
        }

        setPost(postData);
        console.log("Post state set:", postData);

        if (postData?.categories?.length > 0) {
          console.log(
            "Fetching related posts for category:",
            postData.categories[0]._id
          );
          fetchRelatedPosts(postData.categories[0]._id, postData._id);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(
          "Failed to load blog post. It may have been moved or deleted."
        );
        setIsLoading(false);
      }
    };

    const fetchRelatedPosts = async (categoryId, excludePostId) => {
      try {
        console.log("Fetching related posts for category:", categoryId);
        setIsRelatedLoading(true);
        const response = await getPostsByCategory(categoryId, {
          exclude: excludePostId,
          limit: 3,
        });

        const relatedPosts = response?.data?.posts || response?.posts || [];
        console.log("Related posts response:", { response, relatedPosts });

        setRelatedPosts(Array.isArray(relatedPosts) ? relatedPosts : []);
      } catch (error) {
        console.error("Error fetching related posts:", error);
        setRelatedPosts([]);
      } finally {
        setIsRelatedLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="mb-8 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="mb-12">
        <div className="w-full h-96 bg-gray-200 rounded-2xl"></div>
      </div>
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
        ))}
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <FaExclamationCircle className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
          {error || "Blog post not found"}
        </p>
        <button
          onClick={() => navigate("/blog")}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors font-medium"
        >
          Back to Journal
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return renderLoadingSkeleton();
  }

  if (error) {
    console.error("Error state:", { error, post });
    return renderErrorState();
  }

  if (!post) {
    console.error("No post data available");
    return renderErrorState();
  }

  const {
    title,
    content,
    excerpt,
    featuredImage,
    author,
    createdAt,
    categories,
    tags,
    readingTime,
  } = post;

  // Generate SEO metadata
  const seoTitle = post
    ? `${post.title} | Ayushaushadhi Journal`
    : "Blog Post | Ayushaushadhi";
  const seoDescription = post?.excerpt || "Read this article on Ayushaushadhi";
  const seoKeywords =
    post?.tags?.join(", ") || "ayurveda, wellness, herbal, health";
  const canonicalUrl = post
    ? `https://ayushaushadhi.com/blog/${post.slug}`
    : "https://ayushaushadhi.com/blog";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={canonicalUrl}
        og={{
          title: post?.title || "Ayushaushadhi Journal",
          description: post?.excerpt || "Read this article on Ayushaushadhi",
          type: "article",
          image: post?.imageUrl,
          url: canonicalUrl,
        }}
      />

      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate("/blog")}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              <FaArrowLeft className="mr-2" /> Back to Journal
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors text-sm font-medium"
            >
              <FaShareAlt /> Share
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left: Blog Content (75%) */}
        <section className="lg:col-span-3">
          <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Featured Image */}
            {featuredImage && (
              <div className="w-full h-64 md:h-[28rem] relative overflow-hidden group">
                <img
                  src={featuredImage}
                  alt={title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )}

            {/* Article Header Info */}
            <div className="p-6 md:p-10 border-b border-gray-100 dark:border-gray-700">
              {/* Categories Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories?.map((category) => (
                  <Link
                    key={category._id}
                    to={`/blog?category=${category.slug}`}
                    className="inline-block"
                  >
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-amber-200 transition-colors">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-serif leading-tight">
                {title}
              </h1>

              {/* Meta Data Row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <FaUser size={12} />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {author?.name || "AyushAyushAUSHADHI"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-emerald-500" />
                  <time dateTime={createdAt}>
                    {dayjs(createdAt).format("MMMM D, YYYY")}
                  </time>
                </div>

                <div className="flex items-center gap-2">
                  <FaClock className="text-emerald-500" />
                  <span>{Math.ceil(readingTime || 5)} min read</span>
                </div>
              </div>

              {excerpt && (
                <div className="mt-8 pl-6 border-l-4 border-amber-400">
                  <p className="text-xl text-gray-600 dark:text-gray-300 italic font-serif leading-relaxed">
                    {excerpt}
                  </p>
                </div>
              )}
            </div>

            {/* Article Body Content */}
            <div className="p-6 md:p-10">
              <div className="prose prose-lg prose-emerald dark:prose-invert max-w-none prose-headings:font-serif prose-img:rounded-xl prose-img:shadow-lg">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    img: ({ node, ...props }) => (
                      <img
                        {...props}
                        className="rounded-xl shadow-md my-8 w-full h-auto"
                        alt={props.alt || "Article Image"}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 underline decoration-emerald-300/50 hover:decoration-emerald-600 underline-offset-2 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm text-pink-600 dark:text-pink-400 font-mono">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {/* Footer Tags */}
              {tags?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 flex-wrap">
                    <FaTags className="text-emerald-500 mr-2" />
                    {tags.map((tag, index) => (
                      <Link
                        key={index}
                        to={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="inline-block"
                      >
                        <span className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full text-sm transition-colors cursor-pointer">
                          #{tag}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">
                  Related Articles
                </h3>
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
              </div>

              {isRelatedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-64 animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <article
                      key={relatedPost._id}
                      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
                    >
                      {relatedPost.featuredImage ? (
                        <Link
                          to={`/blog/${relatedPost.slug}`}
                          className="block h-48 overflow-hidden relative"
                        >
                          <img
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                        </Link>
                      ) : (
                        <div className="h-48 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <FaLeaf className="text-4xl text-emerald-300" />
                        </div>
                      )}

                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex gap-2 mb-3">
                          {relatedPost.categories
                            ?.slice(0, 1)
                            .map((category) => (
                              <span
                                key={category._id}
                                className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
                              >
                                {category.name}
                              </span>
                            ))}
                        </div>

                        <h3 className="text-lg font-bold mb-2 font-serif leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          <Link to={`/blog/${relatedPost.slug}`}>
                            {relatedPost.title}
                          </Link>
                        </h3>

                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                          {relatedPost.excerpt}
                        </p>

                        <div className="flex items-center text-xs text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                          <FaClock className="mr-1.5" />
                          <span>
                            {Math.ceil(relatedPost.readingTime || 5)} min read
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </section>

        {/* Right: Sidebar (25%) */}
        <aside className="lg:col-span-1 space-y-8">
          {/* Author Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold mb-4 text-emerald-900 dark:text-white font-serif border-b border-gray-100 dark:border-gray-700 pb-2">
              About the Author
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl font-serif font-bold">
                {author?.name ? author.name.charAt(0) : "A"}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {author?.name || "Ayushaushadhi"}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Wellness Expert
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">
              {author?.bio ||
                "Dedicated to sharing the ancient wisdom of Ayurveda for a modern, balanced lifestyle."}
            </p>
          </div>

          {/* Share Box */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg p-6 text-center text-white">
            <p className="font-medium mb-4 text-emerald-50">
              Found this helpful? Spread the wellness!
            </p>
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-all transform hover:-translate-y-1 shadow-md"
            >
              <FaShareAlt /> Share Article
            </button>
          </div>

          {/* Categories List */}
          {categories?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold mb-4 text-emerald-900 dark:text-white font-serif">
                Topics
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link
                      to={`/blog?category=${category.slug}`}
                      className="flex justify-between items-center group"
                    >
                      <span className="text-gray-600 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-sm font-medium">
                        {category.name}
                      </span>
                      <span className="text-gray-300 group-hover:text-emerald-400">
                        <FaArrowLeft className="rotate-180 text-xs" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags Cloud */}
          {tags?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-50 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold mb-4 text-emerald-900 dark:text-white font-serif">
                Trending Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Link key={index} to={`/blog?tag=${encodeURIComponent(tag)}`}>
                    <span className="px-3 py-1 bg-gray-50 hover:bg-emerald-100 dark:bg-gray-700 dark:hover:bg-emerald-900/30 text-gray-600 dark:text-gray-300 dark:hover:text-emerald-300 rounded-lg text-xs font-medium transition-colors border border-gray-100 dark:border-gray-600">
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
