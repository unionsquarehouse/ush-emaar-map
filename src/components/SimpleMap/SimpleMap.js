"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function SimpleMap({ setSideBarButtonClicked }) {
  const [initialScale, setInitialScale] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector(".map-container");
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const imageWidth = 1920;
        const imageHeight = 1080;

        const scaleX = containerWidth / imageWidth;
        const scaleY = containerHeight / imageHeight;
        const scale = Math.min(scaleX, scaleY, 1);

        setInitialScale(scale);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="relative w-full h-full">
        <Image
          src="/inventory_image.jpg"
          alt="Property Map"
          fill
          className="object-cover"
          priority
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageLoaded(true)}
        />
      </div>
    </div>
  );
}
