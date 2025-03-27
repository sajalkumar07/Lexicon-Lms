import React, { useEffect, useState } from "react";
import Navbar from "../../../Utils/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Cat from "../../../Instructor/images/cat.jpg";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import useMediaQuery from "@mui/material/useMediaQuery";
import Loader from "../../../Utils/Loader";
import { fetchAllCourses } from "../../Services/getCourses";

const GetCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = React.useState("1");

  // Media queries for responsive design
  const isMobile = useMediaQuery("(max-width:640px)");

  // GET COURSES using the service
  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message || "An error occurred while fetching courses");
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  // HANDLE TAB CHANGE
  const handleChange = (event, newValue) => {
    setValue(newValue);
    // You could add category filtering here
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow">
        <section className="bg-gray-900">
          {/* Hero search section */}
          <div className="flex justify-center items-center px-4 py-20 md:py-16 lg:h-[20rem] flex-col space-y-6 md:space-y-9">
            <div className="relative w-full max-w-xl flex justify-between items-center">
              <input
                placeholder="Search your courses"
                className="w-full text-white placeholder-white px-5 py-2 rounded-md bg-gray-800 h-10 md:h-14 focus:outline-none"
                aria-label="Search courses"
              />
              <div className="py-2 px-3 cursor-pointer right-1 absolute transform-y-1/2 text-white">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
            </div>
          </div>

          {/* Main content area */}
          <main className="min-h-screen bg-gray-100 space-y-5 p-4 md:p-6">
            <div className="flex justify-center items-center text-center px-4">
              <h1 className="text-xl md:text-2xl font-semibold">
                Unlock Your <span className="text-orange-400">Potential</span>{" "}
                with Exciting Courses!
              </h1>
            </div>

            {/* Tabs section - scrollable on mobile */}
            <div className="w-full flex justify-center items-center">
              <TabContext value={value}>
                <div className="flex justify-center items-center overflow-auto p-4">
                  <style>{`
                    div::-webkit-scrollbar {
                      height: 4px;
                    }
                    div::-webkit-scrollbar-thumb {
                      background-color: #ccc;
                      border-radius: 4px;
                    }
                  `}</style>
                  <TabList
                    onChange={handleChange}
                    aria-label="course categories"
                    variant={isMobile ? "scrollable" : "standard"}
                    scrollButtons={isMobile ? "auto" : false}
                    allowScrollButtonsMobile
                    sx={{
                      "& .MuiTabs-flexContainer": {
                        gap: { xs: 1, sm: 2 },
                      },
                      minHeight: { xs: "40px", sm: "48px" },
                    }}
                  >
                    <Tab
                      label="MERN Stack"
                      value="1"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: { xs: "6px 12px", sm: "12px 16px" },
                        transition: "none",
                        "& .MuiTouchRipple-root": {
                          display: "none",
                        },
                      }}
                    />
                    <Tab
                      label="Python"
                      value="2"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: { xs: "6px 12px", sm: "12px 16px" },
                        transition: "none",
                        "& .MuiTouchRipple-root": {
                          display: "none",
                        },
                      }}
                    />
                    <Tab
                      label="Java Full Stack"
                      value="3"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: { xs: "6px 12px", sm: "12px 16px" },
                        transition: "none",
                        "& .MuiTouchRipple-root": {
                          display: "none",
                        },
                      }}
                    />
                    <Tab
                      label="Data Analyst"
                      value="4"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: { xs: "6px 12px", sm: "12px 16px" },
                        transition: "none",
                        "& .MuiTouchRipple-root": {
                          display: "none",
                        },
                      }}
                    />
                    <Tab
                      label="UX/UI Design"
                      value="5"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: { xs: "6px 12px", sm: "12px 16px" },
                        transition: "none",
                        "& .MuiTouchRipple-root": {
                          display: "none",
                        },
                      }}
                    />
                    <Tab
                      label="Android Development"
                      value="6"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: { xs: "6px 12px", sm: "12px 16px" },
                        transition: "none",
                        "& .MuiTouchRipple-root": {
                          display: "none",
                        },
                      }}
                    />
                  </TabList>
                </div>
              </TabContext>
            </div>

            {/* Course grid with simple loader */}
            {loading ? (
              <Loader>Getting Your Courses Ready... 🚀</Loader>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2 md:p-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {/* Course image section with difficulty badge */}
                    <div className="relative w-full h-40">
                      <img
                        src={Cat}
                        className="w-full h-full object-cover"
                        alt={course.title}
                      />
                      <div className="absolute top-0 right-0 bg-orange-500 rounded-bl text-white font-semibold text-xs px-2 py-1">
                        {course.difficulty || "Beginner"}
                      </div>
                    </div>

                    {/* Course content section with consistent padding */}
                    <div className="p-4 flex-grow flex flex-col">
                      {/* Course title */}
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {course.title}
                      </h3>

                      {/* Course category */}
                      <p className="text-sm text-gray-600 mb-2">
                        {course.category}
                      </p>

                      {/* Course description - now from API */}
                      <p className="text-sm text-gray-500 mb-4">
                        {course.description || "No description available."}
                      </p>

                      {/* Price and enroll section with consistent alignment */}
                      <div className="mt-auto flex justify-between items-center">
                        <div className="font-bold text-lg">₹{course.price}</div>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 font-semibold rounded-md text-sm">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="text-center p-4 text-red-500">
                <p>Error while fetching courses</p>
                <button
                  className="mt-2 bg-orange-400 text-white px-4 py-2 rounded"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            )}
          </main>
        </section>
      </div>
    </div>
  );
};

export default GetCourses;
