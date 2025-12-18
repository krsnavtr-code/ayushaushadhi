import { useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaFilm,
  FaCheckCircle,
  FaSpinner,
  FaVideo,
} from "react-icons/fa";
import api from "../../utils/api"; // Ensure this is using the same axios instance as ImageUploader
import { motion, AnimatePresence } from "framer-motion";

const VideoUploader = ({
  onUploadSuccess,
  label = "Upload Video Feed",
  className = "",
  maxSizeMB = 100,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // --- File Handling ---
  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    // Validate Type
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Invalid codec. Accepted: MP4, WebM, MOV");
      return;
    }

    // Validate Size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error(`File exceeds bandwidth limit of ${maxSizeMB}MB`);
      return;
    }

    // Create Preview
    const fileUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(fileUrl);
    setFile(selectedFile);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  // --- Drag & Drop ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const removeVideo = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // --- Upload Logic ---
  const handleUpload = async () => {
    if (!file) {
      toast.error("No signal detected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      // NOTE: Using the same API utility as ImageUploader for consistency
      // Ensure your backend route is correct ('/upload/video')
      const response = await api.post("/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        // Optional: Add onUploadProgress here if you want a progress bar
      });

      const data = response.data;
      const result = data.data || data;

      if (onUploadSuccess && result) {
        onUploadSuccess({
          url: result.url || result.path,
          path: result.path,
          name: result.name || file.name,
          type: "video",
        });
      }

      removeVideo();
      toast.success("Video stream archived successfully.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Transmission failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <motion.div
        layout
        className={`relative w-full border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden ${
          dragActive
            ? "border-[#F47C26] bg-orange-50 dark:bg-[#F47C26]/10 scale-[1.02]"
            : "border-gray-300 dark:border-white/10 hover:border-[#F47C26] dark:hover:border-[#F47C26]"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {previewUrl ? (
            // --- Preview State ---
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full aspect-video bg-black flex items-center justify-center"
            >
              <video
                src={previewUrl}
                className="w-full h-full object-contain"
                controls
              />

              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVideo();
                  }}
                  className="p-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition-colors backdrop-blur-sm shadow-lg"
                  title="Cut Feed"
                >
                  <FaTimes />
                </button>
              </div>

              {/* File Info Overlay */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 z-10">
                {file?.name} ({(file?.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            </motion.div>
          ) : (
            // --- Idle State ---
            <motion.label
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              htmlFor="video-upload"
              className="flex flex-col items-center justify-center w-full h-64 cursor-pointer group"
            >
              <div className="w-16 h-16 mb-4 rounded-full bg-orange-50 dark:bg-[#F47C26]/10 flex items-center justify-center text-[#F47C26] group-hover:scale-110 transition-transform duration-300">
                <FaVideo size={32} />
              </div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {dragActive ? "Initialize Stream" : label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                MP4, WebM, MOV (Max {maxSizeMB}MB)
              </p>

              <input
                ref={inputRef}
                id="video-upload"
                type="file"
                className="hidden"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </motion.label>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --- Action Bar --- */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 flex justify-between items-center bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10"
          >
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <FaFilm className="text-[#F47C26]" />
              <span>Ready for transmission</span>
            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-lg ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#F47C26] hover:bg-[#d5671f] hover:-translate-y-0.5 shadow-orange-500/30"
              }`}
            >
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt /> Start Upload
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagram Context: Only show when idle */}
      {!file && !isUploading && (
        <div className="mt-4 opacity-50 hover:opacity-100 transition-opacity text-center cursor-help">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
            Stream Pipeline
          </span>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
