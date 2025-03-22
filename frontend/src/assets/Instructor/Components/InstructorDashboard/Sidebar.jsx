/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  MessageSquare,
  BarChart,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Settings,
  User,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutInstructor } from "../../Services/instructorAuth";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";

const InstructorDashboardSidebar = ({ onExpandChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [hasInstructorData, setHasInstructorData] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [instructorName, setInstructorName] = useState("Instructor");
  const [instructorData, setInstructorData] = useState(null);
  const menuRef = useRef(null);
  const sidebarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Use localStorage to persist the expanded state
  const [isExpanded, setIsExpanded] = useState(() => {
    const savedState = localStorage.getItem("sidebarExpanded");
    return savedState ? JSON.parse(savedState) : false;
  });

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    // Initial check
    checkMobile();

    // Add resize event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check if instructor data exists in localStorage
  useEffect(() => {
    const storedInstructorData = localStorage.getItem("instructorData");

    if (storedInstructorData) {
      try {
        const parsedData = JSON.parse(storedInstructorData);
        setHasInstructorData(true);
        setIsLoggedIn(true);
        setInstructorData(parsedData);
        setInstructorName(parsedData.name || "Instructor");
      } catch (error) {
        console.error("Error parsing instructor data:", error);
        setHasInstructorData(false);
        setIsLoggedIn(false);
      }
    } else {
      setHasInstructorData(false);
      setIsLoggedIn(false);
    }
  }, []);

  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", JSON.stringify(isExpanded));
    if (onExpandChange) {
      onExpandChange(isExpanded);
    }
  }, [isExpanded, onExpandChange]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isMobile &&
        showMobileSidebar &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setShowMobileSidebar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, showMobileSidebar]);

  // Close the profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutInstructor();
      localStorage.removeItem("user");
      localStorage.removeItem("instructorData");
      setIsLoggedIn(false);
      setUser(null);
      setHasInstructorData(false);
      setShowProfileMenu(false);

      // Refresh the page after logout
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileSidebar(!showMobileSidebar);
    } else {
      setIsExpanded((prevState) => !prevState);
    }
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Close mobile sidebar after navigation
  const handleNavigation = () => {
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      {/* Mobile menu toggle button - only when sidebar is closed */}
      {isMobile && !showMobileSidebar && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md shadow-lg hover:bg-gray-800"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed z-40 h-screen font-roboto transition-all duration-300 ease-in-out ${
          isExpanded && !isMobile ? "w-60" : "w-16"
        } ${
          isMobile
            ? showMobileSidebar
              ? "translate-x-0 w-60"
              : "-translate-x-full"
            : "translate-x-0"
        }`}
      >
        <aside className="bg-gray-900 text-white h-full w-full relative flex flex-col shadow-xl">
          {/* Close button for mobile - inside the sidebar at the top-right */}
          {isMobile && showMobileSidebar && (
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 z-50  text-white p-2 "
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}

          {/* Toggle button for desktop - positioned at the right edge */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-12 bg-gray-900 rounded-r-md h-8 w-6 flex items-center justify-center shadow-2xl z-50"
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isExpanded ? (
                <ChevronLeft size={16} className="text-white" />
              ) : (
                <ChevronRight size={16} className="text-white" />
              )}
            </button>
          )}

          {/* Logo and Title */}
          <div className="text-xl font-bold border-b border-white/20 h-16 flex items-center px-4">
            <div className="flex items-center gap-2">
              {isExpanded || (isMobile && showMobileSidebar) ? (
                <span className="whitespace-nowrap text-2xl">
                  <span className="text-orange-400">L</span>exicon
                </span>
              ) : (
                <div className="space-x-1">
                  <span className="text-2xl text-orange-400">L</span>
                  <span className="text-2xl text-white">X</span>
                </div>
              )}
            </div>
          </div>

          <nav className="pt-8 flex flex-col flex-grow">
            {/* Dashboard */}
            <div className="mb-6">
              <Link to="/instructor-dashboard" onClick={handleNavigation}>
                <div
                  className={`flex items-center gap-4 p-2 transition-all duration-200 hover:bg-white/10 hover:border-l-[#2ad8ff] ${
                    location.pathname === "/Dashboard"
                      ? "border-l-4 border-[#2ad8ff]"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex justify-center items-center space-x-4">
                    <div className="flex-shrink-0">
                      <BarChart size={20} className="text-white" />
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded || (isMobile && showMobileSidebar)
                          ? "w-auto opacity-100"
                          : "w-0 opacity-0"
                      }`}
                    >
                      <span className="whitespace-nowrap">Dashboard</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Course Management */}
            <div className="mb-6">
              <Link to="/instructor/courses" onClick={handleNavigation}>
                <div
                  className={`flex gap-4 p-2 transition-all duration-200 hover:bg-white/10 hover:border-l-[#2ad8ff] ${
                    location.pathname === "/instructor/courses"
                      ? "border-l-4 border-[#2ad8ff]"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex justify-center items-center space-x-4">
                    <div className="flex-shrink-0">
                      <BookOpen size={20} className="text-white" />
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded || (isMobile && showMobileSidebar)
                          ? "w-auto opacity-100"
                          : "w-0 opacity-0"
                      }`}
                    >
                      <span className="whitespace-nowrap">
                        Course Management
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Communication */}
            <div className="mb-6">
              <Link to="/communication" onClick={handleNavigation}>
                <div
                  className={`flex items-center gap-4 p-2 transition-all duration-200 hover:bg-white/10 hover:border-l-[#2ad8ff] ${
                    location.pathname === "/communication"
                      ? "border-l-4 border-[#2ad8ff]"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex justify-center items-center space-x-4">
                    <div className="flex-shrink-0">
                      <MessageSquare size={20} className="text-white" />
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded || (isMobile && showMobileSidebar)
                          ? "w-auto opacity-100"
                          : "w-0 opacity-0"
                      }`}
                    >
                      <span className="whitespace-nowrap">Communication</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Help */}
            <div className="mb-6">
              <Link to="/help" onClick={handleNavigation}>
                <div
                  className={`flex items-center gap-4 p-2 transition-all duration-200 hover:bg-white/10 hover:border-l-[#2ad8ff] ${
                    location.pathname === "/help"
                      ? "border-l-4 border-[#2ad8ff]"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex justify-center items-center space-x-4">
                    <div className="flex-shrink-0">
                      <HelpCircle size={20} className="text-white" />
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded || (isMobile && showMobileSidebar)
                          ? "w-auto opacity-100"
                          : "w-0 opacity-0"
                      }`}
                    >
                      <span className="whitespace-nowrap">Help</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Spacer to push user profile/login to bottom */}
            <div className="flex-grow"></div>

            {/* User Profile Section at bottom when logged in */}
            {hasInstructorData ? (
              <div className="mt-auto mb-4 relative" ref={menuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className={`w-full flex items-center justify-between p-2 transition-all duration-200 hover:bg-white/10 border-l-4 border-transparent hover:border-l-[#2ad8ff]`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Avatar
                        alt={instructorName}
                        src={instructorData?.avatar || ""}
                        sx={{ width: 28, height: 28 }}
                      />
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded || (isMobile && showMobileSidebar)
                          ? "w-auto opacity-100"
                          : "w-0 opacity-0"
                      }`}
                    >
                      <span className="whitespace-nowrap text-sm font-medium truncate max-w-32">
                        {instructorName}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Profile dropdown menu */}
                {showProfileMenu && (
                  <div className="absolute ml-2 bottom-full mb-1 left-0 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                      onClick={handleNavigation}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                      onClick={handleNavigation}
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                      disabled={isLoggingOut}
                    >
                      <LogoutIcon
                        className="mr-2"
                        style={{ fontSize: "16px" }}
                      />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login option when not logged in
              <div className="mt-auto mb-4">
                <Link
                  to="/login-instructor"
                  className={`w-full flex items-center gap-4 p-2 transition-all duration-200 hover:bg-white/10 border-l-4 border-transparent hover:border-l-orange-500`}
                  onClick={handleNavigation}
                >
                  <div className="flex-shrink-0">
                    <LogIn size={20} className="text-white" />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded || (isMobile && showMobileSidebar)
                        ? "w-auto opacity-100"
                        : "w-0 opacity-0"
                    }`}
                  >
                    <span className="whitespace-nowrap text-white font-medium">
                      Login
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </nav>
        </aside>
      </div>

      {/* Overlay for mobile */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}
    </>
  );
};

export default InstructorDashboardSidebar;
