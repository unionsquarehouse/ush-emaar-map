"use client";

import Gallery from "@/components/Gallery/Gallery";
import FloorPlans from "@/components/FloorPlans/FloorPlans";
import Brochure from "@/components/Brochure/Brochure";
import NavBar from "@/components/NavBar/NavBar";
import SimpleMap from "@/components/SimpleMap/SimpleMap";
import SideBar from "@/components/SideBar/SideBar";
import { useState } from "react";

export default function ExpoLivingPage() {
  const [sideBarButtonClicked, setSideBarButtonClicked] = useState(1); // Start with Map view
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleSideBarButtonClick = (index) => {
    setSideBarButtonClicked(index);
  };

  return (
    <div className="w-full h-full">
      {sideBarButtonClicked === 1 && (
        <SimpleMap setSideBarButtonClicked={setSideBarButtonClicked} />
      )}
      {sideBarButtonClicked === 2 && (
        <FloorPlans
          setSideBarButtonClicked={setSideBarButtonClicked}
          communitySlug="expo-living"
        />
      )}
      {sideBarButtonClicked === 3 && <Gallery communitySlug="expo-living" />}
      {sideBarButtonClicked === 4 && (
        <Brochure
          setSideBarButtonClicked={setSideBarButtonClicked}
          communitySlug="expo-living"
        />
      )}

      <NavBar isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} />
      <SideBar
        sideBarButtonClicked={sideBarButtonClicked}
        handleSideBarButtonClick={handleSideBarButtonClick}
      />
    </div>
  );
}
