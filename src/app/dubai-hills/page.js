"use client";

import Gallery from "@/components/Gallery/Gallery";
import FloorPlans from "@/components/FloorPlans/FloorPlans";
import Brochure from "@/components/Brochure/Brochure";
import NavBar from "@/components/NavBar/NavBar";
import SimpleMap from "@/components/SimpleMap/SimpleMap";
import SideBar from "@/components/SideBar/SideBar";
import { useState } from "react";

export default function DubaiHillsPage() {
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
        <div className="fixed inset-0 w-screen h-screen z-50">
          <FloorPlans
            setSideBarButtonClicked={setSideBarButtonClicked}
            communitySlug="dubai-hills"
          />
        </div>
      )}
      {sideBarButtonClicked === 3 && <Gallery communitySlug="dubai-hills" />}
      {sideBarButtonClicked === 4 && (
        <div className="fixed inset-0 w-screen h-screen z-50">
          <Brochure
            setSideBarButtonClicked={setSideBarButtonClicked}
            communitySlug="dubai-hills"
          />
        </div>
      )}

      <NavBar isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} />
      <SideBar
        sideBarButtonClicked={sideBarButtonClicked}
        handleSideBarButtonClick={handleSideBarButtonClick}
      />
    </div>
  );
}
