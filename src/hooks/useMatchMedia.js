import { useState, useEffect } from "react";

// (pointer: none): no pointing device is available (e.g., voice-controlled devices).

// (pointer: coarse): a pointing device is present, but it's not very precise (e.g., a finger on a touchscreen).

// (pointer: fine): a highly accurate pointing device is available (e.g., a mouse cursor).

export const useMatchMedia = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};
