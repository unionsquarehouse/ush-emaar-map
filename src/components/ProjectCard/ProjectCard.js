import React from "react";
import Image from "next/image";
import { useMatchMedia } from "@/hooks/useMatchMedia";

const ProjectCard = ({ image, title, slug }) => {
  const isTouchScreen = useMatchMedia("(pointer: coarse)"); // coarse is for touch screens

  return (
    <div className="group relative w-full  overflow-hidden rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-2">
      {/* Image Container with Zoom Effect */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-30 transition-opacity duration-300 group-hover:opacity-60"></div>
        {/* Overlay with Button */}
        <div
          className={`absolute inset-0 flex items-center justify-center  ${
            isTouchScreen
              ? "opacity-100 bg-black/20"
              : "opacity-0 bg-black/50 transition-opacity duration-300 group-hover:opacity-100"
          }`}
        >
          <button
            onClick={() => {
              window.location.href = `${slug}`;
            }}
            className="rounded-lg bg-white px-6 py-2 font-semibold text-black transition-transform duration-300 hover:bg-opacity-90 cursor-pointer"
          >
            Explore Project
          </button>
        </div>
      </div>
      {/* Title */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
        <h3 className="text-xl md:text-2xl font-semibold text-white">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default ProjectCard;
