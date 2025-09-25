"use client";

import React, { useContext, useEffect, useState } from "react";
import VRVideoPlayer from "../VRVideoPlayer/VRVideoPlayer";

import { AppContext } from "@/context/appContext";
import { useParams } from "next/navigation";

export default function ThreeSixtyView({
  setShowThreeSixtyView,
  selectedThreeSixtyMarker,
  ThreeSixtyMarkers,
  setSelectedThreeSixtyMarker,
}) {
  const { setShowBackButton, setBackButtonCallback } = useContext(AppContext);

  const { slug } = useParams();

  useEffect(() => {
    setShowBackButton(true);

    const handleBackButtonClick = () => {
      setShowThreeSixtyView(false);
    };

    setBackButtonCallback(() => handleBackButtonClick);

    return () => {
      setShowBackButton(false);
      setBackButtonCallback(null);
    };
  }, []);

  const [allThreeSixtyMarkers, setAllThreeSixtyMarkers] = useState([]);

  useEffect(() => {
    // Set dummy data instead of API call
    setAllThreeSixtyMarkers([]);
  }, [slug]);

  return (
    <div className="absolute w-[100vw] h-[100vh]">
      <VRVideoPlayer
        selectedThreeSixtyMarker={selectedThreeSixtyMarker}
        ThreeSixtyMarkers={allThreeSixtyMarkers}
        setSelectedThreeSixtyMarker={setSelectedThreeSixtyMarker}
      />
    </div>
  );
}
