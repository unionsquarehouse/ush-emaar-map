import { FETCH_ALL_PROJECTS } from "@/constants/constants";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import qs from "qs";
import { useParams } from "next/navigation";

export default function Gallery() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedBottomButton, setSelectedBottomButton] = useState(null);
  const [galleryData, setGalleryData] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const buttonContainerRef = useRef(null);
  const { slug } = useParams();
  const [bottomButtons, setBottomButtons] = useState(null);
  // Check if scroll buttons should be visible
  const checkScroll = () => {
    if (buttonContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        buttonContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Scroll handlers
  const scrollLeft = () => {
    if (buttonContainerRef.current) {
      const buttonWidth =
        buttonContainerRef.current.children[0].offsetWidth + 8; // width + gap
      buttonContainerRef.current.scrollBy({
        left: -buttonWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (buttonContainerRef.current) {
      const buttonWidth =
        buttonContainerRef.current.children[0].offsetWidth + 8; // width + gap
      buttonContainerRef.current.scrollBy({
        left: buttonWidth,
        behavior: "smooth",
      });
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  // Add useEffect to check scroll on mount and button changes
  useEffect(() => {
    checkScroll();
    buttonContainerRef.current?.addEventListener("scroll", checkScroll);
    return () =>
      buttonContainerRef.current?.removeEventListener("scroll", checkScroll);
  }, [bottomButtons]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = qs.stringify({
          populate: [
            "gallery",
            "gallery.bottom_buttons",
            "gallery.bottom_buttons.image",
          ],
          filters: {
            project_slug: slug,
          },
          fields: ["id"],
        });
        const data = await fetch(`${FETCH_ALL_PROJECTS}?${query}`);
        const project = await data.json();
        const initialButton = project.data[0].gallery[0].bottom_buttons[0];

        setGalleryData(project.data[0]);
        setSelectedButton(project.data[0].gallery[0].name);
        setBottomButtons(project.data[0].gallery[0].bottom_buttons);
        setSelectedBottomButton(initialButton);
        setCurrentImageUrl(initialButton?.image?.url);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
      <div className="w-[100vw] h-[100vh] relative">
        {/*Current Bottom Button Selected Image */}
        <div className="w-full h-full absolute top-0 left-0">
          {currentImageUrl ? (
            <div className="relative w-full h-full bg-gray-800 lg:bg-white">
              <Image
                onLoad={handleImageLoad}
                src={currentImageUrl}
                alt={selectedBottomButton?.image?.alternativeText || ""}
                fill
                priority
                unoptimized
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className={`object-contain lg:object-fill transition-opacity duration-300 ${
                  isImageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* DropDown Button */}
        <div className="w-fit absolute bottom-10 left-0 md:ml-5 ">
          <button
            className="bg-black font-normal text-sm text-white px-4 py-2 rounded-md flex flex-row items-center gap-2 cursor-pointer scale-50 md:scale-100 -translate-x-5 md:-translate-x-0"
            onClick={() => setIsButtonClicked(!isButtonClicked)}
          >
            {selectedButton}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`size-6 ${
                isButtonClicked ? "rotate-180" : ""
              } transition-all duration-300`}
            >
              <path
                fillRule="evenodd"
                d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* DropDown Menu */}
        {isButtonClicked && (
          <div className="w-fit absolute bottom-4 md:bottom-20 left-0 md:ml-5 mb-2 flex flex-col items-start bg-black rounded-md scale-50 md:scale-100 -translate-x-4 md:-translate-x-0 z-[10000]">
            {galleryData?.gallery?.map((item) => (
              <span
                key={item.id}
                className="w-full text-white px-4 py-2 hover:bg-gray-500  transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedButton(item.name);
                  setIsButtonClicked(false);
                  setBottomButtons(item.bottom_buttons);
                  setSelectedBottomButton(item.bottom_buttons[0]);
                }}
              >
                {item.name}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Buttons swipeable */}
        <div className="w-[100%] md:w-[50%] lg:w-fit mx-auto absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 scale-50 md:scale-100 ">
          {/* Left Arrow - visible if more than 5 buttons */}
          {bottomButtons?.length > 5 && (
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`z-10 p-2 rounded-full shadow-lg transition-colors ${
                canScrollLeft
                  ? "bg-black text-white hover:bg-white hover:text-black cursor-pointer"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          <div
            ref={buttonContainerRef}
            className="flex flex-row gap-2 overflow-hidden scroll-smooth"
            style={{
              width: "fit-content",
              maxWidth: "calc((120px * 5) + (0.5rem * 4))", // Width for 5 buttons + 4 gaps
            }}
          >
            {bottomButtons?.map((button) => (
              <button
                key={button.id}
                className={`flex-shrink-0 w-fit px-4 py-2 font-normal text-sm rounded-full cursor-pointer ${
                  selectedBottomButton.name === button.name
                    ? "bg-white text-black shadow-md"
                    : "bg-black text-white"
                }`}
                onClick={() => {
                  setSelectedBottomButton(button);
                  setCurrentImageUrl(button?.image?.url);
                  setIsImageLoaded(false);
                }}
              >
                {button.name}
              </button>
            ))}
          </div>

          {/* Right Arrow - visible if more than 5 buttons */}
          {bottomButtons?.length > 5 && (
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`z-10 p-2 rounded-full shadow-lg transition-colors ${
                canScrollRight
                  ? "bg-black text-white hover:bg-white hover:text-black cursor-pointer"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
