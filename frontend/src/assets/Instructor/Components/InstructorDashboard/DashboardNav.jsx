/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { BookOpen, MessageSquare, BarChart, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const InstructorDashboardSidebar = () => {
  const location = useLocation();

  return (
    <div
      className={
        "fixed z-40 h-screen font-roboto transition-all duration-500 ease-in-out w-60"
      }
    >
      <aside className="bg-gray-950 text-white h-full w-full relative">
        <div className="text-xl font-bold border-b border-white/20 h-16 flex items-center px-2 ">
          <Link to="/create-course" className="flex items-center">
            <div className="flex items-center gap-2 relative">
              <div className="flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out">
                <span className="whitespace-nowrap text-2xl">
                  <span className="text-orange-400">L</span>exicon Instructor
                </span>
              </div>
            </div>
          </Link>
        </div>

        <nav className="pt-8 flex flex-col">
          {/* Course Management */}
          <div className="mb-6">
            <Link to="/create-course">
              <div
                className={`flex gap-4 p-2 transition-all duration-200 hover:bg-white/10 ${
                  location.pathname === "/create-course"
                    ? "border-l-4 border-[#2ad8ff]"
                    : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex-shrink-0">
                  <BookOpen size={25} className="text-white" />
                </div>
                <div
                  className={
                    "overflow-hidden transition-all duration-300 ease-in-out"
                  }
                >
                  <span className="whitespace-nowrap">Course Management</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Communication */}
          <div className="mb-6">
            <Link to="/communication">
              <div
                className={`flex items-center gap-4 p-2 transition-all duration-200 hover:bg-white/10 ${
                  location.pathname === "/communication"
                    ? "border-l-4 border-[#2ad8ff]"
                    : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex-shrink-0">
                  <MessageSquare size={25} className="text-white" />
                </div>
                <div
                  className={
                    "overflow-hidden transition-all duration-300 ease-in-out"
                  }
                >
                  <span className="whitespace-nowrap">Communication</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Performance */}
          <div className="mb-6">
            <Link to="/performance">
              <div
                className={`flex items-center gap-4 p-2 transition-all duration-200 hover:bg-white/10 ${
                  location.pathname === "/performance"
                    ? "border-l-4 border-[#2ad8ff]"
                    : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex-shrink-0">
                  <BarChart size={25} className="text-white" />
                </div>
                <div
                  className={
                    "overflow-hidden transition-all duration-300 ease-in-out "
                  }
                >
                  <span className="whitespace-nowrap">Performance</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Help */}
          <div className="mb-6">
            <Link to="/help">
              <div
                className={`flex items-center gap-4 p-2 transition-all duration-200 hover:bg-white/10 ${
                  location.pathname === "/help"
                    ? "border-l-4 border-[#2ad8ff]"
                    : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex-shrink-0">
                  <HelpCircle size={25} className="text-white" />
                </div>
                <div
                  className={
                    "overflow-hidden transition-all duration-300 ease-in-ou"
                  }
                >
                  <span className="whitespace-nowrap">Help</span>
                </div>
              </div>
            </Link>
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default InstructorDashboardSidebar;
