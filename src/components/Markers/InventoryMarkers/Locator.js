import Image from "next/image";
import React from "react";

export default function Locator({
  location,
  handleSubCommunityClick,
  disableClick,
}) {
  return (
    <div
      key={location.id}
      className="absolute w-10 h-10 text-white px-2 py-1 rounded-full  transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{
        top: parseInt(location.y),
        left: parseInt(location.x),
        position: "absolute",
        zIndex: 10,
      }}
      onClick={
        disableClick
          ? undefined
          : () => handleSubCommunityClick(location?.master_plan?.documentId)
      }
    >
      <div className="relative flex flex-col items-center group ">
        {/* Location Name */}
        <div className="absolute top-16 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-2 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg">
          {location?.name}
        </div>

        {/* Marker Container */}
        <div className="relative hover:scale-110 transition-transform duration-300 cursor-pointer">
          {/* Image Container */}
          <div className="relative w-14 h-14  overflow-hidden ">
            <Image
              unoptimized
              src={location?.locator?.url}
              alt={location?.locator?.alternativeText}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
