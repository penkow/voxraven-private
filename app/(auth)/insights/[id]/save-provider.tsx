import React, { createContext, useContext } from "react";
import { useIsSaved } from "../../../../hooks/use-is-saved";

type SavedContextType = ReturnType<typeof useIsSaved>;

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const savedState = useIsSaved();
  return (
    <SavedContext.Provider value={savedState}>{children}</SavedContext.Provider>
  );
}

export function useSaved(): SavedContextType {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error("useSaved must be used within a SavedProvider");
  }
  return context;
}
