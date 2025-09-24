import Image from "next/image";
import React from "react";

export default function ProjectPage({ projectName, setSideBarButtonClicked }) {
  return (
    <div className="w-full h-screen bg-gray-200 overflow-hidden flex justify-center items-center">
      <div className="relative" style={{ width: "1920px", height: "1080px" }}>
        <Image
          src="/inventory_image.jpg"
          alt={`${projectName} Map`}
          fill
          quality={100}
          priority
          unoptimized
          className="pointer-events-none opacity-100"
        />
      </div>
    </div>
  );
}
