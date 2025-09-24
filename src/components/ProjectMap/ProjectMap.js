"use client";

import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import LocationMarker from "../Markers/LocationMarker";
import HealthCareMarker from "../Markers/HealthCareMarker";
import EducationMarker from "../Markers/EducationMarker";
import ShoppingMarker from "../Markers/ShoppingMarker";
import ThreeSixtyMarker from "../Markers/ThreeSixtyMarker";
import InventoryMarker from "../Markers/InventoryMarkers/Locator";
import ProjectMapInfoCard from "../ProjectMapInfoCard/ProjectMapInfoCard";
import { useParams, useRouter } from "next/navigation";
import { FETCH_ALL_PROJECTS } from "@/constants/constants";
import qs from "qs";

export default function ProjectMap({ handleMainLocationClick }) {
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [buttons, setButtons] = useState([
    {
      label: "Show All",
      svgIcon: `
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
</svg>

`,
    },
    {
      label: "Landmarks",
      svgIcon: `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
</svg>

`,
    },
    {
      label: "Healthcare",
      svgIcon: `
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>
`,
    },
    {
      label: "Education",
      svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
</svg>
`,
    },
    {
      label: "Shopping",
      svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>
`,
    },
  ]);

  const [isImageLoaded, setIsImageLoaded] = useState(true);

  const [clickedButton, setClickedButton] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [initialScale, setInitialScale] = useState(null);

  const [isHovered, setIsHovered] = useState(false);

  const [showMarkers, setShowMarkers] = useState("show all");

  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);

  const [showSVG, setShowSVG] = useState(false);
  const [mainProjectData, setMainProjectData] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);

  const transformRef = useRef(null);

  const { slug } = useParams();

  // Add ref for the buttons container
  const buttonsContainerRef = useRef(null);
  // State to track scroll possibility
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleButtonClick = (index) => {
    setClickedButton(index);
    setShowMarkers(buttons[index].label.toLowerCase());
    setShowSVG(false);
    setShowInfoCard(false);
  };

  const handleMainProjectSVGClick = () => {
    handleMainLocationClick();
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setShowInfoCard(true);
  };

  const handleThreeSixtyClick = (threeSixty) => {
    // Handle three sixty click
    console.log("Three sixty clicked:", threeSixty);
  };

  const handleInventoryClick = (inventory) => {
    // Handle inventory click
    console.log("Inventory clicked:", inventory);
  };

  // Calculate distance between two points
  const calculateDistance = (start, end) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy); // Distance in pixels
  };

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
  }, [initialScale]);

  // Function to check if scrolling is possible
  const checkScrollability = () => {
    if (buttonsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        buttonsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // -1 for rounding errors
    }
  };

  // Handle arrow clicks
  const scrollLeft = () => {
    if (buttonsContainerRef.current) {
      buttonsContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (buttonsContainerRef.current) {
      buttonsContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Check scrollability on mount and window resize
  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, []);

  useLayoutEffect(() => {
    if (!initialScale || !transformRef.current) return;

    const { zoomIn } = transformRef.current;

    // Delay setting the transform slightly to ensure the DOM is ready
    setTimeout(() => {
      zoomIn(0);
    }, 100);
  }, [initialScale]);

  useEffect(() => {
    const fetchProject = async () => {
      const query = qs.stringify({
        populate: [
          "project_main_map_image",
          "main_project_map_landmarks",
          "main_project_map_landmarks.image",
          "main_map_healthcare_markers",
          "main_map_education_markers",
          "main_map_shopping_markers",
        ],
        filters: {
          project_slug: slug,
        },
        fields: ["id", "project_title", "project_slug"],
      });
      const data = await fetch(`${FETCH_ALL_PROJECTS}?${query}`);
      const project = await data.json();
      setMainProjectData(project.data[0]);
    };
    fetchProject();
  }, [slug]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <>
      <div className="w-full h-screen bg-gray-200 overflow-hidden flex justify-center items-center">
        {
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
                      id="dubai_map"
                      onLoad={handleImageLoad}
                      src="/dubai_map_2.png"
                      alt="Project Map"
                      fill
                      quality={100}
                      priority
                      unoptimized
                      className="pointer-events-none opacity-100"
                    />

                    {/* Location Markers - COMMENTED OUT FOR NOW */}
                    {/* {(showMarkers === "landmarks" ||
                      showMarkers === "show all") &&
                      mainProjectData?.main_project_map_landmarks?.map(
                        (marker, index) => (
                          <div
                            key={marker.id}
                            className="absolute w-10 h-10 text-white px-2 py-1 rounded-full  transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                              top: parseInt(marker.y),
                              left: parseInt(marker.x),
                              position: "absolute",
                              zIndex: 10,
                            }}
                            onClick={() => {
                              setSelectedLocation(marker);
                              setSelectedMarkerIndex(index);
                              setShowSVG(true);
                              setIsHovered(false);
                              setShowInfoCard(true);
                            }}
                          >
                            <LocationMarker
                              key={marker.id}
                              location={marker}
                              index={index}
                              selectedMarkerIndex={selectedMarkerIndex}
                              setIsHovered={setIsHovered}
                              showSVG={showSVG}
                              isHovered={isHovered}
                            />
                          </div>
                        )
                       )} */}

                    {/* HealthCare Markers - COMMENTED OUT FOR NOW */}
                    {/* {(showMarkers === "healthcare" ||
                      showMarkers === "show all") &&
                      !showSVG &&
                      mainProjectData?.main_map_healthcare_markers?.map(
                        (marker) => (
                          <div
                            key={marker.id}
                            className="absolute text-white px-2 py-1 rounded-full  transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                              top: parseInt(marker.y),
                              left: parseInt(marker.x),
                              position: "absolute",
                              zIndex: 10,
                            }}
                          >
                            <HealthCareMarker
                              key={marker.id}
                              location={marker}
                            />
                          </div>
                        )
                       )} */}

                    {/* Education Markers - COMMENTED OUT FOR NOW */}
                    {/* {(showMarkers === "education" ||
                      showMarkers === "show all") &&
                      !showSVG &&
                      mainProjectData?.main_map_education_markers?.map(
                        (marker) => (
                          <div
                            key={marker.id}
                            className="absolute text-white px-2 py-1 rounded-full  transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                              top: parseInt(marker.y),
                              left: parseInt(marker.x),
                              position: "absolute",
                              zIndex: 10,
                            }}
                          >
                            <EducationMarker
                              key={marker.id}
                              location={marker}
                            />
                          </div>
                        )
                       )} */}

                    {/* Shopping Markers - COMMENTED OUT FOR NOW */}
                    {/* {(showMarkers === "shopping" ||
                      showMarkers === "show all") &&
                      !showSVG &&
                      mainProjectData?.main_map_shopping_markers?.map(
                        (marker) => (
                          <div
                            key={marker.id}
                            className="absolute text-white px-2 py-1 rounded-full  transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                              top: parseInt(marker.y),
                              left: parseInt(marker.x),
                              position: "absolute",
                              zIndex: 10,
                            }}
                          >
                            <ShoppingMarker key={marker.id} location={marker} />
                          </div>
                        )
                       )} */}
                  </div>

                  {/* SVG Line between selected location and markers */}

                  {showSVG && (
                    <div
                      className="absolute top-0 left-0 w-full h-full bg-black/70"
                      onClick={() => {
                        setShowSVG(false);
                        setShowInfoCard(false);
                      }}
                      dangerouslySetInnerHTML={{
                        __html: selectedLocation.svgAnimation,
                      }}
                    ></div>
                  )}
                  {/* SVG Line between selected location and markers */}

                  {/* Project Buttons Only - Icons Removed */}
                  <div
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 20 }}
                  >
                    {/* Oasis Button */}
                    <div
                      className="absolute"
                      style={{ left: "660px", top: "540px" }}
                    >
                      <button
                        className="bg-black flex-shrink-0 flex flex-row items-center gap-2 text-white rounded-full px-5 py-3 cursor-pointer hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto z-20"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push("/oasis");
                        }}
                        onMouseEnter={() => setHoveredProject("oasis")}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <span className="font-bold text-sm whitespace-nowrap">
                          The Oasis
                        </span>
                      </button>
                    </div>

                    {/* Grand Polo Button */}
                    <div
                      className="absolute"
                      style={{ left: "590px", top: "812px" }}
                    >
                      <button
                        className="bg-black flex-shrink-0 flex flex-row items-center gap-2 text-white rounded-full px-5 py-3 cursor-pointer hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto z-20"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push("/grand-polo");
                        }}
                        onMouseEnter={() => setHoveredProject("grand-polo")}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <span className="font-bold text-sm whitespace-nowrap">
                          Grand Polo
                        </span>
                      </button>
                    </div>

                    {/* Emaar South Button */}
                    <div
                      className="absolute"
                      style={{ left: "200px", top: "860px" }}
                    >
                      <button
                        className="bg-black flex-shrink-0 flex flex-row items-center gap-2 text-white rounded-full px-5 py-3 cursor-pointer hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto z-20"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push("/emaar-south");
                        }}
                        onMouseEnter={() => setHoveredProject("emaar-south")}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <span className="font-bold text-sm whitespace-nowrap">
                          Emaar South
                        </span>
                      </button>
                    </div>

                    {/* Dubai Hills Button */}
                    <div
                      className="absolute"
                      style={{ left: "850px", top: "507px" }}
                    >
                      <button
                        className="bg-black flex-shrink-0 flex flex-row items-center gap-2 text-white rounded-full px-5 py-3 cursor-pointer hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto z-20"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push("/dubai-hills");
                        }}
                        onMouseEnter={() => setHoveredProject("dubai-hills")}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <span className="font-bold text-sm whitespace-nowrap">
                          Dubai Hills
                        </span>
                      </button>
                    </div>

                    {/* Expo Living Button */}
                    <div
                      className="absolute"
                      style={{ left: "450px", top: "500px" }}
                    >
                      <button
                        className="bg-black flex-shrink-0 flex flex-row items-center gap-2 text-white rounded-full px-5 py-3 cursor-pointer hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto z-20"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push("/expo-living");
                        }}
                        onMouseEnter={() => setHoveredProject("expo-living")}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <span className="font-bold text-sm whitespace-nowrap">
                          Expo Living
                        </span>
                      </button>
                    </div>

                    {/* Dubai Creek Harbour Button */}
                    <div
                      className="absolute"
                      style={{ left: "1167px", top: "572px" }}
                    >
                      <button
                        className="bg-black flex-shrink-0 flex flex-row items-center gap-2 text-white rounded-full px-5 py-3 cursor-pointer hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto z-20"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push("/dubai-creek-harbour");
                        }}
                        onMouseEnter={() =>
                          setHoveredProject("dubai-creek-harbour")
                        }
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <span className="font-bold text-sm whitespace-nowrap">
                          Dubai Creek Harbour
                        </span>
                      </button>
                    </div>

                    {/* Rashid Yachts Button */}
                    <div
                      className="absolute"
                      style={{ right: "345px", top: "150px" }}
                    >
                      <button
                        className="bg-black flex-shrink-0 flex flex-row items-center gap-2 text-white rounded-full px-5 py-3 cursor-pointer hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto z-20"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push("/rashid-yachts");
                        }}
                        onMouseEnter={() => setHoveredProject("rashid-yachts")}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <span className="font-bold text-sm whitespace-nowrap">
                          Rashid Yachts
                        </span>
                      </button>
                    </div>

                    {/* The Valley Button */}
                    <div
                      className="absolute"
                      style={{ left: "1100px", top: "910px" }}
                    >
                      <button
                        className="bg-black flex-shrink-0 flex flex-row items-center gap-2 text-white rounded-full px-5 py-3 cursor-pointer hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto z-20"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push("/the-valley");
                        }}
                        onMouseEnter={() => setHoveredProject("the-valley")}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <span className="font-bold text-sm whitespace-nowrap">
                          The Valley
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* All Projects SVG Display */}
                  <div
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 10 }}
                  >
                    <object
                      data="/emaar-map.svg"
                      type="image/svg+xml"
                      className="w-full h-full opacity-80 transition-opacity duration-300"
                      style={{ pointerEvents: "auto", zIndex: 1 }}
                      onLoad={() => {
                        console.log(
                          "SVG object loaded, setting up event listeners..."
                        );
                        // Add click event listeners to SVG paths after load
                        setTimeout(() => {
                          const svgDoc = document.querySelector(
                            'object[data="/emaar-map.svg"]'
                          )?.contentDocument;
                          console.log("SVG document:", svgDoc);

                          if (svgDoc) {
                            console.log(
                              "SVG document found, adding event listeners..."
                            );
                            // Add click handlers to each property path
                            const properties = [
                              "the-oasis-property",
                              "emaar-south-property",
                              "the-valley-property",
                              "dubai-hills-property",
                              "grand-polo-property",
                              "dubai-creek-harbour-property",
                              "expo-living-property",
                              "rashid-yachts-property",
                            ];

                            properties.forEach((propertyClass) => {
                              const elements = svgDoc.querySelectorAll(
                                `.${propertyClass}`
                              );
                              console.log(
                                `Found ${elements.length} elements for ${propertyClass}`
                              );
                              elements.forEach((element) => {
                                element.style.cursor = "pointer";
                                element.style.pointerEvents = "auto";

                                // Remove existing listeners to avoid duplicates
                                element.removeEventListener(
                                  "click",
                                  handleClick
                                );
                                element.removeEventListener(
                                  "mouseenter",
                                  handleMouseEnter
                                );
                                element.removeEventListener(
                                  "mouseleave",
                                  handleMouseLeave
                                );

                                // Add new listeners
                                element.addEventListener("click", handleClick);
                                element.addEventListener(
                                  "mouseenter",
                                  handleMouseEnter
                                );
                                element.addEventListener(
                                  "mouseleave",
                                  handleMouseLeave
                                );

                                function handleClick(e) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log(`SVG clicked: ${propertyClass}`);

                                  let propertyName = propertyClass
                                    .replace("-property", "")
                                    .replace("-", " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase());

                                  // Correct property names based on mapping
                                  if (propertyClass === "the-oasis-property") {
                                    propertyName = "The Oasis";
                                  }
                                  if (
                                    propertyClass === "emaar-south-property"
                                  ) {
                                    propertyName = "Emaar South";
                                  }
                                  if (propertyClass === "the-valley-property") {
                                    propertyName = "The Valley";
                                  }
                                  if (
                                    propertyClass === "dubai-hills-property"
                                  ) {
                                    propertyName = "Dubai Hills";
                                  }
                                  if (propertyClass === "grand-polo-property") {
                                    propertyName = "Grand Polo";
                                  }
                                  if (
                                    propertyClass ===
                                    "dubai-creek-harbour-property"
                                  ) {
                                    propertyName = "Dubai Creek Harbour";
                                  }
                                  if (
                                    propertyClass === "expo-living-property"
                                  ) {
                                    propertyName = "Expo Living";
                                  }
                                  if (
                                    propertyClass === "rashid-yachts-property"
                                  ) {
                                    propertyName = "Rashid Yachts";
                                  }

                                  console.log(propertyName);
                                }

                                function handleMouseEnter(e) {
                                  e.target.style.fill = "rgb(141, 122, 71)";
                                  e.target.style.opacity = "0.8";
                                }

                                function handleMouseLeave(e) {
                                  e.target.style.fill = "";
                                  e.target.style.opacity = "";
                                }
                              });
                            });
                          } else {
                            console.log("SVG document not found, retrying...");
                            // Retry after another delay
                            setTimeout(() => {
                              const retrySvgDoc = document.querySelector(
                                'object[data="/emaar-map.svg"]'
                              )?.contentDocument;
                              if (retrySvgDoc) {
                                console.log("SVG document found on retry");
                                // Repeat the same logic here if needed
                              }
                            }, 2000);
                          }
                        }, 1500); // Increased delay to ensure SVG is fully loaded
                      }}
                    >
                      Your browser does not support SVG
                    </object>
                  </div>
                  {/* Main Project location SVG End */}
                </TransformComponent>

                {/* Bottom Buttons Start - COMMENTED OUT FOR NOW */}
                {/* <div className="fixed bottom-0 left-0 w-full pb-5 flex justify-center items-center z-50 scale-50 md:scale-100">
                  <div className="relative flex items-center justify-center w-full max-w-4xl px-12">
                    <div
                      ref={buttonsContainerRef}
                      className="flex flex-row justify-start items-center gap-4 overflow-x-auto scrollbar-hide px-4 flex-grow"
                      onScroll={checkScrollability}
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      {buttons.map((button, index) => (
                        <button
                          key={index}
                          onClick={() => handleButtonClick(index)}
                          className={`bg-black flex-shrink-0 flex flex-row items-center gap-2 text-white rounded-full px-4 py-2 cursor-pointer ${
                            clickedButton === index ? "bg-white text-black" : ""
                          }`}
                        >
                          <span
                            className={`size-6 ${
                              clickedButton === index
                                ? "text-black"
                                : "text-white"
                            }`}
                            dangerouslySetInnerHTML={{ __html: button.svgIcon }}
                          />
                          <span
                            className={`font-bold text-sm whitespace-nowrap ${
                              clickedButton === index
                                ? "text-black"
                                : "text-white"
                            }`}
                          >
                            {button.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                 </div> */}
                {/* Bottom Buttons End */}

                {/* Add a  slight white overlay should be active when location marker is hovered */}
                {!showSVG && (
                  <div
                    className={`absolute top-0 left-0 w-full h-full bg-white/10 transition-opacity duration-300 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      pointerEvents: "none",
                    }}
                  ></div>
                )}
              </div>
            )}
          </TransformWrapper>
        }

        {showInfoCard && (
          <ProjectMapInfoCard
            setShowSVG={setShowSVG}
            setShowInfoCard={setShowInfoCard}
            selectedLocation={selectedLocation}
          />
        )}
      </div>
    </>
  );
}
