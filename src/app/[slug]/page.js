"use client";

import Gallery from "@/components/Gallery/Gallery";
import Inventory from "@/components/Inventory/Inventory";
import NavBar from "@/components/NavBar/NavBar";
import ProjectMap from "@/components/ProjectMap/ProjectMap";
import SideBar from "@/components/SideBar/SideBar";
import { useState } from "react";

export default function Home() {
  const [sideBarButtonClicked, setSideBarButtonClicked] = useState(0);
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
        <Inventory setSideBarButtonClicked={setSideBarButtonClicked} />
      )}

      <NavBar isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} />
      <SideBar
        sideBarButtonClicked={sideBarButtonClicked}
        handleSideBarButtonClick={handleSideBarButtonClick}
      />
    </div>
  );
}
