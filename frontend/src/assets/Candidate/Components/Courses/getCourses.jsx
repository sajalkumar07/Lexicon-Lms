/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Navbar from "../../../CommonComponent/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { fetchCourses } from "../../Services/GetCourse";
import Cat from "../../../Instructor/images/cat.jpg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";

const GetCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = React.useState("1");

  //GET COURSES API

  const loadCourses = async () => {
    try {
      const data = await fetchCourses();
      setCourses(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to load courses");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  if (error) return <p>{error}</p>;

  //HANDLE TAB CHANGE
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //RENDER GET COURSES
  const renderCourse = (courses) => {
    if (loading) {
      // Skeleton loading while data is fetching
      return Array(5)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="p-1 border border-gray-300 rounded-md items-center flex justify-center flex-col animate-pulse"
          >
            <div className="w-full aspect-square rounded-md bg-gray-200"></div>
            <div className="p-4 text-center space-y-3 w-full">
              <div className="h-4 bg-gray-200 rounded-md w-3/4 mx-auto" />
              <div className="h-4 bg-gray-200 rounded-md  mx-auto" />
              <div className="h-4 bg-gray-200 rounded-md  mx-auto" />
              <div className="h-4 bg-gray-200 rounded-md  mx-auto" />
            </div>
            <div className="flex justify-between items-center w-full p-3">
              <span className=""></span>
              <span className="bg-gray-400 p-2 text-gray-400 font-semibold text-xs rounded-md">
                <AddShoppingCartRoundedIcon fontSize="small" />
                Add to Cart
              </span>
            </div>
          </div>
        ));
    }

    return courses.map((courses) => (
      <div
        key={courses.id}
        className="p-1 border border-gray-300 rounded-md items-center flex justify-center flex-col  "
      >
        <img src={Cat} className="w-full h-full rounded-md object-contain" />
        <div className="p-4 text-center text-black">
          <h3 className="text-1xl font-semibold">{courses.title}</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipising elit, sed do
            eiusmod tempor
          </p>
        </div>
        <div className="flex justify-between items-center w-full p-3">
          <span className="">4.5 ⭐</span>
          <div className="bg-orange-400 p-2 text-white font-semibold text-xs rounded-md hover:shadow-lg cursor-pointer transition-all  flex justify-center items-center space-x-10">
            <AddShoppingCartRoundedIcon fontSize="small" />
            Add to Cart
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="  min-h-screen">
      <div className="fixed z-50">
        <Navbar />
      </div>
      <div>
        <section className="bg-gray-900">
          <div className="flex justify-center items-center h-[20rem] flex-col space-y-9 ">
            <div className="relative w-[50%] flex justify-between items-center ">
              <input
                placeholder="Search your courses"
                className="w-full text-white placeholder-white px-5 py-2 rounded-md  bg-gray-800 h-14 focus:outline-none "
              ></input>
              <div className="py-2 px-2 cursor-pointer right-1 absolute transform-y-1/2 text-white">
                <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
              </div>
            </div>
            {/* <ul className="text-white flex justify-between space-x-10">
              <li className="cursor-pointer">C++</li>
              <li className="cursor-pointer">Python</li>
              <li className="cursor-pointer">Java Full Stack</li>
              <li className="cursor-pointer">Mern Full Stack</li>
              <li className="cursor-pointer">DSA</li>
              <li className="cursor-pointer">Javascript</li>
              <li className="cursor-pointer">Web Development </li>
            </ul> */}
          </div>
          <main className=" min-h-screen bg-gray-100 space-y-5  p-6">
            <div className="flex justify-center space-y-9 text-2xl font-semibold">
              <h1>
                Unlock Your <span className="text-orange-400">Potential</span>{" "}
                with Exciting Courses!
              </h1>
            </div>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <TabContext value={value}>
                <Box>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab
                      label="MERN Stack"
                      value="1"
                      sx={{
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
                        transition: "none",
                        "& .MuiTouchRipple-root": {
                          display: "none",
                        },
                      }}
                    />
                  </TabList>
                </Box>
              </TabContext>
            </Box>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 p-6  gap-4 items-center">
              {renderCourse(courses)}
            </div>
          </main>
        </section>
      </div>
    </div>
  );
};

export default GetCourses;
