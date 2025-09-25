import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Gallery() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [selectedSubProperty, setSelectedSubProperty] = useState(null);
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

  // Get sub-properties based on current URL slug
  const getSubProperties = (slug) => {
    const subPropertiesData = {
      "the-oasis": ["Oasis Phase 1", "Oasis Phase 2", "Oasis Phase 3"],
      "grand-polo": ["GP1", "GP2", "GP3"],
      "emaar-south": ["ES1", "ES2", "ES3"],
      "dubai-hills": ["DH1", "DH2", "DH3"],
      "expo-living": ["EL1", "EL2", "EL3"],
      "dubai-creek-harbour": ["DCH1", "DCH2", "DCH3"],
      "rashid-yachts": ["RY1", "RY2", "RY3"],
      "the-valley": ["TV1", "TV2", "TV3"],
    };
    return subPropertiesData[slug] || ["Default 1", "Default 2", "Default 3"];
  };

  const subProperties = getSubProperties(slug);

  // Set default selected sub-property
  useEffect(() => {
    if (subProperties.length > 0 && !selectedSubProperty) {
      setSelectedSubProperty(subProperties[0]);
    }
  }, [subProperties, selectedSubProperty]);

  // Generate dummy gallery data based on selected sub-property
  const generateGalleryData = (subProperty) => {
    const baseImages = [
      {
        id: 1,
        name: "Exterior View",
        url: "/inventory_image.jpg",
        alt: "Exterior View",
      },
      {
        id: 2,
        name: "Interior View",
        url: "/inventory_image.jpg",
        alt: "Interior View",
      },
      {
        id: 3,
        name: "Living Room",
        url: "/inventory_image.jpg",
        alt: "Living Room",
      },
      { id: 4, name: "Kitchen", url: "/inventory_image.jpg", alt: "Kitchen" },
      { id: 5, name: "Bedroom", url: "/inventory_image.jpg", alt: "Bedroom" },
    ];

    return baseImages.map((img) => ({
      ...img,
      name: `${subProperty} - ${img.name}`,
      alt: `${subProperty} - ${img.alt}`,
    }));
  };

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

  // Update gallery data when sub-property changes
  useEffect(() => {
    if (selectedSubProperty) {
      const generatedData = generateGalleryData(selectedSubProperty);
      setBottomButtons(generatedData);
      setSelectedBottomButton(generatedData[0]);
      setCurrentImageUrl(generatedData[0]?.url);
      setCurrentImageIndex(0);
    }
  }, [selectedSubProperty]);

  // Update current image when index changes
  useEffect(() => {
    if (bottomButtons && bottomButtons[currentImageIndex]) {
      const selectedButton = bottomButtons[currentImageIndex];
      setSelectedBottomButton(selectedButton);
      setCurrentImageUrl(selectedButton?.url || selectedButton?.image?.url);
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
                alt={
                  selectedBottomButton?.alt ||
                  selectedBottomButton?.image?.alternativeText ||
                  ""
                }
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
            {selectedSubProperty || "Select Property"}
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
            {subProperties.map((subProperty) => (
              <button
                key={subProperty}
                className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer ${
                  selectedSubProperty === subProperty ? "bg-gray-600" : ""
                }`}
                onClick={() => {
                  setSelectedSubProperty(subProperty);
                  setIsButtonClicked(false);
                }}
              >
                {subProperty}
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
                    src={
                      button?.url ||
                      button?.image?.url ||
                      "/inventory_image.jpg"
                    }
                    alt={
                      button?.alt ||
                      button?.image?.alternativeText ||
                      button.name
                    }
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
