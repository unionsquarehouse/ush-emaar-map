import Image from "next/image";
import React from "react";
import { Tooltip } from "react-tooltip";

export default function ThreeSixtyMarker({
  location,
  handle360MarkerIconClick,
  index,
}) {
  return (
    <>
      <div
        name={index}
        onClick={handle360MarkerIconClick}
        key={location.id}
        className="absolute w-10 h-10 text-white px-2 py-1 rounded-full  transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-all duration-300"
        style={{
          top: parseInt(location.y),
          left: parseInt(location.x),
          position: "absolute",
          zIndex: 30,
        }}
        data-tooltip-id="360-marker-tooltip"
        data-tooltip-content={location.name}
      >
        <Image
          src={location?.image?.url}
          alt={location?.image?.alternativeText}
          fill
          className="object-contain "
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <Tooltip id="360-marker-tooltip" style={{ zIndex: 9999 }} />
    </>
  );
}
