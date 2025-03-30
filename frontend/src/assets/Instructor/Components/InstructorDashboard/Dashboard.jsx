/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  User,
  BarChart3,
  Star,
  DollarSign,
  MessageCircle,
  BookOpen,
  Bell,
  Calendar,
  TrendingUp,
  Activity,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Loader from "../../../Utils/Loader";

const InstructorDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("monthly"); // monthly, quarterly, yearly
  const [selectedChart, setSelectedChart] = useState("revenue"); // revenue, students, engagement
  const [expandedNotification, setExpandedNotification] = useState(null);

  // Data directly embedded in the component
  const dashboardData = {
    stats: {
      revenue: 45250,
      students: 413,
      rating: 4.7,
      completionRate: 76,
      revenueTrend: 12.5,
      studentsTrend: 8.3,
      ratingTrend: 2.1,
      completionRateTrend: -3.8,
    },
    revenueData: [
      { name: "Jan", revenue: 5400 },
      { name: "Feb", revenue: 4200 },
      { name: "Mar", revenue: 6800 },
      { name: "Apr", revenue: 8700 },
      { name: "May", revenue: 7600 },
      { name: "Jun", revenue: 9200 },
    ],
    studentsData: [
      { name: "Jan", students: 45 },
      { name: "Feb", students: 32 },
      { name: "Mar", students: 67 },
      { name: "Apr", students: 78 },
      { name: "May", students: 89 },
      { name: "Jun", students: 102 },
    ],
    coursePerformance: [
      { name: "Web Development", students: 87, rating: 4.7, revenue: 8900 },
      { name: "React Fundamentals", students: 65, rating: 4.5, revenue: 6500 },
      { name: "Python Masterclass", students: 92, rating: 4.8, revenue: 9200 },
      { name: "UX Design", students: 43, rating: 4.3, revenue: 4300 },
    ],
    notifications: [
      {
        id: 1,
        type: "review",
        title: "New Review on React Fundamentals",
        message:
          "Excellent course! The concepts are well explained and the examples are practical.",
        rating: 5,
        user: "Priya Sharma",
        time: "2 hours ago",
        course: "React Fundamentals",
      },
      {
        id: 2,
        type: "enrollment",
        title: "New Student Enrolled",
        message: "Rahul Verma has enrolled in your Python Masterclass course.",
        user: "Rahul Verma",
        time: "5 hours ago",
        course: "Python Masterclass",
      },
      {
        id: 3,
        type: "question",
        title: "New Question on Web Development",
        message:
          "I'm having trouble with the responsive layout section. Could you provide additional examples?",
        user: "Ankit Patel",
        time: "Yesterday",
        course: "Web Development",
      },
      {
        id: 4,
        type: "review",
        title: "New Review on UX Design",
        message:
          "Good content but could use more practical exercises. The theoretical parts are strong.",
        rating: 4,
        user: "Meera Desai",
        time: "2 days ago",
        course: "UX Design",
      },
    ],
    upcomingSchedule: [
      {
        id: 1,
        title: "Live Session: React Hooks Deep Dive",
        description: "24 students registered",
        time: "Today, 2:00 PM",
        color: "blue",
      },
      {
        id: 2,
        title: "Q&A: Python Masterclass",
        description: "18 students registered",
        time: "Tomorrow, 11:00 AM",
        color: "green",
      },
      {
        id: 3,
        title: "Course Review: UX Design",
        description: "Content update deadline",
        time: "Fri, 10:30 AM",
        color: "purple",
      },
    ],
  };

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const CardStat = ({ title, value, icon, trend, color }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-medium mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-md ${color}`}>{icon}</div>
      </div>
      <div className="flex items-center mt-3">
        <div
          className={`text-xs font-medium ${
            trend >= 0 ? "text-green-600" : "text-red-600"
          } flex items-center`}
        >
          <TrendingUp
            size={14}
            className={`mr-1 ${trend >= 0 ? "" : "transform rotate-180"}`}
          />
          {Math.abs(trend)}% {trend >= 0 ? "increase" : "decrease"}
        </div>
        <p className="text-xs text-gray-500 ml-2">vs previous period</p>
      </div>
    </div>
  );

  const NotificationItem = ({ notification }) => {
    const isExpanded = expandedNotification === notification.id;
    const getIcon = (type) => {
      switch (type) {
        case "review":
          return <Star size={18} className="text-yellow-500" />;
        case "enrollment":
          return <User size={18} className="text-blue-500" />;
        case "question":
          return <MessageCircle size={18} className="text-green-500" />;
        default:
          return <Bell size={18} className="text-gray-500" />;
      }
    };

    return (
      <div className="border-b border-gray-100 p-3 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex items-start">
          <div className="p-2 bg-gray-100 rounded-md mr-3">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-900">
              {notification.title}
            </p>
            <p className="text-gray-500 text-xs mb-1">
              {notification.course} • {notification.time}
            </p>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? "max-h-24" : "max-h-0"
              }`}
            >
              <p className="text-sm text-gray-700 mt-2">
                {notification.message}
              </p>
              {notification.rating && (
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < notification.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                      fill={i < notification.rating ? "#F59E0B" : "none"}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() =>
              setExpandedNotification(isExpanded ? null : notification.id)
            }
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <ChevronDown
              size={16}
              className={`transform transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
    );
  };

  const ChartSection = () => {
    const chartData =
      selectedChart === "revenue"
        ? dashboardData.revenueData
        : dashboardData.studentsData;

    const dataKey = selectedChart === "revenue" ? "revenue" : "students";

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {selectedChart === "revenue" ? "Revenue" : "Students"} Overview
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedChart("revenue")}
              className={`px-3 py-1 text-xs rounded-md ${
                selectedChart === "revenue"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setSelectedChart("students")}
              className={`px-3 py-1 text-xs rounded-md ${
                selectedChart === "students"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Students
            </button>
          </div>
        </div>

        <div className="h-64">
          <div className="flex h-full items-end">
            {chartData.map((entry, index) => (
              <div key={index} className="flex-1 mx-1 group">
                <div className="relative h-full flex flex-col justify-end">
                  <div
                    className="bg-blue-500 w-full rounded-t-md group-hover:bg-blue-600 transition-all"
                    style={{
                      height: `${
                        (entry[dataKey] /
                          Math.max(
                            ...chartData.map((item) => item[dataKey] || 0)
                          )) *
                        100
                      }%`,
                      minHeight: "10px",
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {selectedChart === "revenue" ? "₹" : ""}
                      {entry[dataKey]}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-center mt-2 text-gray-500">
                  {entry.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-1">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">
            Instructor Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back! Here's an overview of your teaching performance.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
            <button
              className="text-red-600 hover:text-red-800 underline text-sm mt-2"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <CardStat
                title="Total Revenue"
                value={`₹${dashboardData.stats.revenue.toLocaleString()}`}
                icon={<DollarSign size={18} className="text-white" />}
                trend={dashboardData.stats.revenueTrend}
                color="bg-blue-500"
              />
              <CardStat
                title="Total Students"
                value={dashboardData.stats.students}
                icon={<User size={18} className="text-white" />}
                trend={dashboardData.stats.studentsTrend}
                color="bg-green-500"
              />
              <CardStat
                title="Avg. Rating"
                value={dashboardData.stats.rating}
                icon={<Star size={18} className="text-white" />}
                trend={dashboardData.stats.ratingTrend}
                color="bg-yellow-500"
              />
              <CardStat
                title="Completion Rate"
                value={`${dashboardData.stats.completionRate}%`}
                icon={<Activity size={18} className="text-white" />}
                trend={dashboardData.stats.completionRateTrend}
                color="bg-purple-500"
              />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Chart */}
              <div className="lg:col-span-2">
                {/* Revenue Chart */}
                <ChartSection />

                {/* Course Performance Table */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Course Performance
                    </h3>
                    <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                      View all courses <ArrowRight size={14} className="ml-1" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Students
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.coursePerformance.map(
                          (course, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {course.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {course.students}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                <div className="flex items-center">
                                  {course.rating}
                                  <Star
                                    size={14}
                                    className="text-yellow-500 ml-1"
                                    fill="#F59E0B"
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                ₹{course.revenue}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column - Notifications + Calendar */}
              <div className="lg:col-span-1">
                {/* Notifications Panel */}
                <div className="bg-white rounded-lg border border-gray-200 mb-6">
                  <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900">
                      Recent Activity
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2 py-0.5">
                      {dashboardData.notifications.length} new
                    </span>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {dashboardData.notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))}
                  </div>

                  <div className="p-3 border-t border-gray-100 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View all notifications
                    </button>
                  </div>
                </div>

                {/* Upcoming Schedule */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900">
                      Upcoming Schedule
                    </h3>
                  </div>

                  <div className="p-4">
                    {dashboardData.upcomingSchedule.map((event) => (
                      <div
                        key={event.id}
                        className={`mb-4 border-l-2 border-${event.color}-500 pl-3 pb-1`}
                      >
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          <span className="text-xs text-gray-500">
                            {event.time}
                          </span>
                        </div>
                        <p className="text-sm font-medium mt-1">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {event.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-gray-100 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View full calendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;
