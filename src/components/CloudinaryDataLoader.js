"use client";

import { useCloudinaryData } from '../hooks/useCloudinaryData';

export default function CloudinaryDataLoader() {
  useCloudinaryData();

  // This component doesn't render anything, it just loads the data
  return null;
}
