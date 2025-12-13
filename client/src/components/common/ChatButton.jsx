import React, { useState } from "react";
import { FaCommentDots, FaTimes } from "react-icons/fa";
import ContactFormModal from "./ContactFormModal";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Fixed Container for Button & Tooltip */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center flex-row-reverse gap-4 group">
        {/* Floating Action Button */}
        <button
          onClick={toggleChat}
          className={`p-4 rounded-full shadow-2xl text-white transition-all duration-300 transform hover:scale-110 focus:outline-none flex items-center justify-center border-2 border-white/20 backdrop-blur-sm ${
            isOpen
              ? "bg-gray-700 rotate-90"
              : "bg-gradient-to-tr from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          }`}
          aria-label="Consult with an Expert"
        >
          {isOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <div className="relative">
              <FaCommentDots className="w-6 h-6" />
              {/* Notification Pulse */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </div>
          )}
        </button>

        {/* Hover Tooltip (Appears on Hover) */}
        {!isOpen && (
          <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
            <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl shadow-xl border border-emerald-100 dark:border-gray-700 text-sm font-bold flex items-center gap-2 relative">
              <span className="whitespace-nowrap">Chat with Expert</span>

              {/* Arrow pointing right towards the button */}
              <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white dark:bg-gray-800 transform -translate-y-1/2 rotate-45 border-t border-r border-emerald-100 dark:border-gray-700"></div>
            </div>
          </div>
        )}
      </div>

      {/* The Contact Modal */}
      <ContactFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatButton;
