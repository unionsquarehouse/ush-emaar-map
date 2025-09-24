"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function VRVideoPlayer({
  selectedThreeSixtyMarker,
  ThreeSixtyMarkers,
  setSelectedThreeSixtyMarker,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const buttonContainerRef = useRef(null);

  // Check if scroll buttons should be visible
  const checkScroll = () => {
    if (buttonContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        buttonContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Scroll handlers
  const scrollLeft = () => {
    if (buttonContainerRef.current) {
      const buttonWidth =
        buttonContainerRef.current.children[0].offsetWidth + 8; // width + gap
      buttonContainerRef.current.scrollBy({
        left: -buttonWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (buttonContainerRef.current) {
      const buttonWidth =
        buttonContainerRef.current.children[0].offsetWidth + 8; // width + gap
      buttonContainerRef.current.scrollBy({
        left: buttonWidth,
        behavior: "smooth",
      });
    }
  };

  // Add function to handle video events
  const setupVideoEventListeners = (videoElement) => {
    if (!videoElement) return;

    // Set loading true when video starts loading
    videoElement.addEventListener("loadstart", () => setIsLoading(true));

    // Set loading false when video can play
    videoElement.addEventListener("canplay", () => {
      setIsLoading(false);
      videoElement.play().catch((err) => {
        console.error("Error auto-playing video:", err);
        setIsLoading(false);
      });
    });

    // Also handle errors
    videoElement.addEventListener("error", () => {
      console.error("Video error occurred");
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const container = containerRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75, // fov
      container.clientWidth / container.clientHeight, // aspect
      0.1,
      1000
    );
    camera.position.set(0, 0, 0.1);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMappingExposure = 1;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Video Element
    const video = document.createElement("video");
    video.src = selectedThreeSixtyMarker.panorama_video;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute("webkit-playsinline", "true");

    // Setup event listeners for loading state
    setupVideoEventListeners(video);

    // video.play().catch((err) => {
    //   console.error("Error auto-playing video:", err);
    //   setIsLoading(false);
    // });

    videoRef.current = video;

    // videoRef.current.play().catch((err) => {
    //   console.error("Error auto-playing video:", err);
    //   setIsLoading(false);
    // });

    // Create video texture
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    texture.colorSpace = THREE.SRGBColorSpace;

    // Sphere geometry
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the sphere

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse/Touch control variables
    let isUserInteracting = false;
    let lon = 0,
      lat = 0;
    let phi = 0,
      theta = 0;
    let startX = 0,
      startY = 0;
    let onPointerDownLon = 0,
      onPointerDownLat = 0;

    // Combined pointer down handler for mouse and touch
    const onPointerDown = (event) => {
      isUserInteracting = true;

      // Get coordinates for both mouse and touch events
      const x = event.type.includes("mouse")
        ? event.clientX
        : event.touches[0].clientX;
      const y = event.type.includes("mouse")
        ? event.clientY
        : event.touches[0].clientY;

      startX = x;
      startY = y;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    };

    // Combined pointer move handler for mouse and touch
    const onPointerMove = (event) => {
      if (!isUserInteracting) return;

      // Get coordinates for both mouse and touch events
      const x = event.type.includes("mouse")
        ? event.clientX
        : event.touches[0].clientX;
      const y = event.type.includes("mouse")
        ? event.clientY
        : event.touches[0].clientY;

      // Calculate the movement
      lon = (startX - x) * 0.1 + onPointerDownLon;
      lat = (y - startY) * 0.1 + onPointerDownLat;
    };

    // Combined pointer up handler for mouse and touch
    const onPointerUp = () => {
      isUserInteracting = false;
    };

    // Add mouse event listeners
    container.addEventListener("mousedown", onPointerDown);
    container.addEventListener("mousemove", onPointerMove);
    container.addEventListener("mouseup", onPointerUp);
    container.addEventListener("mouseleave", onPointerUp);

    // Add touch event listeners
    container.addEventListener("touchstart", onPointerDown, { passive: true });
    container.addEventListener("touchmove", onPointerMove, { passive: true });
    container.addEventListener("touchend", onPointerUp);
    container.addEventListener("touchcancel", onPointerUp);

    // Handle resize
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Limit vertical rotation to prevent flipping
      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      camera.target = new THREE.Vector3();
      camera.target.x = Math.sin(phi) * Math.cos(theta);
      camera.target.y = Math.cos(phi);
      camera.target.z = Math.sin(phi) * Math.sin(theta);
      camera.lookAt(camera.target);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      // Remove all event listeners
      container.removeEventListener("mousedown", onPointerDown);
      container.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("mouseup", onPointerUp);
      container.removeEventListener("mouseleave", onPointerUp);

      container.removeEventListener("touchstart", onPointerDown);
      container.removeEventListener("touchmove", onPointerMove);
      container.removeEventListener("touchend", onPointerUp);
      container.removeEventListener("touchcancel", onPointerUp);

      window.removeEventListener("resize", onResize);

      // Cleanup video
      // videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.src = "";
      videoRef.current = null;
      container.removeChild(renderer.domElement);

      // Remove event listeners
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadstart", () =>
          setIsLoading(true)
        );
        videoRef.current.removeEventListener("canplay", () =>
          setIsLoading(false)
        );
        videoRef.current.removeEventListener("error", () =>
          setIsLoading(false)
        );
      }
    };
  }, []);

  // Add useEffect to check scroll on mount and button changes
  useEffect(() => {
    checkScroll();
    buttonContainerRef.current?.addEventListener("scroll", checkScroll);
    return () =>
      buttonContainerRef.current?.removeEventListener("scroll", checkScroll);
  }, [ThreeSixtyMarkers]);

  return (
    <>
      <div
        ref={containerRef}
        className="w-screen h-screen bg-black touch-none select-none relative"
        style={{
          WebkitTapHighlightColor: "transparent",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
            <div className="bg-black/80 rounded-lg p-6 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-t-white border-r-white/30 border-b-white/10 border-l-white/50 rounded-full animate-spin mb-4"></div>
              <p className="text-white font-medium">Loading 360° Video...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Buttons swipeable */}
      <div className="w-fit mx-auto absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 scale-50 md:scale-100">
        {/* Left Arrow - visible if more than 5 buttons */}
        {ThreeSixtyMarkers.length > 1 && (
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`z-10 p-2 rounded-full shadow-lg transition-colors ${
              canScrollLeft
                ? "bg-black text-white hover:bg-white hover:text-black cursor-pointer"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        <div
          ref={buttonContainerRef}
          className="flex flex-row gap-4 overflow-hidden scroll-smooth "
          style={{
            width: "fit-content",
            maxWidth: "calc((120px * 5) + (0.5rem * 4))", // Width for 5 buttons + 4 gaps
          }}
        >
          {ThreeSixtyMarkers.map((marker) => (
            <button
              key={marker.id}
              className={`flex-shrink-0 w-fit px-4 py-2 font-normal text-sm rounded-full cursor-pointer ${
                selectedThreeSixtyMarker.name === marker.name
                  ? "bg-white text-black shadow-md"
                  : "bg-black text-white"
              }`}
              onClick={() => {
                // Set loading state to true when changing videos
                setIsLoading(true);
                setSelectedThreeSixtyMarker(marker);

                // Clear the currently playing video
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                  videoRef.current.src = marker.panorama_video;
                  videoRef.current.play().catch((err) => {
                    console.error("Error playing video:", err);
                    setIsLoading(false);
                  });
                }
              }}
            >
              {marker.name}
            </button>
          ))}
        </div>

        {/* Right Arrow - visible if more than 5 buttons */}
        {ThreeSixtyMarkers.length > 1 && (
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`z-10 p-2 rounded-full shadow-lg transition-colors ${
              canScrollRight
                ? "bg-black text-white hover:bg-white hover:text-black cursor-pointer"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
