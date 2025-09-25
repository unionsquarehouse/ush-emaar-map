import React from "react";
import { useRouter } from "next/navigation";

export default function SideBar({
  sideBarButtonClicked,
  handleSideBarButtonClick,
  hideNavigationOptions = false,
}) {
  const router = useRouter();
  // Don't render sidebar if all navigation options are hidden
  if (hideNavigationOptions) {
    return null;
  }

  return (
    <>
      {/* SideBar Controls Start */}
      <div className="fixed md:ml-5 left-0 top-1/2  transform -translate-y-1/2 bg-black text-white rounded-lg shadow-lg scale-75 md:scale-100 z-[9999]">
        <ul className="flex flex-col items-center">
          <li
            className={`w-full ${
              sideBarButtonClicked === 0
                ? "bg-white text-black"
                : "hover:bg-gray-700"
            } p-3 cursor-pointer rounded-t-lg`}
            onClick={() => {
              router.push("/");
            }}
          >
            <button className="flex flex-col items-center w-full cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 md:size-6 mb-1"
              >
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>

              <span className="font-normal text-xs md:text-sm">Home</span>
            </button>
          </li>
          <li
            className={`w-full ${
              sideBarButtonClicked === 1
                ? "bg-white text-black"
                : "hover:bg-gray-700"
            } p-3 cursor-pointer`}
            onClick={() => handleSideBarButtonClick(1)}
          >
            <button className="flex flex-col items-center w-full cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 md:size-6 mb-1"
              >
                <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                <path
                  fillRule="evenodd"
                  d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>

              <span className="font-normal text-xs md:text-sm">
                Floor Plans
              </span>
            </button>
          </li>
          <li
            className={`w-full ${
              sideBarButtonClicked === 2
                ? "bg-white text-black"
                : "hover:bg-gray-700"
            } p-3 cursor-pointer rounded-b-lg`}
            onClick={() => handleSideBarButtonClick(2)}
          >
            <button className="flex flex-col items-center w-full cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 md:size-6 mb-1"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                  clipRule="evenodd"
                />
              </svg>

              <span className="font-normal text-xs md:text-sm">Gallery</span>
            </button>
          </li>
        </ul>
      </div>
      {/* SideBar Controls End */}
    </>
  );
}
