import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Gallery({ communitySlug, onPropertySelect }) {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
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

  // Get community name from URL slug or prop
  const getCommunityName = (slug) => {
    const communityMap = {
      "grand-polo": "grand-polo",
      "emaar-south": "emaar-south",
      "dubai-hills": "dubai-hills",
      "expo-living": "expo-living",
      "dubai-creek-harbour": "dubai-creek-harbour",
      "rashid-yachts": "rashid-yachts",
      "the-valley": "the-valley",
    };
    return communityMap[slug] || "grand-polo";
  };

  // Get all properties from all communities (same as FloorPlans and Brochure)
  const getAllProperties = () => {
    const allProperties = [
      // Grand Polo properties
      {
        name: "chevalia-estate-2",
        community: "grand-polo",
        displayName: "Chevalia Estate 2",
      },
      { name: "montura-3", community: "grand-polo", displayName: "Montura 3" },
      { name: "selvara", community: "grand-polo", displayName: "Selvara" },
      { name: "selvara-2", community: "grand-polo", displayName: "Selvara 2" },
      { name: "selvara-3", community: "grand-polo", displayName: "Selvara 3" },
      { name: "selvara-4", community: "grand-polo", displayName: "Selvara 4" },

      // Emaar South properties
      // {
      //   name: "golf-acres",
      //   community: "emaar-south",
      //   displayName: "Golf Acres",
      // },
      // { name: "golf-dale", community: "emaar-south", displayName: "Golf Dale" },
      {
        name: "golf-meadow",
        community: "emaar-south",
        displayName: "Golf Meadow",
      },
      {
        name: "golf-point",
        community: "emaar-south",
        displayName: "Golf Point",
      },
      {
        name: "golf-verge",
        community: "emaar-south",
        displayName: "Golf Verge",
      },

      // Dubai Hills properties
      {
        name: "golf-hillside",
        community: "dubai-hills",
        displayName: "Golf Hillside",
      },
      {
        name: "hillsedge",
        community: "dubai-hills",
        displayName: "Hillsedge Tower A",
      },
     
      { name: "parkwood", community: "dubai-hills", displayName: "Parkwood" },
      { name: "rosehill", community: "dubai-hills", displayName: "Rosehill" },
      {
        name: "vida-residences-hillside",
        community: "dubai-hills",
        displayName: "Vida Residences Hillside",
      },

      // Expo Living properties
      {
        name: "terra-heights",
        community: "expo-living",
        displayName: "Terra Heights",
      },

      // Dubai Creek Harbour properties
      {
        name: "albero",
        community: "dubai-creek-harbour",
        displayName: "Albero",
      },
      { name: "altan", community: "dubai-creek-harbour", displayName: "Altan" },
      // {
      //   name: "montiva",
      //   community: "dubai-creek-harbour",
      //   displayName: "Montiva",
      // },
      { name: "silva", community: "dubai-creek-harbour", displayName: "Silva" },

      // Rashid Yachts properties
      {
        name: "baystar-by-vida",
        community: "rashid-yachts",
        displayName: "Baystar By Vida",
      },
      {
        name: "pier-point-2",
        community: "rashid-yachts",
        displayName: "Pier Point 2",
      },
      { name: "sera-2", community: "rashid-yachts", displayName: "Sera 2" },

      // The Valley properties
      { name: "rivera", community: "the-valley", displayName: "Rivera" },
      { name: "vindera", community: "the-valley", displayName: "Vindera" },
    ];

    return allProperties;
  };

  const communityName = getCommunityName(communitySlug || slug);
  const allProperties = getAllProperties();

  // Filter properties by current community
  const communityProperties = allProperties.filter(
    (property) => property.community === communityName
  );

  // Set default selected property from filtered community
  useEffect(() => {
    if (communityProperties.length > 0 && !selectedProperty) {
      setSelectedProperty(communityProperties[0]);
    }
  }, [communityProperties, selectedProperty]);

  // Notify parent component when property changes
  useEffect(() => {
    if (selectedProperty && onPropertySelect) {
      onPropertySelect(selectedProperty);
    }
  }, [selectedProperty, onPropertySelect]);

  // Generate gallery data based on selected property and actual images
  const generateGalleryData = (propertyObj) => {
    // Map property names to their actual image file patterns
    const imageFileMap = {
      // Grand Polo
      "chevalia-estate-2": { prefix: "CHEVALIA_ESTATE_GRAND_POLO_IMAGE", count: 10 },
      "montura-3": { prefix: "MONUTRA_BRANDED_RENDERS", count: 10 },
      selvara: { prefix: "SELVARA_GP_RENDER", count: 12 },
      "selvara-2": { prefix: "SELVARA3_GP_RENDER", count: 10 },
      "selvara-3": { prefix: "SELVARA3_GP_RENDER", count: 10 },
      "selvara-4": { prefix: "SELVARA3_GP_RENDER", count: 10 },

      // Dubai Creek Harbour
      albero: { prefix: "ALBERO_DCH_IMAGE", count: 13 },
      altan: { prefix: "ALTAN_DCH_IMAGE", count: 10 },
      montiva: { prefix: "MONTIVA_DCH_IMAGE", count: 10 },
      silva: { prefix: "SILVA_DCH_IMAGE", count: 10 },

      // Dubai Hills
      "golf-hillside": { prefix: "GOLF-HILLSIDE_DHE_BR", count: 10 },
      hillsedge: { prefix: "HILLSEDGE_DHE_IMAGE", count: 10 },
      parkwood: { prefix: "PARKWOOD_DHE_IMAGE", count: 10 },
      rosehill: { prefix: "ROSEHILL_DHE_IMAGE", count: 11 },
      "vida-residences-hillside": {
        prefix: "VIDA_RH_DHE_IMAGE",
        count: 9,
      },

      // Emaar South
      "golf-acres": { prefix: "GOLF_ACRES_ES", count: 10 },
      "golf-dale": { prefix: "GOLF_DALE_ES", count: 10 },
      "golf-meadow": { prefix: "GOLF_MEDOW_ES_BRANDED_RENDERS", count: 8 },
      "golf-point": { prefix: "BRANDED_RENDERS_GOLFPOINT_ES", count: 10 },
      "golf-verge": { prefix: "GOLF-VERGE_ES_BR", count: 10 },

      // Expo Living
      "terra-heights": { prefix: "TERRAHEIGHTS_XL_RENDER", count: 11 },

      // Rashid Yachts
      "baystar-by-vida": { prefix: "BAYSTAR-BY-VIDA_RYM_BR", count: 10 },
      "pier-point-2": { prefix: "PIERPOINT_RYM_BR", count: 10 },
      "sera-2": { prefix: "SERA2_RYM_BR BR", count: 10 },

      // The Valley
      rivera: { prefix: "RIVERA_THE_VALLEY_IMAGE", count: 10 },
      vindera: { prefix: "VINDERA_TH_BR", count: 10 },
    };

    const imageConfig = imageFileMap[propertyObj.name];

    if (!imageConfig || imageConfig.count === 0) {
      return [
        {
          id: 1,
          name: `${propertyObj.displayName} - No Images Available`,
          url: "/inventory_image.jpg",
          alt: `${propertyObj.displayName} - No Images Available`,
        },
      ];
    }

    const images = [];
    for (let i = 1; i <= imageConfig.count; i++) {
      let fileName;

      // Special handling for Selvara files
      if (imageConfig.prefix === "SELVARA_GP_RENDER") {
        fileName =
          i === 1
            ? `${imageConfig.prefix}.jpg`
            : `${imageConfig.prefix}${i}.jpg`;
      }
      // Special handling for Golf Hillside files
      else if (imageConfig.prefix === "GOLF-HILLSIDE_DHE_BR") {
        fileName =
          i === 1
            ? `${imageConfig.prefix}.jpg`
            : `${imageConfig.prefix}${i}.jpg`;
      } else {
        // Standard naming for other properties
        const imageNumber = i.toString().padStart(2, "0");
        fileName = `${imageConfig.prefix}${imageNumber}.jpg`;
      }

      images.push({
        id: i,
        name: `${propertyObj.displayName} - Image ${i}`,
        url: `/communities/${propertyObj.community}/${propertyObj.name}/IMAGES/${fileName}`,
        alt: `${propertyObj.displayName} - Image ${i}`,
      });
    }

    return images;
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
    if (selectedProperty) {
      const generatedData = generateGalleryData(selectedProperty);
      setBottomButtons(generatedData);
      setSelectedBottomButton(generatedData[0]);
      setCurrentImageUrl(generatedData[0]?.url);
      setCurrentImageIndex(0);
    }
  }, [selectedProperty]);

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
        <div className="absolute bottom-20 right-4 z-50">
          <button
            className="bg-black/80 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-normal cursor-pointer"
            onClick={() => setIsButtonClicked(!isButtonClicked)}
          >
            {selectedProperty?.displayName || "Select Property"}
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
          <div className="absolute bottom-32 right-4 z-50 bg-black/90 rounded-md overflow-hidden shadow-lg w-64 max-h-80 overflow-y-auto">
            {communityProperties.map((property) => (
              <button
                key={`${property.community}-${property.name}`}
                className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer ${
                  selectedProperty?.name === property.name &&
                  selectedProperty?.community === property.community
                    ? "bg-gray-600"
                    : ""
                }`}
                onClick={() => {
                  setSelectedProperty(property);
                  setIsButtonClicked(false);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{property.displayName}</span>
                  <span className="text-xs text-gray-400">
                    {property.community
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
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
