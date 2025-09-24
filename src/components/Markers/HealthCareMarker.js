import React from "react";

export default function HealthCareMarker({ location }) {
  return (
    <div className="text-black">
      <div className="flex flex-col items-center">
        <div className="relative group">
          {/* Location Name */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg hidden group-hover:block transition-opacity duration-300">
            {location.name}
          </div>

          {/* Heart Icon */}
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-9 text-red-500 hover:text-red-600 transition-colors duration-300 animate-bounce cursor-pointer"
          >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg> */}

          <div
            className="size-9 cursor-pointer"
            dangerouslySetInnerHTML={{ __html: location?.svgIcon }}
          />

          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 24 24"
            className="size-9 text-red-500 hover:text-red-600  cursor-pointer"
          >
            <defs>
              <style>{".cls-1{fill:#fff}"}</style>
            </defs>
            <path
              d="m11.73 20.63-.02-.01c-.13-.07-.26-.14-.38-.22-1.52-.9-2.94-1.97-4.24-3.17-2.3-2.15-4.74-5.33-4.74-9.26 0-2.93 2.46-5.25 5.44-5.25 1.67 0 3.26.75 4.31 2.05a5.48 5.48 0 0 1 4.31-2.05c2.97 0 5.44 2.32 5.44 5.25 0 3.93-2.44 7.11-4.74 9.26-1.3 1.2-2.72 2.27-4.24 3.17-.13.07-.25.15-.38.22h-.02v.02c-.22.12-.48.12-.7 0Z"
              style={{
                fill: "red",
              }}
            />
            <path d="M11 8.29h2.18v6.86H11z" className="cls-1" />
            <path d="M15.52 10.63v2.18H8.66v-2.18z" className="cls-1" />
          </svg> */}
        </div>
      </div>
    </div>
  );
}
