// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import IconButton from "@mui/material/IconButton";
import Backdrop from "@mui/material/Backdrop";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import InfoIcon from "@mui/icons-material/Info";
import ArticleIcon from "@mui/icons-material/Article";
import WorkIcon from "@mui/icons-material/Work";
import Avatar from "@mui/material/Avatar";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { logoutUser } from "../Candidate/Services/userAuth";
import Loader from "../Utils/Loader";

const Navbar = () => {
  const [fabOpen, setFabOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  // const navigate = useNavigate();

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Check login status on component mount
  useEffect(() => {
    // Check if user is logged in from localStorage or session
    const checkLoginStatus = () => {
      const userData = localStorage.getItem("userData");
      if (userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      }
    };

    checkLoginStatus();
  }, []);

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

  // Toggle FAB menu open/closed
  const toggleFab = () => {
    setFabOpen(!fabOpen);
  };

  // Close FAB menu
  const closeFab = () => {
    setFabOpen(false);
  };

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser(); // Call the updated logout function
      localStorage.removeItem("userData"); // Remove user data
      setIsLoggedIn(false);
      setUser(null);
      setShowProfileMenu(false);
      // navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const fabItems = [
    { icon: <HomeIcon />, label: "Home", link: "/" },
    { icon: <SchoolIcon />, label: "Courses", link: "/get-courses" },
    { icon: <InfoIcon />, label: "About", link: "/" },
    { icon: <ArticleIcon />, label: "Blog", link: "/" },
    { icon: <WorkIcon />, label: "Career", link: "/" },
  ];

  return (
    <div>
      <main className="">
        <nav className="fixed top-0 left-0 w-full p-3 bg-opacity-85 backdrop-blur-sm bg-gray-900 z-40 text-white">
          <header className="flex justify-between items-center h-8">
            <div className="flex items-center bg-gray-900 rounded-md p-2">
              <h1 className="text-xl font-bold text-white">
                <span className="text-orange-500">L</span>
                EXICON
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <ul className="flex justify-between items-center gap-8">
                <Link to="/">
                  <li className="relative group cursor-pointer">
                    Home
                    <span className="absolute left-1/2 bottom-0 block w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300 transform -translate-x-1/2"></span>
                  </li>
                </Link>
                <Link to="/get-courses">
                  <li className="relative group cursor-pointer">
                    <span className="absolute left-1/2 bottom-0 block w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300 transform -translate-x-1/2"></span>
                    Courses
                  </li>
                </Link>
                <li className="relative group cursor-pointer">
                  <span className="absolute left-1/2 bottom-0 block w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300 transform -translate-x-1/2"></span>
                  About
                </li>
                <li className="relative group cursor-pointer">
                  <span className="absolute left-1/2 bottom-0 block w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300 transform -translate-x-1/2"></span>
                  Blog
                </li>
                <li className="relative group cursor-pointer">
                  <span className="absolute left-1/2 bottom-0 block w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300 transform -translate-x-1/2"></span>
                  Career
                </li>
              </ul>
            </div>

            {/* Desktop Login/User Info */}
            <div className="hidden md:flex justify-between items-center gap-4 text-sm font-semibold">
              {isLoggedIn ? (
                <div className="flex items-center gap-4 relative" ref={menuRef}>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={toggleProfileMenu}
                  >
                    <span className="text-white">{user.name}</span>
                    <Avatar
                      alt={user?.name || "User"}
                      src={user?.avatar || ""}
                      sx={{ width: 32, height: 32 }}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Profile dropdown menu */}
                  {showProfileMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        <PersonIcon
                          style={{ fontSize: "16px" }}
                          className="mr-2"
                        />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        <SettingsIcon
                          style={{ fontSize: "16px" }}
                          className="mr-2"
                        />
                        Settings
                      </Link>
                      <div className="border-t border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <img
                            src={Loader}
                            alt="Logging out"
                            className="h-4 w-4 mr-2"
                          />
                        ) : (
                          <LogoutIcon
                            className="mr-2"
                            style={{ fontSize: "16px" }}
                          />
                        )}
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signup">
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600">
                    Join Now
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile User Avatar or Join Button */}
            <div className="md:hidden relative" ref={isMobile ? menuRef : null}>
              {isLoggedIn ? (
                <div className="flex items-center">
                  <Avatar
                    alt={user?.name || "User"}
                    src={user?.avatar || ""}
                    sx={{ width: 32, height: 32 }}
                    className="cursor-pointer"
                    onClick={toggleProfileMenu}
                  />

                  {/* Mobile Profile dropdown menu */}
                  {showProfileMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        <PersonIcon
                          style={{ fontSize: "16px" }}
                          className="mr-2"
                        />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        <SettingsIcon
                          style={{ fontSize: "16px" }}
                          className="mr-2"
                        />
                        Settings
                      </Link>
                      <div className="border-t border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <img
                            src={Loader}
                            alt="Logging out"
                            className="h-4 w-4 mr-2"
                          />
                        ) : (
                          <LogoutIcon
                            className="mr-2"
                            style={{ fontSize: "16px" }}
                          />
                        )}
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signup">
                  <button className="px-3 py-1 bg-orange-500  text-white rounded-full text-sm hover:bg-orange-600">
                    Join Now
                  </button>
                </Link>
              )}
            </div>
          </header>
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
                bgcolor: fabOpen ? "#ef4444" : "#f97316", // Orange when closed, red when open
                "&:hover": {
                  bgcolor: fabOpen ? "#dc2626" : "#ea580c",
                },
                transition: "background-color 0.3s",
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
                  component={Link}
                  to={item.link}
                  onClick={closeFab}
                  size="small"
                  color="secondary"
                  aria-label={item.label}
                  sx={{
                    position: "fixed",
                    bottom: 16 + (index + 1) * 60,
                    right: 16,
                    zIndex: 50,
                    bgcolor: "#1f2937", // Gray background
                    color: "white",
                    "&:hover": {
                      bgcolor: "#111827",
                    },
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
                className={`fixed z-50 bg-gray-800 text-white text-sm py-1 px-3 rounded-md transition-all duration-300 ease-in-out ${
                  fabOpen
                    ? "opacity-100 right-4 translate-x-[-60px]"
                    : "opacity-0 right-16 translate-x-[20px]"
                }`}
                style={{
                  bottom: 16 + (index + 1) * 60,
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
