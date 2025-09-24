import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
export default function ThreeSixtyCard({
  handleThreeSixtyCardClick,
  selectedThreeSixtyMarker,
  disable360Card,
}) {
  return (
    <div
      className="absolute w-full h-full flex flex-col justify-end items-center"
      onClick={disable360Card}
    >
      <motion.div
        className="relative overflow-hidden w-50 h-30 md:mb-10 rounded-xl border-2 border-white cursor-pointer scale-50 md:scale-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        onClick={(e) => {
          e.stopPropagation();
          handleThreeSixtyCardClick();
        }}
      >
        <Image
          src={
            selectedThreeSixtyMarker?.card_image?.formats?.small?.url ||
            selectedThreeSixtyMarker?.card_image?.url
          }
          alt={selectedThreeSixtyMarker?.card_image?.alternativeText}
          fill
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-0 left-0 w-full h-full pb-1 bg-black/40 text-white flex flex-col items-center justify-end">
          <span className="text-sm text-center font-normal line-clamp-1">
            {selectedThreeSixtyMarker?.name}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-full  text-white flex flex-col items-center justify-center">
          <Image
            src="/360-degrees-card.png"
            alt="360° View"
            width={30}
            height={30}
          />
        </div>
      </motion.div>
    </div>
  );
}
