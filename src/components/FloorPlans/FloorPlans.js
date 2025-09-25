"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getActualCloudinaryUrl, ensureClientSideDataLoaded } from "../../utils/cloudinary-mapping";

export default function FloorPlans({
  setSideBarButtonClicked,
  communitySlug,
  onPropertySelect,
}) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

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

  // Get all properties from all communities
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

  // Generate floor plan tabs based on selected property and actual files
  const generateFloorPlanTabs = (propertyObj) => {
    // Map property names to their actual floor plan files
    const floorPlanFileMap = {
      // Grand Polo
      "chevalia-estate-2": [
        {
          title: "Chevalia Estate 2",
          file: "CHEVALIA-ESTATE2_GP_FLOORPLANS.pdf",
        },
      ],
      "montura-3": [{ title: "Montura 3", file: "FLOOR_PLANS_MONTURA3_GP.pdf" }],
      selvara: [{ title: "Selvara", file: "SELVARA_GP_FLOORPLAN.pdf" }],
      "selvara-2": [{ title: "Selvara 2", file: "SELVARA_2_GP_FLOORPLAN.pdf" }],
      "selvara-3": [{ title: "Selvara 3", file: "SELVARA3_GP_FLOORPLAN.pdf" }],
      "selvara-4": [{ title: "Selvara 4", file: "SELVARA3_GP_FLOORPLAN.pdf" }],

      // Dubai Creek Harbour
      albero: [{ title: "Albero", file: "ALBERO_DCH_FLOORPLANS.pdf" }],
      altan: [{ title: "Altan", file: "ALTAN_DCH_FLOORPLANS.pdf" }],
      montiva: [{ title: "Montiva", file: "MONTIVA_DCH_FLOORPLANS.pdf" }],
      silva: [{ title: "Silva", file: "SILVA_DCH_FLOORPLANS.pdf" }],

      // Dubai Hills
      "golf-hillside": [
        { title: "Golf Hillside", file: "GHS_DHE_FLOORPLANS.pdf" },
      ],
      hillsedge: [
        { title: "Tower A", file: "HILLSEDGE_DHE_FLOORPLAN-TOWER A.pdf" },
      ],
      
      parkwood: [{ title: "Parkwood", file: "PARKWOOD_DHE_FLOORPLANS.pdf" }],
      rosehill: [
        { title: "Block A", file: "ROSEHILL_DHE_BLOCK_A_FLOOR_PLAN.pdf" },
        { title: "Block B", file: "ROSEHILL_DHE_BLOCK_B_FLOOR_PLAN.pdf" },
        { title: "Block C", file: "ROSEHILL_DHE_BLOCK_C_FLOOR_PLAN.pdf" },
      ],
      "vida-residences-hillside": [
        {
          title: "Vida Residences",
          file: "VIDA_RESIDENCES_HILLSIDE_DHE_FLOORPLAN.pdf",
        },
      ],

      // Emaar South
      "golf-acres": [
        { title: "Golf Acres", file: "GOLF_ACRES_FLOOR_PLANS.pdf" },
      ],
      "golf-dale": [
        { title: "Golf Dale", file: "GOLF_DALE_ES_FLOOR_PLANS.pdf" },
      ],
      "golf-meadow": [
        { title: "Golf Meadow", file: "GOLF_MEADOW_FLOOR_PLANS.pdf" },
      ],
      "golf-point": [
        { title: "Tower 1", file: "ES_GOLFPOINT_TOWER1_FLOORPLANS.pdf" },
        { title: "Tower 2", file: "GOLFPOINT_ES_FLOOR_PLANS_TOWER_2.pdf" },
      ],
      "golf-verge": [
        { title: "Building A", file: "GOLF-VERGE_BLDG-A_FLOORPLANS.pdf" },
        { title: "Building B", file: "GOLF-VERGE_BLDG-B_FLOORPLANS.pdf" },
        { title: "Building C", file: "GOLF-VERGE_BLDG-C_FLOORPLANS.pdf" },
      ],

      // Expo Living
      "terra-heights": [
        {
          title: "Building 1",
          file: "TERRAHEIGHTS_XL_FLOORPLAN_T01.pdf",
        },
        {
          title: "Building 2",
          file: "TERRAHEIGHTS_XL_FLOORPLAN_T02.pdf",
        },
        {
          title: "Building 3",
          file: "TERRAHEIGHTS_XL_FLOORPLAN_03.pdf",
        },
        {
          title: "Building 4",
          file: "TERRAHEIGHTS_XL_FLOORPLAN_T04.pdf",
        },
      ],

      // Rashid Yachts
      "baystar-by-vida": [
        { title: "Type 1", file: "BAYSTAR-BY-VIDA_T1_RYM_FLOORPLANS.pdf" },
        { title: "Type 2", file: "BAYSTAR-BY-VIDA_T2_RYM_FLOORPLANS.pdf" },
      ],
      "pier-point-2": [
        { title: "Pier Point 1", file: "PIERPOINT1_FLOOR_PLAN_RYM.pdf" },
        { title: "Pier Point 2", file: "PIERPOINT2_FLOOR_PLAN_RYM.pdf" },
        { title: "Townhouse", file: "PIERPOINT2_FLOOR_PLAN_TOWNHOUSE_RYM.pdf" },
      ],
      "sera-2": [
        { title: "Type A", file: "SERA2_RYM_FLOORPLANS-A.pdf" },
        { title: "Type B", file: "SERA2_RYM_FLOORPLANS_B.pdf" },
        { title: "Townhouse", file: "SERA2_RYM_FLOORPLANS-TOWNHOUSE.pdf" },
      ],

      // The Valley
      rivera: [{ title: "Rivera", file: "RIVERA_TV_FLOOR_PLANS.pdf" }],
      vindera: [{ title: "Vindera", file: "VINDERA_TH_FLOORPLANS.pdf" }],
    };

    const floorPlans = floorPlanFileMap[propertyObj.name];

    if (!floorPlans) {
      const localPath = `/communities/${propertyObj.community}/${propertyObj.name}/FLOORPLANS/${propertyObj.name.toUpperCase()}_FLOORPLANS.pdf`;
      const cloudinaryUrl = getActualCloudinaryUrl(localPath);
      
      // Only return floor plan if it exists in Cloudinary
      if (cloudinaryUrl) {
        return [
          {
            id: 1,
            title: `${propertyObj.displayName} - Floor Plans`,
            description: `${propertyObj.displayName} - Floor Plans`,
            pdfUrl: cloudinaryUrl,
          },
        ];
      }
      
      // Return empty array if floor plan not found in Cloudinary
      return [];
    }

    // Generate tabs for each floor plan, only including those that exist in Cloudinary
    const availableFloorPlans = [];
    floorPlans.forEach((plan, index) => {
      const localPath = `/communities/${propertyObj.community}/${propertyObj.name}/FLOORPLANS/${plan.file}`;
      const cloudinaryUrl = getActualCloudinaryUrl(localPath);
      
      if (cloudinaryUrl) {
        availableFloorPlans.push({
          id: availableFloorPlans.length + 1,
          title: plan.title,
          description: `${propertyObj.displayName} - ${plan.title}`,
          pdfUrl: cloudinaryUrl,
        });
      }
    });
    
    return availableFloorPlans;
  };

  const [floorPlanTabs, setFloorPlanTabs] = useState([]);

  // Update floor plan tabs when property changes
  useEffect(() => {
    if (selectedProperty) {
      const loadFloorPlans = async () => {
        // Ensure client-side data is loaded
        await ensureClientSideDataLoaded();
        const generatedTabs = generateFloorPlanTabs(selectedProperty);
        setFloorPlanTabs(generatedTabs);
        setSelectedTab(0); // Reset to first tab
      };
      loadFloorPlans();
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
    <div className="w-screen h-screen bg-gray-900 relative fixed inset-0">
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

      {/* Floor Plan Viewer */}
      <div className="absolute inset-0 w-screen h-screen">
        {floorPlanTabs.length > 0 && floorPlanTabs[selectedTab] ? (
          <div className="w-screen h-screen">
            <div className="w-screen h-screen overflow-auto bg-white">
              {floorPlanTabs[selectedTab].pdfUrl.includes('/raw/upload/') ? (
                // Display as PDF if it's a raw upload
                <iframe
                  src={`${floorPlanTabs[selectedTab].pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0`}
                  className="w-full h-screen border-0"
                  title={`${floorPlanTabs[selectedTab].title} Floor Plan PDF`}
                  style={{ 
                    width: "100%", 
                    height: "100vh",
                    border: "none"
                  }}
                  allowFullScreen
                />
              ) : (
                // Display as image if it's a converted upload
                <img
                  src={floorPlanTabs[selectedTab].pdfUrl}
                  alt={`${floorPlanTabs[selectedTab].title} Floor Plan`}
                  className="w-full h-auto"
                  style={{ 
                    width: "100%", 
                    height: "auto",
                    minHeight: "100vh",
                    objectFit: "contain"
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-white">
            <div className="text-center">
              <p className="text-lg mb-2">No floor plans available</p>
              <p className="text-sm text-gray-300">
                {floorPlanTabs.length === 0 ? 'No floor plans found for this property' : 'Loading floor plans...'}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Selected property: {selectedProperty?.name || 'None'} | 
                Tabs: {floorPlanTabs.length} | 
                Selected tab: {selectedTab}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floor Plan Tabs - Bottom Left */}
      {floorPlanTabs.length > 1 && (
        <div className="absolute bottom-4 left-4 z-[60]">
          <div className="flex space-x-2">
            {floorPlanTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => {
                  console.log("Tab clicked:", tab.title, "Index:", index);
                  setSelectedTab(index);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-md border shadow-lg ${
                  selectedTab === index
                    ? "bg-white/30 text-white border-white/50 shadow-xl"
                    : "bg-white/20 text-white/90 border-white/30 hover:bg-white/25 hover:text-white"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Mouse Scroll Indicator */}
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
    </div>
  );
}
