import React from "react";
import { useRouter } from "next/navigation";
import { getAvailableSidebarOptions } from "@/utils/fileAvailability";

export default function SideBar({
  sideBarButtonClicked,
  handleSideBarButtonClick,
  hideNavigationOptions = false,
  selectedProperty = null,
  communityName = null,
}) {
  const router = useRouter();

  // Get available sidebar options based on selected property
  const availableOptions =
    selectedProperty && communityName
      ? getAvailableSidebarOptions(selectedProperty.name, communityName)
      : [
          { id: 0, name: "Home", alwaysShow: true },
          { id: 1, name: "Map", alwaysShow: true },
          { id: 2, name: "Floor Plans", available: true },
          { id: 3, name: "Gallery", available: true },
          { id: 4, name: "Brochure", available: true },
        ];

  // Don't render sidebar if all navigation options are hidden
  if (hideNavigationOptions) {
    return null;
  }

  // Icon components for each sidebar option
  const getIcon = (optionId) => {
    switch (optionId) {
      case 0: // Home
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 md:size-6 mb-1"
          >
            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>
        );
      case 1: // Map
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 md:size-6 mb-1"
          >
            <path
              fillRule="evenodd"
              d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 2: // Floor Plans
        return (
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
        );
      case 3: // Gallery
        return (
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
        );
      case 4: // Brochure
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 md:size-6 mb-1"
          >
            <path
              fillRule="evenodd"
              d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.84 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5H7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75H7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6ZM6.75 9.75V8.25H8.25v1.5H6.75ZM15.75 9a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5ZM15 6.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM18.75 12a.75.75 0 0 0 0 1.5H21a.75.75 0 0 0 0-1.5h-2.25Zm-.75-3.75a.75.75 0 0 1 .75-.75H21a.75.75 0 0 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75ZM15.75 15a.75.75 0 0 0 0 1.5H21a.75.75 0 0 0 0-1.5h-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* SideBar Controls Start */}
      <div className="fixed md:ml-5 left-0 top-1/2  transform -translate-y-1/2 bg-black text-white rounded-lg shadow-lg scale-75 md:scale-100 z-[9999]">
        <ul className="flex flex-col items-center">
          {availableOptions.map((option, index) => (
            <li
              key={option.id}
              className={`w-full ${
                sideBarButtonClicked === option.id
                  ? "bg-white text-black"
                  : "hover:bg-gray-700"
              } p-3 cursor-pointer ${index === 0 ? "rounded-t-lg" : ""} ${
                index === availableOptions.length - 1 ? "rounded-b-lg" : ""
              }`}
              onClick={() => {
                if (option.id === 0) {
                  router.push("/");
                } else {
                  handleSideBarButtonClick(option.id);
                }
              }}
            >
              <button className="flex flex-col items-center w-full cursor-pointer">
                {getIcon(option.id)}
                <span className="font-normal text-xs md:text-sm">
                  {option.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* SideBar Controls End */}
    </>
  );
}
