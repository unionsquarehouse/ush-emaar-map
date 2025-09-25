"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function FloorPlans({ setSideBarButtonClicked }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState("The Oasis");

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

  // Property-specific floor plan data
  const getFloorPlansForProperty = (property) => {
    const floorPlanData = {
      "The Oasis": [
        {
          id: 1,
          src: "/inventory_image.jpg",
          alt: "Oasis 2BR Villa",
          title: "2 Bedroom Villa",
          description: "Spacious 2 bedroom villa with modern amenities",
        },
        {
          id: 2,
          src: "/inventory_image.jpg",
          alt: "Oasis 3BR Villa",
          title: "3 Bedroom Villa",
          description: "Luxurious 3 bedroom villa with garden view",
        },
        {
          id: 3,
          src: "/inventory_image.jpg",
          alt: "Oasis 4BR Villa",
          title: "4 Bedroom Villa",
          description: "Premium 4 bedroom villa with private pool",
        },
        {
          id: 4,
          src: "/inventory_image.jpg",
          alt: "Oasis Penthouse",
          title: "Penthouse",
          description: "Exclusive penthouse with panoramic views",
        },
      ],
      "Grand Polo": [
        {
          id: 1,
          src: "/inventory_image.jpg",
          alt: "Grand Polo 2BR",
          title: "2 Bedroom Apartment",
          description: "Modern 2 bedroom apartment with city views",
        },
        {
          id: 2,
          src: "/inventory_image.jpg",
          alt: "Grand Polo 3BR",
          title: "3 Bedroom Apartment",
          description: "Spacious 3 bedroom apartment with balcony",
        },
        {
          id: 3,
          src: "/inventory_image.jpg",
          alt: "Grand Polo 4BR",
          title: "4 Bedroom Apartment",
          description: "Luxury 4 bedroom apartment with premium finishes",
        },
      ],
      "Emaar South": [
        {
          id: 1,
          src: "/inventory_image.jpg",
          alt: "Emaar South Villa",
          title: "3 Bedroom Villa",
          description: "Contemporary villa with private garden",
        },
        {
          id: 2,
          src: "/inventory_image.jpg",
          alt: "Emaar South Townhouse",
          title: "4 Bedroom Townhouse",
          description: "Modern townhouse with rooftop terrace",
        },
      ],
      "Dubai Hills": [
        {
          id: 1,
          src: "/inventory_image.jpg",
          alt: "Dubai Hills Villa",
          title: "3 Bedroom Villa",
          description: "Golf course villa with stunning views",
        },
        {
          id: 2,
          src: "/inventory_image.jpg",
          alt: "Dubai Hills Apartment",
          title: "2 Bedroom Apartment",
          description: "Modern apartment with golf course access",
        },
      ],
      "Expo Living": [
        {
          id: 1,
          src: "/inventory_image.jpg",
          alt: "Expo Living Studio",
          title: "Studio Apartment",
          description: "Compact studio with modern amenities",
        },
        {
          id: 2,
          src: "/inventory_image.jpg",
          alt: "Expo Living 1BR",
          title: "1 Bedroom Apartment",
          description: "Comfortable 1 bedroom with city views",
        },
        {
          id: 3,
          src: "/inventory_image.jpg",
          alt: "Expo Living 2BR",
          title: "2 Bedroom Apartment",
          description: "Spacious 2 bedroom with premium finishes",
        },
      ],
      "Dubai Creek Harbour": [
        {
          id: 1,
          src: "/inventory_image.jpg",
          alt: "Creek Harbour Villa",
          title: "4 Bedroom Villa",
          description: "Waterfront villa with marina views",
        },
        {
          id: 2,
          src: "/inventory_image.jpg",
          alt: "Creek Harbour Apartment",
          title: "3 Bedroom Apartment",
          description: "Luxury apartment with harbor views",
        },
      ],
      "Rashid Yachts": [
        {
          id: 1,
          src: "/inventory_image.jpg",
          alt: "Rashid Yachts Villa",
          title: "5 Bedroom Villa",
          description: "Exclusive waterfront villa with yacht access",
        },
        {
          id: 2,
          src: "/inventory_image.jpg",
          alt: "Rashid Yachts Penthouse",
          title: "Penthouse",
          description: "Ultra-luxury penthouse with panoramic sea views",
        },
      ],
      "The Valley": [
        {
          id: 1,
          src: "/inventory_image.jpg",
          alt: "The Valley Villa",
          title: "3 Bedroom Villa",
          description: "Modern villa in serene valley setting",
        },
        {
          id: 2,
          src: "/inventory_image.jpg",
          alt: "The Valley Townhouse",
          title: "4 Bedroom Townhouse",
          description: "Contemporary townhouse with mountain views",
        },
      ],
    };
    return floorPlanData[property] || floorPlanData["The Oasis"];
  };

  const floorPlanImages = getFloorPlansForProperty(selectedProperty);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === floorPlanImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? floorPlanImages.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0); // Reset to first image when property changes
    setIsDropdownOpen(false);
  };

  // Touch/swipe functionality
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="w-full h-screen bg-gray-900 relative">
      {/* Main Gallery */}
      <div className="absolute inset-0 w-full h-full">
        {/* Image Container */}
        <div
          className="absolute inset-0 w-full h-full"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={floorPlanImages[currentImageIndex].src}
            alt={floorPlanImages[currentImageIndex].alt}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Property Dropdown */}
      <div className="absolute bottom-20 left-4 z-50 dropdown-container">
        <button
          className="bg-black/80 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-normal cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          {selectedProperty}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-4 h-4 transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
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

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute bottom-32 left-4 z-50 bg-black/90 rounded-md overflow-hidden shadow-lg dropdown-container w-48">
          {properties.map((property) => (
            <button
              key={property}
              className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer ${
                selectedProperty === property ? "bg-gray-600" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePropertySelect(property);
              }}
            >
              {property}
            </button>
          ))}
        </div>
      )}

      {/* Thumbnail Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Left Arrow */}
          <button
            onClick={prevImage}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
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

          {/* Thumbnails */}
          <div className="flex space-x-2">
            {floorPlanImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden transition-all duration-200 ${
                  index === currentImageIndex
                    ? "ring-2 ring-white scale-110"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextImage}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
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
          {currentImageIndex + 1} of {floorPlanImages.length}
        </div>
      </div>
    </div>
  );
}
