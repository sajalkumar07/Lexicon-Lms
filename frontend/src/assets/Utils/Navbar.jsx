// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { logoutUser } from "../Candidate/Services/userAuth";
import Loader from "../Utils/Loader";

const Navbar = () => {
  const [fabOpen, setFabOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasInstructorAccess, setHasInstructorAccess] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("/");

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Check login status and instructor access on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = localStorage.getItem("userData");
      const authToken = localStorage.getItem("authToken");
      const instructorData = localStorage.getItem("instructorData");

      if (userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      }

      if (authToken && instructorData) {
        setHasInstructorAccess(true);
      }
    };
    checkLoginStatus();
  }, []);

  // Set active tab based on current location
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

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

  const toggleFab = () => {
    setFabOpen(!fabOpen);
  };

  const closeFab = () => {
    setFabOpen(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      localStorage.removeItem("userData");
      setIsLoggedIn(false);
      setUser(null);
      setShowProfileMenu(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavClick = (path) => {
    setActiveTab(path);
  };

  const handleInstructorClick = () => {
    const authToken = localStorage.getItem("authToken");
    const instructorData = localStorage.getItem("instructorData");
    if (authToken && instructorData) {
      navigate("/instructor-dashboard");
    } else {
      navigate("/login-instructor");
    }
  };

  const fabItems = [
    { icon: <HomeIcon />, label: "Home", link: "/" },
    { icon: <SchoolIcon />, label: "Courses", link: "/get-courses" },
    { icon: <LocalLibraryIcon />, label: "My Learning", link: "/my-learning" },
    {
      icon: <AutoStoriesIcon />,
      label: hasInstructorAccess ? "Instructor" : "Become Mentor",
      onClick: handleInstructorClick,
      link: hasInstructorAccess ? "/instructor-dashboard" : "/login-instructor",
    },
    { icon: <BookmarkIcon />, label: "Wishlist", link: "/wishlist" },
    { icon: <ShoppingCartIcon />, label: "My Cart", link: "/Cart" },
  ];

  // Updated navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/get-courses" },
    { name: "My Learning", path: "/my-learning" },
    {
      name: hasInstructorAccess ? "Instructor" : "Become Mentor",
      path: hasInstructorAccess ? "/instructor-dashboard" : "/login-instructor",
      onClick: handleInstructorClick,
    },
  ];

  return (
    <div>
      <main>
        <nav className="fixed top-0 left-0 w-full bg-gradient-to-br from-gray-900 to-gray-800  z-40 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <header className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center">
                <div className="flex items-center">
                  <div className="relative">
                    <span className="absolute inset-0 bg-orange-500 rounded-md bg-gradient-to-r from-orange-600 via-orange-400 to-orange-700 "></span>
                    <h1 className="relative text-2xl font-bold text-white py-1 px-2 rounded-lg">
                      <span className="text-gray-900 text-2xl font-bold">
                        L
                      </span>
                      <span className="text-gray-100 text-xl">EXICON</span>
                    </h1>
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:block  ">
                <ul className="flex justify-between items-center gap-8">
                  {navItems.map((item) => (
                    <li
                      key={item.path}
                      className={`relative group cursor-pointer text-sm font-medium transition-all duration-300 ${
                        activeTab === item.path
                          ? "text-orange-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                      onClick={() => {
                        if (item.onClick) {
                          item.onClick();
                        } else {
                          handleNavClick(item.path);
                          navigate(item.path);
                        }
                      }}
                    >
                      {item.name}
                      <span
                        className={`absolute left-0 bottom-0 block h-0.5 bg-orange-500 transition-all duration-300 ${
                          activeTab === item.path
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }`}
                      ></span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Desktop Login/User Info */}
              <div className="hidden md:flex justify-between items-center gap-4 text-sm font-semibold">
                {" "}
                <div className="flex justify-center items-center gap-2">
                  <button className="text-white">
                    <FavoriteBorderOutlinedIcon fontSize="small" />
                  </button>

                  <button className="text-white ">
                    <ShoppingCartOutlinedIcon fontSize="small" />
                  </button>
                </div>
                {isLoggedIn ? (
                  <div
                    className="flex items-center gap-4 relative"
                    ref={menuRef}
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-full py-1 px-3 transition-all duration-300"
                      onClick={toggleProfileMenu}
                    >
                      <span className="text-gray-300 text-xs">{user.name}</span>
                      <Avatar
                        alt={user.name || "User"}
                        src={user.avatar || ""}
                        sx={{ width: 28, height: 28 }}
                        className="cursor-pointer border-2 border-orange-500"
                      />
                    </div>

                    {/* Profile dropdown menu */}
                    {showProfileMenu && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl py-1 z-50 border border-gray-700 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                          <p className="text-sm font-medium text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {user.email || "user@example.com"}
                          </p>
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                        >
                          <PersonIcon
                            style={{ fontSize: "16px" }}
                            className="mr-3 text-gray-400"
                          />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                        >
                          <SettingsIcon
                            style={{ fontSize: "16px" }}
                            className="mr-3 text-gray-400"
                          />
                          Settings
                        </Link>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                          disabled={isLoggingOut}
                        >
                          {isLoggingOut ? (
                            <img
                              src={Loader}
                              alt="Logging out"
                              className="h-4 w-4 mr-3"
                            />
                          ) : (
                            <LogoutIcon
                              className="mr-3 text-gray-400"
                              style={{ fontSize: "16px" }}
                            />
                          )}
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center items-center gap-3">
                    <Link to="/login">
                      <button className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg">
                        Join Now
                      </button>
                    </Link>
                  </div>
                )}{" "}
              </div>

              {/* Mobile User Avatar or Join Button */}
              <div
                className="md:hidden relative"
                ref={isMobile ? menuRef : null}
              >
                {isLoggedIn ? (
                  <div className="flex items-center">
                    <Avatar
                      alt={user?.name || "User"}
                      src={user?.avatar || ""}
                      sx={{ width: 32, height: 32 }}
                      className="cursor-pointer border-2 border-orange-500"
                      onClick={toggleProfileMenu}
                    />

                    {/* Mobile Profile dropdown menu */}
                    {showProfileMenu && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl py-1 z-50 border border-gray-700 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                          <p className="text-sm font-medium text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {user.email || "user@example.com"}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                        >
                          <PersonIcon
                            style={{ fontSize: "16px" }}
                            className="mr-3 text-gray-400"
                          />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                        >
                          <SettingsIcon
                            style={{ fontSize: "16px" }}
                            className="mr-3 text-gray-400"
                          />
                          Settings
                        </Link>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                          disabled={isLoggingOut}
                        >
                          {isLoggingOut ? (
                            <img
                              src={Loader}
                              alt="Logging out"
                              className="h-4 w-4 mr-3"
                            />
                          ) : (
                            <LogoutIcon
                              className="mr-3 text-gray-400"
                              style={{ fontSize: "16px" }}
                            />
                          )}
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center items-center gap-3">
                    <Link to="/login">
                      <button className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg">
                        Join Now
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </header>
          </div>
        </nav>

        {/* FAB Navigation for Mobile */}
        {isMobile && (
          <>
            {/* Backdrop when FAB is open */}
            <Backdrop
              sx={{ color: "#fff", zIndex: 45 }}
              open={fabOpen}
              onClick={closeFab}
            />

            {/* Main FAB Button with Animated Hamburger/X Icon */}
            <Fab
              color="primary"
              aria-label="menu"
              sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                zIndex: 50,
                bgcolor: fabOpen ? "#ef4444" : "#f97316",
                "&:hover": {
                  bgcolor: fabOpen ? "#dc2626" : "#ea580c",
                },
                transition: "background-color 0.3s",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
              onClick={toggleFab}
            >
              {/* Animated Hamburger to X Icon */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <span
                  className={`absolute block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out 
                            ${fabOpen ? "rotate-45" : "translate-y-[-5px]"}`}
                />
                <span
                  className={`absolute block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out 
                            ${fabOpen ? "opacity-0" : "opacity-100"}`}
                />
                <span
                  className={`absolute block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out 
                            ${fabOpen ? "-rotate-45" : "translate-y-[5px]"}`}
                />
              </div>
            </Fab>

            {/* FAB Menu Items */}
            {fabItems.map((item, index) => (
              <Zoom
                key={index}
                in={fabOpen}
                style={{
                  transitionDelay: fabOpen ? `${(index + 1) * 50}ms` : "0ms",
                }}
              >
                <Fab
                  onClick={() => {
                    closeFab();
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      setActiveTab(item.link);
                      navigate(item.link);
                    }
                  }}
                  size="small"
                  color="secondary"
                  aria-label={item.label}
                  sx={{
                    position: "fixed",
                    bottom: 16 + (index + 1) * 60,
                    right: 16,
                    zIndex: 50,
                    bgcolor: activeTab === item.link ? "#f97316" : "#1f2937",
                    color: "white",
                    "&:hover": {
                      bgcolor: activeTab === item.link ? "#ea580c" : "#111827",
                    },
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {item.icon}
                </Fab>
              </Zoom>
            ))}

            {/* FAB Labels */}
            {fabItems.map((item, index) => (
              <div
                key={`label-${index}`}
                className={`fixed z-50 bg-gray-800 text-white text-sm py-1 px-3 rounded-md transition-all duration-300 ease-in-out shadow-lg ${
                  fabOpen
                    ? "opacity-100 right-4 translate-x-[-60px]"
                    : "opacity-0 right-16 translate-x-[20px]"
                }`}
                style={{
                  bottom: 16 + (index + 1) * 60,
                  borderLeft:
                    activeTab === item.link ? "2px solid #f97316" : "none",
                }}
              >
                {item.label}
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default Navbar;
