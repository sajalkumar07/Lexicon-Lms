// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import { logoutUser } from "../Candidate/Services/userAuth";
import Loader from "../CommonComponent/Loader"; // Import the same loader used in Login component

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
      const userData = localStorage.getItem("user");
      if (userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      }
    };

    checkLoginStatus();
  }, []);

  // Toggle drawer open/closed
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsDrawerOpen(open);
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser(); // Call the updated logout function
      localStorage.removeItem("user"); // Remove user data
      setIsLoggedIn(false);
      setUser(null);
      // navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      <main className="">
        <nav className="fixed top-0 left-0 w-full p-3 bg-opacity-50 backdrop-blur-sm bg-gray-900 z-50 text-white">
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
                <div className="flex items-center gap-4">
                  <IconButton
                    color="inherit"
                    onClick={handleLogout}
                    title="Logout"
                    aria-label="logout"
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <img src={Loader} alt="Logging out" className="h-6 w-6" />
                    ) : (
                      <LogoutIcon />
                    )}
                  </IconButton>
                  <div className="flex items-center gap-2">
                    <span className="text-white">
                      {user?.name || user?.email}
                    </span>
                    <Avatar
                      alt={user?.name || "User"}
                      src={user?.avatar || ""}
                      sx={{ width: 32, height: 32 }}
                    />
                  </div>
                </div>
              ) : (
                <Link to="/signup">
                  <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                    Join Now
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <div className="md:hidden">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ padding: 0 }}
              >
                <MenuIcon />
              </IconButton>
            </div>
          </header>

          {/* MUI Drawer for Mobile Menu */}
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{
              sx: {
                width: 250,
                backgroundColor: "#111827", // bg-gray-900
                color: "white",
              },
            }}
          >
            <div className="flex justify-between p-4 items-center">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Avatar
                    alt={user?.name || "User"}
                    src={user?.avatar || ""}
                    sx={{ width: 32, height: 32 }}
                  />
                  <span className="text-white text-sm">
                    {user?.name || user?.email}
                  </span>
                </div>
              ) : (
                <Link to="/signup" onClick={toggleDrawer(false)}>
                  <button className="bg-orange-500 p-2 text-sm font-semibold rounded">
                    Join Now
                  </button>
                </Link>
              )}
              <IconButton
                color="inherit"
                onClick={toggleDrawer(false)}
                aria-label="close drawer"
              >
                <CloseIcon />
              </IconButton>
            </div>
            <div className="p-5">
              <ul className="flex flex-col py-4 gap-6">
                <Link to="/" onClick={toggleDrawer(false)}>
                  <li className="relative group cursor-pointer">
                    Home
                    <span className="absolute left-0 bottom-0 block w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
                  </li>
                </Link>
                <Link to="/get-courses" onClick={toggleDrawer(false)}>
                  <li className="relative group cursor-pointer">
                    <span className="absolute left-0 bottom-0 block w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
                    Courses
                  </li>
                </Link>
                <li className="relative group cursor-pointer">
                  <span className="absolute left-0 bottom-0 block w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
                  About
                </li>
                <li className="relative group cursor-pointer">
                  <span className="absolute left-0 bottom-0 block w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
                  Blog
                </li>
                <li className="relative group cursor-pointer">
                  <span className="absolute left-0 bottom-0 block w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
                  Career
                </li>
              </ul>

              {/* Mobile Logout Button */}
              {isLoggedIn && (
                <div className="mt-6 flex justify-center">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => {
                      handleLogout();
                      toggleDrawer(false)();
                    }}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <img src={Loader} alt="Logging out" className="h-6 w-6" />
                    ) : (
                      <>
                        <LogoutIcon fontSize="small" />
                        Logout
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </Drawer>
        </nav>
      </main>
    </div>
  );
};

export default Navbar;
