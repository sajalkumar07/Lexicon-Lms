/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  // Get initial sidebar state from localStorage if available
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const savedState = localStorage.getItem("sidebarExpanded");
    return savedState ? JSON.parse(savedState) : false;
  });

  // State to track screen size
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle sidebar state changes
  const handleSidebarChange = (expanded) => {
    setSidebarExpanded(expanded);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onExpandChange={handleSidebarChange} />
      <main
        className={`transition-all duration-300 ease-in-out flex-1 overflow-y-auto ${
          isMobile
            ? "w-full ml-0 px-2"
            : sidebarExpanded
            ? "ml-60 px-6"
            : "ml-16 px-6"
        }`}
      >
        <div className={`pt-4 ${isMobile ? "pt-16" : ""}`}>{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
