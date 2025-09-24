import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MasterPlanInfoCard({
  title,
  subtitle,
  brochureLink,
  learMoreLink,
  image,
  imageAlt,
  setShowMasterPlanInfoCard,
}) {
  return (
    <div
      className="absolute flex flex-row justify-end rounded-lg  w-full h-full"
      onClick={() => setShowMasterPlanInfoCard(false)}
    >
      <motion.div
        className="absolute top-28 right-5 flex flex-row justify-end rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row scale-50 translate-x-[80px] translate-y-[-80px] md:translate-x-0 md:-translate-y-0 md:scale-100 w-[300px] h-[150px]">
          <div className="w-2/5 h-full">
            <Image
              src={image}
              alt={imageAlt}
              width={100}
              height={100}
              quality={100}
              style={{
                width: "100%",
                height: "100%",
              }}
              className="object-cover rounded-l-lg"
            />
          </div>
          <div className="w-3/5 h-full bg-gray-700 rounded-r-lg">
            <div className="flex flex-col pl-4 py-2 gap-2">
              <div className="flex flex-col">
                <span className="text-white text-base font-bold line-clamp-1">
                  {title}
                </span>
                <span className="text-white text-sm font-normal line-clamp-1">
                  {subtitle}
                </span>
              </div>
              <div className="flex flex-col">
                <button
                  disabled={!brochureLink}
                  className="bg-white text-black text-xs  w-[90%] font-normal py-1 px-2 rounded-md mt-2 line-clamp-1"
                >
                  <Link
                    disabled={!brochureLink}
                    href={brochureLink || "#"}
                    target="_blank"
                  >
                    Download Brochure
                  </Link>
                </button>
                <button
                  disabled={!learMoreLink}
                  className="bg-white text-black text-xs font-normal py-1 px-2 w-[90%] rounded-md mt-2 line-clamp-1"
                >
                  <Link
                    disabled={!learMoreLink}
                    href={learMoreLink || "#"}
                    target="_blank"
                  >
                    Learn More
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
