"use client";

import Gallery from "@/components/Gallery/Gallery";
import ProjectPage from "@/components/ProjectPage/ProjectPage";
import FloorPlans from "@/components/FloorPlans/FloorPlans";
import NavBar from "@/components/NavBar/NavBar";
import ProjectMap from "@/components/ProjectMap/ProjectMap";
import SideBar from "@/components/SideBar/SideBar";
import { useState } from "react";

export default function TheValleyPage() {
  const [sideBarButtonClicked, setSideBarButtonClicked] = useState(1); // Start with project view
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleSideBarButtonClick = (index) => {
    setSideBarButtonClicked(index);
  };

  const handleMainLocationClick = () => {
    setSideBarButtonClicked(1);
  };

  return (
    <div className="w-full h-full">
      {sideBarButtonClicked === 0 && (
        <ProjectMap handleMainLocationClick={handleMainLocationClick} />
      )}
      {sideBarButtonClicked === 2 && <Gallery />}
      {sideBarButtonClicked === 1 && (
        <FloorPlans setSideBarButtonClicked={setSideBarButtonClicked} />
      )}

      <NavBar isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} />
      <SideBar
        sideBarButtonClicked={sideBarButtonClicked}
        handleSideBarButtonClick={handleSideBarButtonClick}
      />
    </div>
  );
}
