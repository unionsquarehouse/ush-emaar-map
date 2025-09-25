"use client";

import Gallery from "@/components/Gallery/Gallery";
import FloorPlans from "@/components/FloorPlans/FloorPlans";
import Brochure from "@/components/Brochure/Brochure";
import NavBar from "@/components/NavBar/NavBar";
import SimpleMap from "@/components/SimpleMap/SimpleMap";
import SideBar from "@/components/SideBar/SideBar";
import { useState } from "react";

export default function TheValleyPage() {
  const [sideBarButtonClicked, setSideBarButtonClicked] = useState(1); // Start with Map view
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleSideBarButtonClick = (index) => {
    setSideBarButtonClicked(index);
  };

  return (
    <div className="w-screen h-screen">
      {sideBarButtonClicked === 1 && (
        <SimpleMap setSideBarButtonClicked={setSideBarButtonClicked} />
      )}
      {sideBarButtonClicked === 2 && (
        <FloorPlans
          setSideBarButtonClicked={setSideBarButtonClicked}
          communitySlug="the-valley"
          onPropertySelect={setSelectedProperty}
        />
      )}
      {sideBarButtonClicked === 3 && (
        <Gallery
          communitySlug="the-valley"
          onPropertySelect={setSelectedProperty}
        />
      )}
      {sideBarButtonClicked === 4 && (
        <Brochure
          setSideBarButtonClicked={setSideBarButtonClicked}
          communitySlug="the-valley"
          onPropertySelect={setSelectedProperty}
        />
      )}

      <NavBar isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} />
      <SideBar
        sideBarButtonClicked={sideBarButtonClicked}
        handleSideBarButtonClick={handleSideBarButtonClick}
        selectedProperty={selectedProperty}
        communityName="the-valley"
      />
    </div>
  );
}
