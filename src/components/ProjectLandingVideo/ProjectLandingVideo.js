import React from "react";

export default function ProjectLandingVideo({ handleClick }) {
  return (
    <>
      <video
        id="my-player"
        className="w-[100vw] h-[100vh] object-cover"
        preload="auto"
        autoPlay
        muted
        loop
        src="/hero.mp4"
      ></video>
      <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20"></div>
      <div className="absolute top-0 left-0 w-[100vw] h-[95vh] space-y-5 lg:space-y-5 2xl:space-y-10 flex flex-col pl-10 items-start justify-end lg:pl-10 xl:pl-20 2xl:pl-30">
        <h1 className="text-white text-xl md:text-2xl lg:text-2xl font-bold 2xl:text-3xl ">
          The Oasis VR Tour
        </h1>
        <div className="space-y-5 lg:space-y-5">
          <p className="text-white font-light text-sm md:text-normal 2xl:text-lg w-[90%] text-justify lg:w-[70%]">
            Discover unparalleled luxury living at The Oasis by Emaar, an
            exclusive sanctuary nestled amidst lush greenery and tranquil
            waterways. Our meticulously crafted residences, including mansions
            and villas, are designed by world-renowned architects and adorned
            with interiors by acclaimed designers.
          </p>

          <div
            onClick={handleClick}
            className="flex items-center gap-2 w-fit bg-white text-black px-14 py-1 2xl:px-20 2xl:py-2 font-bold rounded-md cursor-pointer"
          >
            <button className="text-sm md:text-normal">Explore</button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
