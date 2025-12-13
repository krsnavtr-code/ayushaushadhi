import { useEffect, useState } from "react";
import {
  getUploadedImages,
  getImageUrl,
  deleteMediaFile,
} from "../../api/imageApi";
import { toast } from "react-toastify";
import {
  FiCopy,
  FiRefreshCw,
  FiUpload,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";
import {
  FaImage,
  FaVideo,
  FaTimes,
  FaLeaf,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ImageGallery = () => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const response = await getUploadedImages();
      if (response && response.data) {
        // Add type to each media item if not present
        const mediaWithTypes = response.data.map((item) => ({
          ...item,
          type:
            item.type ||
            (item.mimetype?.startsWith("video/") ? "video" : "image"),
        }));
        setMedia(mediaWithTypes);
      } else {
        console.error("Unexpected response format:", response);
        toast.error("Failed to load media");
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("Failed to load media assets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Asset URL copied to clipboard!");
  };

  const handleDelete = async (filename, e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        "Are you sure you want to delete this file? usage in products might break."
      )
    ) {
      return;
    }

    try {
      await deleteMediaFile(filename);
      toast.success("File deleted successfully");
      fetchMedia();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(error.response?.data?.message || "Failed to delete file");
    }
  };

  const filteredMedia = media.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    if (!searchTerm) return matchesTab;
    const searchLower = searchTerm.toLowerCase();
    const itemName = (item.filename || item.name || "").toLowerCase();
    return matchesTab && itemName.includes(searchLower);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Decorative Background */}
      <FaLeaf className="absolute top-0 right-0 text-[15rem] text-emerald-100/50 dark:text-emerald-900/10 transform rotate-45 pointer-events-none" />

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900 dark:text-white font-serif">
              Media Library
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage product images, banners, and videos.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={fetchMedia}
              className="px-4 py-2 bg-white text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50 flex items-center shadow-sm transition-colors"
              disabled={isLoading}
            >
              <FiRefreshCw
                className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <Link
              to="/admin/media"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center shadow-md transition-colors"
            >
              <FiUpload className="mr-2" />
              Upload New
            </Link>
          </div>
        </div>

        {/* Toolbar: Tabs & Search */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-emerald-100 dark:border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {["all", "image", "video"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-white dark:bg-gray-600 text-emerald-700 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-emerald-600"
                  }`}
                >
                  {tab === "all"
                    ? "All Items"
                    : tab.charAt(0).toUpperCase() + tab.slice(1) + "s"}
                  <span className="ml-2 bg-gray-200 dark:bg-gray-500 text-gray-600 dark:text-gray-200 text-xs px-2 py-0.5 rounded-full">
                    {tab === "all"
                      ? media.length
                      : media.filter((m) => m.type === tab).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search filenames..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item._id || item.name}
              className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              {/* Thumbnail Container */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                {item.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/50">
                        <FaVideo className="text-white ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(item.url);
                    }}
                    className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-xs font-bold text-emerald-700 hover:bg-emerald-50 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <FiCopy /> Copy Link
                  </button>
                  <button
                    onClick={(e) => handleDelete(item.name || item.filename, e)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-red-500 rounded-full text-xs font-bold text-white hover:bg-red-600 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>

              {/* Info Footer */}
              <div className="p-3 bg-white dark:bg-gray-800">
                <p
                  className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate"
                  title={item.name}
                >
                  {item.name || "Unnamed"}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {item.mimetype?.split("/")[1] || item.type}
                  </span>
                  {item.type === "image" && (
                    <FaImage className="text-gray-300 text-xs" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && filteredMedia.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FaCloudUploadAlt className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No assets found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-xs mx-auto">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "Upload product images or videos to build your library."}
            </p>
          </div>
        )}

        {/* Preview Modal */}
        {selectedMedia && (
          <div
            className="fixed inset-0 bg-emerald-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
            onClick={() => setSelectedMedia(null)}
          >
            <div
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 bg-gray-900 text-white border-b border-gray-800">
                <h3 className="text-sm font-mono truncate max-w-md">
                  {selectedMedia.name}
                </h3>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 bg-gray-900 flex items-center justify-center overflow-auto p-4">
                {selectedMedia.type === "video" ? (
                  <video
                    src={selectedMedia.url}
                    className="max-w-full max-h-[70vh] rounded-lg"
                    controls
                    autoPlay
                  />
                ) : (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.name}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                  />
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-end gap-3">
                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Open Original
                </a>
                <button
                  onClick={() => {
                    copyToClipboard(selectedMedia.url);
                    setSelectedMedia(null);
                  }}
                  className="px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <FiCopy /> Copy URL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
