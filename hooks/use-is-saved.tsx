import { useState, useEffect } from "react";

export function useIsSaved(initialSaved = true) {
  const [isSaved, setIsSaved] = useState(initialSaved);

  // Optional: Warn user if they try to leave with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      if (!isSaved) {
        e.preventDefault();
        e.returnValue = ""; // Standard way to trigger a confirmation
      }
    };

    console.log(isSaved)

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isSaved]);

  return {
    isSaved,
    setIsSaved
  };
}
