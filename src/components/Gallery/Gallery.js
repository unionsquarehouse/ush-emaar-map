import { FETCH_ALL_PROJECTS } from "@/constants/constants";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import qs from "qs";
import { useParams } from "next/navigation";

export default function Gallery() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [selectedButton, setSelectedButton] = useState("The Oasis");
  const [selectedBottomButton, setSelectedBottomButton] = useState(null);
  const [galleryData, setGalleryData] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const buttonContainerRef = useRef(null);
  const { slug } = useParams();
  const [bottomButtons, setBottomButtons] = useState(null);

  // All 8 properties
  const properties = [
    "The Oasis",
    "Grand Polo",
    "Emaar South",
    "Dubai Hills",
    "Expo Living",
    "Dubai Creek Harbour",
    "Rashid Yachts",
    "The Valley",
  ];
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

  const nextImage = () => {
    if (bottomButtons && bottomButtons.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === bottomButtons.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (bottomButtons && bottomButtons.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? bottomButtons.length - 1 : prevIndex - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
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
        setCurrentImageIndex(0);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      }
    };
    fetchData();
  }, [slug]);

  // Update current image when index changes
  useEffect(() => {
    if (bottomButtons && bottomButtons[currentImageIndex]) {
      const selectedButton = bottomButtons[currentImageIndex];
      setSelectedBottomButton(selectedButton);
      setCurrentImageUrl(selectedButton?.image?.url);
      setIsImageLoaded(false);
    }
  }, [currentImageIndex, bottomButtons]);

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
        <div className="absolute bottom-20 left-4 z-50">
          <button
            className="bg-black/80 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-normal cursor-pointer"
            onClick={() => setIsButtonClicked(!isButtonClicked)}
          >
            {selectedButton}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-4 h-4 transition-transform duration-300 ${
                isButtonClicked ? "rotate-180" : ""
              }`}
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
          <div className="absolute bottom-32 left-4 z-50 bg-black/90 rounded-md overflow-hidden shadow-lg w-48">
            {properties.map((property) => (
              <button
                key={property}
                className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer ${
                  selectedButton === property ? "bg-gray-600" : ""
                }`}
                onClick={() => {
                  setSelectedButton(property);
                  setIsButtonClicked(false);
                  // You can add logic here to load property-specific gallery data
                }}
              >
                {property}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
          <div className="flex items-center justify-center space-x-4">
            {/* Left Arrow */}
            <button
              onClick={prevImage}
              className="p-3 rounded-full transition-all duration-200 bg-black/50 hover:bg-black/70 text-white cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Gallery Thumbnails */}
            <div className="flex space-x-2">
              {bottomButtons?.map((button, index) => (
                <button
                  key={button.id}
                  onClick={() => {
                    setCurrentImageIndex(index);
                  }}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden transition-all duration-200 ${
                    index === currentImageIndex
                      ? "ring-2 ring-white scale-110"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={button?.image?.url || "/inventory_image.jpg"}
                    alt={button?.image?.alternativeText || button.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextImage}
              className="p-3 rounded-full transition-all duration-200 bg-black/50 hover:bg-black/70 text-white cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Image Counter */}
          <div className="text-center mt-2 text-white text-sm">
            {currentImageIndex + 1} of {bottomButtons?.length || 0}
          </div>
        </div>
      </div>
    </>
  );
}
