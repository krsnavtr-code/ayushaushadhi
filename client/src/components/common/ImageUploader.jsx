import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaImage,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import api from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";

const ImageUploader = ({
  onUploadSuccess,
  label = "Upload Image Asset",
  className = "",
  maxSizeMB = 5,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // --- File Handling Logic ---
  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    // Validate Type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Invalid format. Accepted: JPG, PNG, WebP, GIF");
      return;
    }

    // Validate Size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error(`File exceeds limit of ${maxSizeMB}MB`);
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

  // --- Drag & Drop Handlers ---
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

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // --- Upload Logic ---
  const handleUpload = async () => {
    if (!file) {
      toast.error("No data stream detected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const response = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      const result = data.data || data;

      if (onUploadSuccess && result) {
        onUploadSuccess({
          url: result.url || result.path,
          path: result.path,
          name: result.name || file.name,
          type: "image",
        });
      }

      removeImage();
      toast.success("Image asset secured in database.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload sequence failed.");
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
            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 scale-[1.02]"
            : "border-gray-300 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-400"
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
              className="relative w-full h-64 bg-black/5 dark:bg-black/40 flex items-center justify-center p-4"
            >
              {/* Scan Line Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(59,130,246,0.1)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
              />

              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="p-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition-colors backdrop-blur-sm shadow-lg"
                  title="Discard Asset"
                >
                  <FaTimes />
                </button>
              </div>

              {/* File Info Overlay */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/10">
                {file?.name} ({(file?.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            </motion.div>
          ) : (
            // --- Idle/Empty State ---
            <motion.label
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-64 cursor-pointer group"
            >
              <div className="w-16 h-16 mb-4 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
                <FaCloudUploadAlt size={32} />
              </div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {dragActive ? "Drop Asset Here" : label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                JPG, PNG, WebP (Max {maxSizeMB}MB)
              </p>

              <input
                ref={inputRef}
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/gif"
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
              <FaImage className="text-blue-500" />
              <span>Ready for ingestion</span>
            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-lg ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-500/30"
              }`}
            >
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Upload Asset
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagram Context: Only show when idle to explain the process */}
      {!file && !isUploading && (
        <div className="mt-4 opacity-50 hover:opacity-100 transition-opacity text-center cursor-help">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
            Architecture
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
