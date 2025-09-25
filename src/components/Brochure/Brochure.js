"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Brochure({
  setSideBarButtonClicked,
  communitySlug,
  onPropertySelect,
}) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [brochureFiles, setBrochureFiles] = useState([]);

  const { slug } = useParams();

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

  const communityName = getCommunityName(communitySlug || slug);

  // Get all properties from all communities (same as FloorPlans)
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
      {
        name: "golf-acres",
        community: "emaar-south",
        displayName: "Golf Acres",
      },
      { name: "golf-dale", community: "emaar-south", displayName: "Golf Dale" },
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
        displayName: "Hillsedge",
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
      {
        name: "montiva",
        community: "dubai-creek-harbour",
        displayName: "Montiva",
      },
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

  // Get brochure files for a property
  const getBrochureFiles = async (community, property) => {
    try {
      // Map property names to their actual brochure file names
      const brochureFileMap = {
        // Grand Polo
        "chevalia-estate-2": "CHEVALIA.pdf",
        "montura-3": "MONTURA BROCHURE.pdf",
        selvara: "SELVARA_GP_BROCHURE.pdf",
        "selvara-2": "SELVARA_GP_BROCHURE.pdf",
        "selvara-3": "SELVARA3_GP_BROCHURE.pdf",
        "selvara-4": "SELVARA4_GP_BROCHURE.pdf",

        // Dubai Creek Harbour
        albero: "ALBERO_DCH_BROCHURE.pdf",
        altan: "ALTAN_DCH_BROCHURE.pdf",
        montiva: "MONTIVA_BY_VIDA_DCH_BROCHURE.pdf",
        silva: "SILVA_DCH_BROCHURE.pdf",

        // Dubai Hills
        "golf-hillside": "GOLF_HILLSIDE_BROCHURE-FINAL.pdf",
        hillsedge: "HILLSEDGE_DHE_BROCHURE.pdf",
        parkwood: "PARKWOOD_DHE_BROCHURE.pdf",
        rosehill: "ROSEHILL_DHE_BROCHURE.pdf",
        "vida-residences-hillside": "VIDA_HILLSIDE_DHE_BROCHURE.pdf",

        // Emaar South
        "golf-acres": "GOLF_ACRES_ES_BROCHURE.pdf",
        "golf-dale": "GOLF_DALE_BROCHURE.pdf",
        "golf-meadow": "GOLF_MEADOW_ES_BROCHURE.pdf",
        "golf-point": "GOLF_POINT_ES_BROCHURE.pdf",
        "golf-verge": "GOLF-VERGE_ES_BROCHURE.pdf",

        // Expo Living
        "terra-heights": "TERRA_HEIGHTS_XL_BROCHURE.pdf",

        // Rashid Yachts
        "baystar-by-vida": "BAYSTAR.pdf",
        "pier-point-2": "PIER_POINT_RYM_BROCHURE.pdf",
        "sera-2": "SERA2_RYM_BROCHURE.pdf",

        // The Valley
        rivera: "RIVERA_TV_ONE_PAGER.pdf",
        vindera: "VINDERA_TV_BROCHURE.pdf",
      };

      const fileName = brochureFileMap[property];

      if (!fileName) {
        return [
          {
            id: 1,
            name: `${property.toUpperCase()}_BROCHURE.pdf`,
            url: `/communities/${community}/${property}/BROCHURE/${property.toUpperCase()}_BROCHURE.pdf`,
            size: "2.5 MB",
          },
        ];
      }

      return [
        {
          id: 1,
          name: fileName,
          url: `/communities/${community}/${property}/BROCHURE/${fileName}`,
          size: "2.5 MB",
        },
      ];
    } catch (error) {
      console.error("Error fetching brochure files:", error);
      return [];
    }
  };

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

  // Load brochure files when property changes
  useEffect(() => {
    if (selectedProperty) {
      const loadBrochures = async () => {
        const files = await getBrochureFiles(
          selectedProperty.community,
          selectedProperty.name
        );
        setBrochureFiles(files);
      };
      loadBrochures();
    }
  }, [selectedProperty]);

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
      {/* Property Dropdown */}
      <div className="absolute bottom-4 right-4 z-50 dropdown-container">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          className="bg-black/80 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-normal cursor-pointer"
        >
          {selectedProperty?.displayName || "Select Property"}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute bottom-16 right-4 z-50 bg-black/90 rounded-md overflow-hidden shadow-lg dropdown-container w-64 max-h-80 overflow-y-auto">
          {communityProperties.map((property) => (
            <button
              key={`${property.community}-${property.name}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedProperty(property);
                setIsDropdownOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer ${
                selectedProperty?.name === property.name &&
                selectedProperty?.community === property.community
                  ? "bg-gray-600"
                  : ""
              }`}
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

      {/* Brochure Viewer */}
      <div className="absolute inset-0 w-full h-full">
        {brochureFiles.length > 0 ? (
          <iframe
            src={`${brochureFiles[0]?.url}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0`}
            className="w-full h-full border-0"
            title={`${selectedProperty?.displayName} Brochure PDF`}
            style={{ width: "100vw", height: "100vh" }}
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-white flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h4 className="text-lg font-medium text-gray-600 mb-2">
                No Brochures Available
              </h4>
              <p className="text-sm text-gray-500">
                Please select a property to view brochures
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Mouse Scroll Indicator */}
      {brochureFiles.length > 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex flex-col items-center">
            {/* Mouse Icon with Enhanced Visibility */}
            <div className="relative">
              {/* Mouse Icon with Strong Contrast */}
              <div className="w-8 h-12 border-2 border-gray-400 rounded-full flex justify-center bg-white/90 backdrop-blur-sm shadow-2xl shadow-black/50">
                <div className="w-2 h-3 bg-gray-600 rounded-full mt-3 animate-pulse shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
