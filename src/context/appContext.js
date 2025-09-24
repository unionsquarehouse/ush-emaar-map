"use client";

import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [backButtonCallback, setBackButtonCallback] = useState(null);
  const [showBackButton, setShowBackButton] = useState(false);
  return (
    <AppContext.Provider
      value={{
        backButtonCallback,
        setBackButtonCallback,
        showBackButton,
        setShowBackButton,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
