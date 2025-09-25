// Utility function to check if a property has specific file types
export const checkFileAvailability = (propertyName, communityName) => {
  // Map property names to their file availability
  const fileAvailabilityMap = {
    // Grand Polo
    "chevalia-estate-2": { floorPlans: true, gallery: true, brochure: true },
    "montura-3": { floorPlans: true, gallery: true, brochure: true },
    selvara: { floorPlans: true, gallery: true, brochure: true },
    "selvara-2": { floorPlans: true, gallery: true, brochure: true },
    "selvara-3": { floorPlans: true, gallery: true, brochure: true },
    "selvara-4": { floorPlans: true, gallery: true, brochure: true },

    // Emaar South
    "golf-acres": { floorPlans: true, gallery: false, brochure: true },
    "golf-dale": { floorPlans: true, gallery: true, brochure: true },
    "golf-meadow": { floorPlans: true, gallery: true, brochure: true },
    "golf-point": { floorPlans: true, gallery: true, brochure: true },
    "golf-verge": { floorPlans: true, gallery: true, brochure: true },

    // Dubai Hills
    "golf-hillside": { floorPlans: true, gallery: true, brochure: true },
    hillsedge: { floorPlans: true, gallery: true, brochure: true },
    parkwood: { floorPlans: true, gallery: true, brochure: true },
    rosehill: { floorPlans: true, gallery: true, brochure: true },
    "vida-residences-hillside": {
      floorPlans: true,
      gallery: true,
      brochure: true,
    },

    // Expo Living
    "terra-heights": { floorPlans: true, gallery: true, brochure: true },

    // Dubai Creek Harbour
    albero: { floorPlans: true, gallery: true, brochure: true },
    altan: { floorPlans: true, gallery: true, brochure: true },
    montiva: { floorPlans: false, gallery: false, brochure: true }, // Montiva has no floor plans or images
    silva: { floorPlans: true, gallery: true, brochure: true },

    // Rashid Yachts
    "baystar-by-vida": { floorPlans: true, gallery: true, brochure: true },
    "pier-point-2": { floorPlans: true, gallery: true, brochure: true },
    "sera-2": { floorPlans: true, gallery: true, brochure: true },

    // The Valley
    rivera: { floorPlans: true, gallery: true, brochure: true },
    vindera: { floorPlans: true, gallery: true, brochure: true },
  };

  return (
    fileAvailabilityMap[propertyName] || {
      floorPlans: true,
      gallery: true,
      brochure: true,
    }
  );
};

// Get available sidebar options for a property
export const getAvailableSidebarOptions = (propertyName, communityName) => {
  const availability = checkFileAvailability(propertyName, communityName);
  const options = [
    { id: 0, name: "Home", alwaysShow: true },
    { id: 1, name: "Map", alwaysShow: true },
    { id: 2, name: "Floor Plans", available: availability.floorPlans },
    { id: 3, name: "Gallery", available: availability.gallery },
    { id: 4, name: "Brochure", available: availability.brochure },
  ];

  return options.filter((option) => option.alwaysShow || option.available);
};
