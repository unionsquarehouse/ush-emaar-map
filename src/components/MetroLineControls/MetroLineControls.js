"use client";

import React, { useState, useEffect } from "react";

export default function MetroLineControls() {
  const [visibleLines, setVisibleLines] = useState({
    red: true,
    blue: true,
    green: true,
    extendedBlue: true,
  });

  console.log("MetroLineControls component rendering");

  const toggleLine = (line) => {
    setVisibleLines((prev) => ({
      ...prev,
      [line]: !prev[line],
    }));

    // Update SVG visibility in the emaar-map.svg object
    const svgObject = document.querySelector('object[data="/emaar-map.svg"]');
    if (svgObject && svgObject.contentDocument) {
      const svgDoc = svgObject.contentDocument;
      const className =
        line === "red"
          ? "st4"
          : line === "blue"
          ? "st5"
          : line === "green"
          ? "st6"
          : "st8";
      const svgElements = svgDoc.querySelectorAll(`.${className}`);

      svgElements.forEach((element) => {
        element.style.display = visibleLines[line] ? "none" : "block";
      });
    }
  };

  return (
    <div className="fixed top-20 right-5 z-[99999]">
      <div
        className="bg-white/15 backdrop-blur-2xl border border-white/25 rounded-3xl shadow-2xl overflow-hidden"
        style={{
          minWidth: "180px",
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/20">
          <h3 className="text-sm font-semibold text-gray-800/90 tracking-wide">
            Dubai Metro Lines
          </h3>
        </div>

        {/* Controls */}
        <div className="p-3 space-y-2">
          {/* Red Line */}
          <button
            onClick={() => toggleLine("red")}
            className="group w-full flex items-center justify-start px-3 py-2.5 rounded-2xl transition-all duration-300 hover:bg-gray-800/10"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{
                  backgroundColor: visibleLines.red ? "#ee543f" : "#ffffff60",
                  boxShadow: visibleLines.red
                    ? "0 0 8px rgba(238, 84, 63, 0.4)"
                    : "none",
                }}
              />
              <span className="text-sm font-medium text-gray-800/90">
                Red Line
              </span>
            </div>
          </button>

          {/* Green Line */}
          <button
            onClick={() => toggleLine("green")}
            className="group w-full flex items-center justify-start px-3 py-2.5 rounded-2xl transition-all duration-300 hover:bg-gray-800/10"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{
                  backgroundColor: visibleLines.green ? "#70a760" : "#ffffff60",
                  boxShadow: visibleLines.green
                    ? "0 0 8px rgba(112, 167, 96, 0.4)"
                    : "none",
                }}
              />
              <span className="text-sm font-medium text-gray-800/90">
                Green Line
              </span>
            </div>
          </button>

          {/* Blue Line */}
          <button
            onClick={() => toggleLine("blue")}
            className="group w-full flex items-center justify-start px-3 py-2.5 rounded-2xl transition-all duration-300 hover:bg-gray-800/10"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{
                  backgroundColor: visibleLines.blue ? "#5790af" : "#ffffff60",
                  boxShadow: visibleLines.blue
                    ? "0 0 8px rgba(87, 144, 175, 0.4)"
                    : "none",
                }}
              />
              <span className="text-sm font-medium text-gray-800/90">
                Blue Line
              </span>
            </div>
          </button>

          {/* Extended Blue Line */}
          <button
            onClick={() => toggleLine("extendedBlue")}
            className="group w-full flex items-center justify-start px-3 py-2.5 rounded-2xl transition-all duration-300 hover:bg-gray-800/10"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{
                  backgroundColor: visibleLines.extendedBlue
                    ? "#5790af"
                    : "#ffffff60",
                  boxShadow: visibleLines.extendedBlue
                    ? "0 0 8px rgba(87, 144, 175, 0.4)"
                    : "none",
                }}
              />
              <span className="text-sm font-medium text-gray-800/90">
                Extended Blue Line
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
