import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

export default function ProjectMapInfoCard({
  setShowInfoCard,
  selectedLocation,
  setShowSVG,
}) {
  return (
    <div
      className="fixed w-full h-full flex flex-col justify-end items-center"
      onClick={() => {
        setShowInfoCard(false);
        setShowSVG(false);
      }}
    >
      <motion.div
        className="relative overflow-hidden w-100 h-25 mb-10 md:mb-20 flex flex-row rounded-xl scale-50 md:scale-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="w-[30%]">
          <Image
            src={
              selectedLocation?.image?.formats?.medium?.url ||
              selectedLocation?.image?.url
            }
            alt={selectedLocation?.image?.alternativeText}
            width={100}
            height={100}
            quality={100}
            priority
            style={{
              width: "100%",
              height: "100%",
            }}
            className="object-cover"
          />
        </div>
        <div className="w-[70%] pl-4 bg-black flex flex-col gap-2 justify-center items-start">
          <span className="text-sm md:text-normal text-white font-bold line-clamp-1">
            {selectedLocation?.name}
          </span>
          <div className="flex flex-row justify-start gap-8 items-center">
            <div className="flex flex-row justify-start items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>

              <span className="text-sm text-white text-center font-bold line-clamp-1">
                {selectedLocation?.distanceinKm}
              </span>
            </div>
            <div className="flex flex-row justify-between items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 text-white"
              >
                <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
                <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
                <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
              </svg>{" "}
              <span className="text-sm text-white text-center font-bold line-clamp-1">
                {selectedLocation?.distanceinMin}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
