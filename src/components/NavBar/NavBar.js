import Image from "next/image";
import React, { useContext, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { AppContext } from "@/context/appContext";
import { redirect } from "next/navigation";

export default function NavBar({ isFullScreen, setIsFullScreen }) {
  const { showBackButton, backButtonCallback } = useContext(AppContext);

  const toggleFullSceen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full p-5 flex flex-row justify-between items-start md:items-start lg:items-center">
      <div className="flex flex-row items-start gap-4 ">
        {showBackButton && (
          <div className="group">
            <button
              className="w-fit h-fit cursor-pointer bg-black rounded-full p-2 group-hover:bg-white group-hover:text-black"
              onClick={backButtonCallback}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 md:size-6 text-white group-hover:text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
          </div>
        )}
        <Tooltip id="back-button-tooltip" />
        <Image
          onClick={() => redirect("/")}
          src="/logo.png"
          alt="Union Square House"
          width={120}
          height={40}
          priority
          className="cursor-pointer object-contain"
        />
      </div>

      <div onClick={toggleFullSceen}>
        {/* Toggle FullScreen button with full Screen icon */}
        {!isFullScreen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-8 md:size-12 bg-black text-white rounded-full p-2 cursor-pointer hover:bg-white hover:text-black"
            data-tooltip-id="full-screen-tooltip"
            data-tooltip-content="Toggle Full Screen"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-8 md:size-12 bg-white rounded-full p-2 cursor-pointer hover:bg-black hover:text-white"
            data-tooltip-id="full-screen-tooltip"
            data-tooltip-content="Toggle Full Screen"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
            />
          </svg>
        )}

        <Tooltip id="full-screen-tooltip" />
      </div>
    </div>
  );
}
