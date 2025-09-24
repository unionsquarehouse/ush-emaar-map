import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function LocationMarker({
  location,
  index,
  selectedMarkerIndex,
  setIsHovered,
  showSVG,
  isHovered,
}) {
  const locationMarkerRef = useRef(null);
  useEffect(() => {
    locationMarkerRef?.current?.addEventListener("mouseenter", (e) => {
      // e.target.children[3].classList.toggle("hidden");
      setIsHovered(true);
    });
    locationMarkerRef?.current?.addEventListener("mouseleave", (e) => {
      // e.target.children[3].classList.toggle("hidden");
      setIsHovered(false);
    });

    return () => {
      locationMarkerRef?.current?.removeEventListener("mouseenter", () => {});
      locationMarkerRef?.current?.removeEventListener("mouseleave", () => {});
    };
  }, []);

  return (
    <>
      <div className="relative flex flex-col items-center group">
        {/* Location Name */}
        <div
          className={`absolute -top-12 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg ${
            showSVG && index !== selectedMarkerIndex ? "hidden" : ""
          }`}
        >
          {location.name}
        </div>

        {/* Marker Container */}
        <div
          ref={locationMarkerRef}
          className={`relative ${
            !showSVG ? "hover:scale-110" : ""
          } transition-transform duration-300 cursor-pointer`}
        >
          {/* Marker Pointer */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-black transform rotate-45 shadow-lg"></div>

          {/* White Circle Background with drop shadow */}
          <div className="absolute inset-0 bg-white rounded-full transform scale-110 shadow-lg"></div>

          {/* Image Container */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white">
            <Image
              src={
                location?.image?.formats?.thumbnail?.url || location?.image?.url
              }
              alt={location?.image?.alternativeText}
              fill
              sizes="100px"
              className="object-cover"
            />
          </div>

          {/* SVG Line between selected location and markers */}
          {/* {index === selectedMarkerIndex && (
          <svg
            className="absolute top-0 left-0"
            width={1920}
            height={1080}
            style={{ pointerEvents: "none" }} // Ensures clicks pass through the SVG
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="10"
                markerHeight="10"
                refX="7"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="red" />
              </marker>
            </defs>
            <line
              x1={40}
              y1={70}
              x2={500}
              y2={500}
              stroke="red"
              strokeWidth="3"
              strokeDasharray="5 5"
              markerEnd="url(#arrow)"
            >
              <animate
                attributeName="stroke-dasharray"
                from="100"
                to="0"
                dur="1s"
                repeatCount="1"
              />
            </line>
          </svg>
        )} */}

          {/* <div
            className={`z-50 hidden absolute top-0 left-0 w-full h-full bg-black/20 transition-opacity duration-300 opacity-100`}
            style={{
              pointerEvents: "none",
            }}
          ></div> */}
        </div>
      </div>
    </>
  );
}
