import React from "react";

const SimpleLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-black/90 border border-gray-600 rounded-lg p-6 flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
        <p className="text-white font-medium">{message}</p>
      </div>
    </div>
  );
};

export default SimpleLoader;
