import React from "react";

export default function ShoppingMarker({ location }) {
  return (
    <div className="text-black">
      <div className="flex flex-col items-center">
        <div className="relative group">
          {/* Location Name */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg  hidden group-hover:block transition-opacity duration-300">
            {location.name}
          </div>

          <div
            className="size-8 text-[#1E429F] hover:text-[#1E429F] transition-colors duration-300 cursor-pointer"
            dangerouslySetInnerHTML={{ __html: location?.svgIcon }}
          />

          {/* Shopping Icon */}
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-pink-500 hover:text-pink-600 transition-colors duration-300 cursor-pointer"
          >
            <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
          </svg> */}
        </div>
      </div>
    </div>
  );
}
