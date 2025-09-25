import React from "react";
import { Tooltip } from "react-tooltip";

export default function BackButton({ handleBackClick }) {
  return (
    <div
      className="absolute top-4 left-4 w-fit h-fit  z-10"
      data-tooltip-id="back-button-tooltip"
      data-tooltip-content="Back"
    >
      <button
        onClick={handleBackClick}
        className="w-fit h-fit cursor-pointer bg-black rounded-full p-2 hover:bg-white hover:text-black"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-8 text-white hover:text-black"
        >
          
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </button>
      <Tooltip id="back-button-tooltip" />
    </div>
  );
}
