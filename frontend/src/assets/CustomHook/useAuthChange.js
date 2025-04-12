// hooks/useAuthChange.js
import { useEffect } from "react";

const useAuthChange = (callback) => {
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "authToken" || e.key === "userData") {
        callback();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [callback]);
};

export default useAuthChange;
