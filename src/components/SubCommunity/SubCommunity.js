import Image from "next/image";
import React, { useState, useEffect, useContext, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Locator from "../Markers/InventoryMarkers/Locator";
import ThreeSixtyMarker from "../Markers/ThreeSixtyMarker";
import ThreeSixtyCard from "../ThreeSixtyCard/ThreeSixtyCard";
import { AnimatePresence } from "framer-motion";
import ThreeSixtyView from "../ThreeSixtyView/ThreeSixtyView";
import { AppContext } from "@/context/appContext";
import MasterPlanInfoCard from "../MasterPlanInfoCard/MasterPlanInfoCard";

export default function SubCommunity({ setShowSubCommunity, documentId }) {
  const { setShowBackButton, setBackButtonCallback } = useContext(AppContext);
  const [initialScale, setInitialScale] = useState(null);
  const [handle360MarkerClick, setHandle360MarkerClick] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const transformRef = useRef(null);

  const [data, setData] = useState(null);

  const [selectedThreeSixtyMarker, setSelectedThreeSixtyMarker] =
    useState(null);

  const [showThreeSixtyView, setShowThreeSixtyView] = useState(false);

  const [showMasterPlanInfoCard, setShowMasterPlanInfoCard] = useState(false);
  const [selectedMasterPlanLocator, setSelectedMasterPlanLocator] =
    useState(null);

  // const [locationHighlightSVG, setLocationHighlightSVG] = useState(
  //   LocationHighlightSVGs
  // );

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handle360MarkerIconClick = (e) => {
    const index = parseInt(e.target.getAttribute("name"));
    setHandle360MarkerClick(!handle360MarkerClick);
    setSelectedThreeSixtyMarker(data?.master_plan_three_sity_marker[index]);
  };

  const disable360Card = () => {
    setHandle360MarkerClick(false);
    setSelectedThreeSixtyMarker(null);
  };

  const handleThreeSixtyCardClick = () => {
    setShowThreeSixtyView(true);
    setHandle360MarkerClick(!handle360MarkerClick);
  };

  useEffect(() => {
    setShowBackButton(true);

    const handleBackButtonClick = () => {
      setShowSubCommunity(false);
    };

    setBackButtonCallback(() => handleBackButtonClick);

    return () => {
      setShowBackButton(false);
      setBackButtonCallback(null);
    };
  }, [showThreeSixtyView]);

  useEffect(() => {
    // Set dummy data instead of API call
    setData({
      id: 1,
      master_plan_map_image: {
        url: "/inventory_image.jpg",
      },
      master_plan_locator: [],
      master_plan_three_sity_marker: [],
      master_plan_location_marker: [],
      master_plan_locator_data_fields: [],
      master_plan_location_highlight_svg: "",
    });
  }, [documentId]);

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

  return (
    <>
      <div className="w-full h-screen bg-gray-200 overflow-hidden flex justify-center items-center">
        {initialScale && data ? (
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
                      src={data?.master_plan_map_image?.url}
                      alt={data?.master_plan_map_image?.alternativeText}
                      fill
                      quality={100}
                      priority
                      unoptimized
                      className={`pointer-events-none ${
                        isImageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {data?.master_plan_locator_data_fields?.map((location) => (
                      <div
                        key={location?.id}
                        style={{ zIndex: 20 }}
                        onClick={() => {
                          setShowMasterPlanInfoCard(!showMasterPlanInfoCard);
                          setSelectedMasterPlanLocator(
                            location?.master_plan_locator_card
                          );
                        }}
                      >
                        <Locator
                          key={location?.id}
                          location={location?.master_plan_locator}
                          disableClick={true}
                        />
                      </div>
                    ))}
                    {data?.master_plan_three_sity_marker?.map(
                      (location, index) => (
                        <ThreeSixtyMarker
                          key={location?.id}
                          location={location}
                          handle360MarkerIconClick={handle360MarkerIconClick}
                          index={index}
                        />
                      )
                    )}

                    {data?.master_plan_location_marker?.map((marker) => (
                      <div
                        key={marker.id}
                        className="absolute text-white px-2 py-1  transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          top: parseInt(marker.y),
                          left: parseInt(marker.x),
                          position: "absolute",
                          zIndex: 10,
                        }}
                      >
                        <div className="text-black">
                          <div className="flex flex-col items-center">
                            <div className="relative group">
                              {/* Location Name */}
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-2 rounded-lg text-xs font-base whitespace-nowrap shadow-lg hidden group-hover:block transition-opacity duration-300">
                                {marker.name}
                              </div>

                              <div
                                // className="size-30 md:size-30 lg:size-28 xl:size-28"
                                className="w-[90px]"
                                dangerouslySetInnerHTML={{
                                  __html: marker?.svgIcon,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Location Highlight SVGs */}
                    <div
                      className="absolute top-0 left-0 w-full h-full"
                      dangerouslySetInnerHTML={{
                        __html: data?.master_plan_location_highlight_svg,
                      }}
                    ></div>
                  </div>
                </TransformComponent>
              </div>
            )}
          </TransformWrapper>
        ) : (
          <div className="w-full h-screen bg-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
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

        {!isImageLoaded && (
          <div className="absolute top-0 left-0 w-full h-screen bg-black flex items-center justify-center z-[9999]">
            <div className="relative w-[100px] h-[100px] animate-bounce">
              <Image
                src="https://res.cloudinary.com/dkhns25jh/image/upload/v1733821293/xr_media/sqmxma6remiuh1mbv4x7.png"
                alt="Loading..."
                fill
                priority
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="object-contain"
              />
            </div>
          </div>
        )}
        {showThreeSixtyView && (
          <ThreeSixtyView
            setShowThreeSixtyView={setShowThreeSixtyView}
            selectedThreeSixtyMarker={selectedThreeSixtyMarker}
            // ThreeSixtyMarkers={data?.master_plan_three_sity_marker}
            setSelectedThreeSixtyMarker={setSelectedThreeSixtyMarker}
          />
        )}

        {showMasterPlanInfoCard && (
          <MasterPlanInfoCard
            title={selectedMasterPlanLocator?.title}
            subtitle={selectedMasterPlanLocator?.subtitle}
            brochureLink={selectedMasterPlanLocator?.donwload_brochure_link}
            learMoreLink={selectedMasterPlanLocator?.learn_more_link}
            image={
              selectedMasterPlanLocator?.card_image?.formats?.medium?.url ||
              selectedMasterPlanLocator?.card_image?.url
            }
            imageAlt={selectedMasterPlanLocator?.card_image?.alternativeText}
            setShowMasterPlanInfoCard={setShowMasterPlanInfoCard}
          />
        )}
      </div>
    </>
  );
}
