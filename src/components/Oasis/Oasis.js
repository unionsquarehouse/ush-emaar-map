import Image from "next/image";
import React, { useState, useEffect, useContext, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Locator from "../Markers/InventoryMarkers/Locator";
import ThreeSixtyMarker from "../Markers/ThreeSixtyMarker";
import ThreeSixtyCard from "../ThreeSixtyCard/ThreeSixtyCard";
import { AnimatePresence } from "framer-motion";
import ThreeSixtyView from "../ThreeSixtyView/ThreeSixtyView";
import SubCommunity from "../SubCommunity/SubCommunity";
import HealthCareMarker from "../Markers/HealthCareMarker";
import ShoppingMarker from "../Markers/ShoppingMarker";
import EducationMarker from "../Markers/EducationMarker";
import { AppContext } from "@/context/appContext";
import { useParams } from "next/navigation";
import { FETCH_ALL_PROJECTS } from "@/constants/constants";
import qs from "qs";

export default function Oasis({ setSideBarButtonClicked }) {
  const { setShowBackButton, setBackButtonCallback } = useContext(AppContext);

  const [initialScale, setInitialScale] = useState(null);
  const [handle360MarkerClick, setHandle360MarkerClick] = useState(false);

  const [selectedThreeSixtyMarker, setSelectedThreeSixtyMarker] =
    useState(null);

  const [showSubCommunity, setShowSubCommunity] = useState(false);
  const [oasisData, setOasisData] = useState(null);
  const [documentId, setDocumentId] = useState(null);

  // Sample marker data for The Oasis
  const [oasisMarkers, setOasisMarkers] = useState({
    healthcare: [
      {
        id: 1,
        name: "Oasis Medical Center",
        x: 300,
        y: 200,
        svgIcon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-9 text-red-500"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>',
      },
      {
        id: 2,
        name: "Wellness Clinic",
        x: 800,
        y: 400,
        svgIcon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-9 text-red-500"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>',
      },
    ],
    shopping: [
      {
        id: 3,
        name: "Oasis Mall",
        x: 500,
        y: 300,
        svgIcon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 text-blue-600"><path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" /></svg>',
      },
      {
        id: 4,
        name: "Luxury Boutiques",
        x: 1200,
        y: 600,
        svgIcon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 text-blue-600"><path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" /></svg>',
      },
    ],
    education: [
      {
        id: 5,
        name: "Oasis International School",
        x: 400,
        y: 700,
        svgIcon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 text-green-600"><path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.949 49.949 0 0 1-9.902 3.912l-.003.002-.34.18a.75.75 0 0 1-.707 0A50.009 50.009 0 0 1 7.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.129 56.129 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" /><path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 0 1-.46.711 47.878 47.878 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.877 47.877 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 0 1 .551-1.608 1.5 1.5 0 0 0 .14-2.67l-.93-.5a48.786 48.786 0 0 0-1.53-.38l-.34-.1a8.78 8.78 0 0 1 1.4-2.04ZM15.75 10.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 2.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" /></svg>',
      },
      {
        id: 6,
        name: "Early Learning Center",
        x: 1000,
        y: 800,
        svgIcon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 text-green-600"><path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.949 49.949 0 0 1-9.902 3.912l-.003.002-.34.18a.75.75 0 0 1-.707 0A50.009 50.009 0 0 1 7.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.129 56.129 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" /><path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 0 1-.46.711 47.878 47.878 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.877 47.877 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 0 1 .551-1.608 1.5 1.5 0 0 0 .14-2.67l-.93-.5a48.786 48.786 0 0 0-1.53-.38l-.34-.1a8.78 8.78 0 0 1 1.4-2.04ZM15.75 10.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 2.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" /></svg>',
      },
    ],
    threeSixty: [
      {
        id: 7,
        name: "Villa Showcase",
        x: 600,
        y: 500,
        image: { url: "/360-degrees.png", alternativeText: "360 View" },
      },
      {
        id: 8,
        name: "Community Center",
        x: 900,
        y: 300,
        image: { url: "/360-degrees.png", alternativeText: "360 View" },
      },
    ],
    locators: [
      {
        id: 9,
        name: "Phase 1 Villas",
        x: 700,
        y: 600,
        locator: { url: "/locator.gif", alternativeText: "Locator" },
        master_plan: { documentId: "phase1" },
      },
      {
        id: 10,
        name: "Phase 2 Mansions",
        x: 1100,
        y: 400,
        locator: { url: "/locator.gif", alternativeText: "Locator" },
        master_plan: { documentId: "phase2" },
      },
    ],
  });

  const transformRef = useRef(null);

  const [isImageLoaded, setIsImageLoaded] = useState(true); // Start as loaded

  const { slug } = useParams();

  const [showThreeSixtyView, setShowThreeSixtyView] = useState(false);

  const handle360MarkerIconClick = (e) => {
    const index = parseInt(e.target.getAttribute("name"));
    setHandle360MarkerClick(!handle360MarkerClick);
    setSelectedThreeSixtyMarker(
      oasisData?.inventory_three_sixty_markers[index]
    );
  };

  const handleImageLoad = () => {
    console.log("Oasis image loaded successfully");
    setIsImageLoaded(true);
  };

  const disable360Card = () => {
    setHandle360MarkerClick(false);
    setSelectedThreeSixtyMarker(null);
  };

  const handleThreeSixtyCardClick = () => {
    setShowThreeSixtyView(true);
    setHandle360MarkerClick(!handle360MarkerClick);
  };

  const handleSubCommunityClick = (documentId) => {
    setShowSubCommunity(true);
    setHandle360MarkerClick(false);
    setSelectedThreeSixtyMarker(null);
    setDocumentId(documentId);
  };

  const handleBackButtonClick = () => {
    setSideBarButtonClicked(0);
  };

  useEffect(() => {
    setShowBackButton(true);

    const handleBackButtonClick = () => {
      setSideBarButtonClicked(0);
    };

    setBackButtonCallback(() => handleBackButtonClick);

    return () => {
      setShowBackButton(false);
      setBackButtonCallback(null);
    };
  }, [showSubCommunity, showThreeSixtyView]);

  useEffect(() => {
    function calculateInitialScale() {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const imageWidth = 1920; // Your image width
      const imageHeight = 1080; // Your image height

      // Calculate scale needed to fit width and height
      const scaleX = viewportWidth / imageWidth;
      const scaleY = viewportHeight / imageHeight;

      // Use the larger scale to ensure image fills the screen
      const scale = Math.max(scaleX, scaleY);

      setInitialScale(scale);
    }

    // Calculate initial scale on mount
    if (!initialScale) {
      calculateInitialScale();
    }
    // Recalculate on window resize
    window.addEventListener("resize", calculateInitialScale);
    return () => window.removeEventListener("resize", calculateInitialScale);
  }, []);

  useEffect(() => {
    if (!initialScale || !transformRef.current) return;

    const { zoomIn } = transformRef.current;

    setTimeout(() => {
      zoomIn(0);
    }, 100);
  }, [initialScale]);

  useEffect(() => {
    const fetchData = async () => {
      const query = qs.stringify({
        populate: [
          "inventory_map_image",
          "inventory_three_sixty_markers",
          "inventory_three_sixty_markers.image",
          "inventory_three_sixty_markers.card_image",
          "inventory_locator_marker",
          "inventory_locator_marker.locator",
          "inventory_locator_marker.master_plan",
        ],
        filters: {
          project_slug: slug,
        },
        fields: ["id"],
      });
      const data = await fetch(`${FETCH_ALL_PROJECTS}?${query}`);
      const project = await data.json();
      setOasisData(project.data[0]);
    };
    fetchData();
  }, [slug]);

  console.log("Oasis component rendering, isImageLoaded:", isImageLoaded);

  return (
    <>
      <div className="w-full h-screen bg-gray-200 overflow-hidden flex justify-center items-center">
        {!showSubCommunity && isImageLoaded ? (
          <TransformWrapper
            ref={transformRef}
            initialScale={initialScale}
            minScale={initialScale}
            maxScale={4}
            panning={{ disabled: false }}
            wheel={{ disabled: false }}
            pinch={{ disabled: false }}
            doubleClick={{ disabled: false }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <div className="relative">
                <TransformComponent
                  wrapperStyle={{
                    width: "100vw",
                    height: "100vh",
                  }}
                >
                  <div
                    className="relative"
                    style={{
                      width: "1920px", // Set to your actual image width
                      height: "1080px", // Set to your actual image height
                    }}
                  >
                    <Image
                      onLoad={handleImageLoad}
                      onError={() => {
                        console.log("Image failed to load, but continuing...");
                        setIsImageLoaded(true);
                      }}
                      src="/inventory_image.jpg"
                      alt="The Oasis Map"
                      fill
                      quality={100}
                      priority
                      unoptimized
                      className="pointer-events-none opacity-100"
                    />

                    {/* Healthcare Markers */}
                    {oasisMarkers.healthcare.map((location) => (
                      <div
                        key={location.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          top: location.y,
                          left: location.x,
                          position: "absolute",
                          zIndex: 20,
                        }}
                      >
                        <HealthCareMarker location={location} />
                      </div>
                    ))}

                    {/* Shopping Markers */}
                    {oasisMarkers.shopping.map((location) => (
                      <div
                        key={location.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          top: location.y,
                          left: location.x,
                          position: "absolute",
                          zIndex: 20,
                        }}
                      >
                        <ShoppingMarker location={location} />
                      </div>
                    ))}

                    {/* Education Markers */}
                    {oasisMarkers.education.map((location) => (
                      <div
                        key={location.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          top: location.y,
                          left: location.x,
                          position: "absolute",
                          zIndex: 20,
                        }}
                      >
                        <EducationMarker location={location} />
                      </div>
                    ))}

                    {/* 360 Degree Markers */}
                    {oasisMarkers.threeSixty.map((location, index) => (
                      <div
                        key={location.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          top: location.y,
                          left: location.x,
                          position: "absolute",
                          zIndex: 30,
                        }}
                      >
                        <ThreeSixtyMarker
                          location={location}
                          handle360MarkerIconClick={handle360MarkerIconClick}
                          index={index}
                        />
                      </div>
                    ))}

                    {/* Locator Markers */}
                    {oasisMarkers.locators.map((location) => (
                      <div
                        key={location.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          top: location.y,
                          left: location.x,
                          position: "absolute",
                          zIndex: 10,
                        }}
                      >
                        <Locator
                          location={location}
                          handleSubCommunityClick={handleSubCommunityClick}
                        />
                      </div>
                    ))}

                    {/* Original data markers if available */}
                    {oasisData?.inventory_locator_marker?.map((location) => (
                      <Locator
                        key={location.id}
                        location={location}
                        handleSubCommunityClick={handleSubCommunityClick}
                      />
                    ))}
                    {oasisData?.inventory_three_sixty_markers?.map(
                      (location, index) => (
                        <ThreeSixtyMarker
                          key={location.id}
                          location={location}
                          handle360MarkerIconClick={handle360MarkerIconClick}
                          index={index}
                        />
                      )
                    )}
                  </div>
                </TransformComponent>
              </div>
            )}
          </TransformWrapper>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        <AnimatePresence>
          {handle360MarkerClick && (
            <ThreeSixtyCard
              disable360Card={disable360Card}
              handleThreeSixtyCardClick={handleThreeSixtyCardClick}
              selectedThreeSixtyMarker={selectedThreeSixtyMarker}
            />
          )}
        </AnimatePresence>
        {showThreeSixtyView && (
          <ThreeSixtyView
            setShowThreeSixtyView={setShowThreeSixtyView}
            selectedThreeSixtyMarker={selectedThreeSixtyMarker}
            setSelectedThreeSixtyMarker={setSelectedThreeSixtyMarker}
          />
        )}
        {showSubCommunity && (
          <SubCommunity
            setShowSubCommunity={setShowSubCommunity}
            documentId={documentId}
          />
        )}
      </div>
    </>
  );
}
