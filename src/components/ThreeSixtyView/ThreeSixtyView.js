"use client";

import React, { useContext, useEffect, useState } from "react";
import VRVideoPlayer from "../VRVideoPlayer/VRVideoPlayer";

import { AppContext } from "@/context/appContext";
import { FETCH_ALL_PROJECTS } from "@/constants/constants";
import qs from "qs";
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
    const fetchData = async () => {
      const query = qs.stringify(
        {
          populate: {
            inventory_map_image: true,
            inventory_three_sixty_markers: {
              populate: ["image", "card_image"],
            },
            inventory_locator_marker: {
              populate: {
                locator: true,
                master_plan: {
                  populate: ["master_plan_three_sity_marker"], // or 'master_plan_three_sixty_marker' if that's correct
                },
              },
            },
          },
          filters: {
            project_slug: slug,
          },
          fields: ["id"],
        },
        { encodeValuesOnly: true }
      );
      const data = await fetch(`${FETCH_ALL_PROJECTS}?${query}`);
      const project = await data.json();

      let tempArr = [];
      project?.data[0]?.inventory_three_sixty_markers?.forEach((marker) => {
        tempArr.push(marker);
      });
      project?.data[0]?.inventory_locator_marker?.forEach((marker) => {
        marker?.master_plan?.master_plan_three_sity_marker?.forEach(
          (marker) => {
            // Check for markers with same name, if found then don't put that marker in the array
            const filteredMarkers = tempArr.filter(
              (m) => m.name.toLowerCase() !== marker.name.toLowerCase()
            );
            tempArr = [...filteredMarkers, marker];
          }
        );
      });
      setAllThreeSixtyMarkers(tempArr);
    };
    fetchData();
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
