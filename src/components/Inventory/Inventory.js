import Image from "next/image";
import React, { useState, useEffect, useContext, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Locator from "../Markers/InventoryMarkers/Locator";
import ThreeSixtyMarker from "../Markers/ThreeSixtyMarker";
import ThreeSixtyCard from "../ThreeSixtyCard/ThreeSixtyCard";
import { AnimatePresence } from "framer-motion";
import ThreeSixtyView from "../ThreeSixtyView/ThreeSixtyView";
import SubCommunity from "../SubCommunity/SubCommunity";
import { AppContext } from "@/context/appContext";
import { useParams } from "next/navigation";

export default function Inventory({ setSideBarButtonClicked }) {
  const { setShowBackButton, setBackButtonCallback } = useContext(AppContext);

  const [initialScale, setInitialScale] = useState(null);
  const [handle360MarkerClick, setHandle360MarkerClick] = useState(false);

  const [selectedThreeSixtyMarker, setSelectedThreeSixtyMarker] =
    useState(null);

  const [showSubCommunity, setShowSubCommunity] = useState(false);
  const [inventoryData, setInventoryData] = useState(null);
  const [documentId, setDocumentId] = useState(null);

  const transformRef = useRef(null);

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { slug } = useParams();

  const [showThreeSixtyView, setShowThreeSixtyView] = useState(false);

  const handle360MarkerIconClick = (e) => {
    const index = parseInt(e.target.getAttribute("name"));
    setHandle360MarkerClick(!handle360MarkerClick);
    setSelectedThreeSixtyMarker(
      inventoryData?.inventory_three_sixty_markers[index]
    );
  };

  const handleImageLoad = () => {
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
    // Set dummy data instead of API call
    setInventoryData({
      id: 1,
      inventory_map_image: {
        url: "/inventory_image.jpg",
      },
      inventory_three_sixty_markers: [],
      inventory_locator_marker: [],
    });
  }, [slug]);

  return (
    <>
      <div className="w-full h-screen bg-gray-200 overflow-hidden flex justify-center items-center">
        {!showSubCommunity && inventoryData && isImageLoaded ? (
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
                      src={inventoryData?.inventory_map_image?.url}
                      alt={inventoryData?.inventory_map_image?.alternativeText}
                      fill
                      quality={100}
                      priority
                      unoptimized
                      className="pointer-events-none opacity-100"
                    />
                    {inventoryData?.inventory_locator_marker?.map(
                      (location) => (
                        <Locator
                          key={location.id}
                          location={location}
                          handleSubCommunityClick={handleSubCommunityClick}
                        />
                      )
                    )}
                    {inventoryData?.inventory_three_sixty_markers?.map(
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
            // ThreeSixtyMarkers={inventoryData?.inventory_three_sixty_markers}
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
