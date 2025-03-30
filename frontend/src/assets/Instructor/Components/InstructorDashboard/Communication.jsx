/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  MessageCircle,
  Send,
  Search,
  Filter,
  User,
  Mail,
  CheckCircle,
  Clock,
  Star,
  ChevronDown,
  Paperclip,
  Plus,
  Settings,
  ArrowRight,
  Bell,
} from "lucide-react";
import Loader from "../../../Utils/Loader";

const Communication = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedFilter, setExpandedFilter] = useState(false);

  // Sample data for communication components
  const communicationData = {
    messages: [
      {
        id: 1,
        user: {
          name: "Priya Sharma",
          avatar: "/avatars/priya.jpg",
          course: "React Fundamentals",
        },
        unread: true,
        timestamp: "10:45 AM",
        preview: "I'm having trouble with the async functions in Module 3...",
        conversation: [
          {
            sender: "student",
            message:
              "Hello professor, I'm having trouble with the async functions in Module 3. Could you please help me understand the concept better?",
            time: "10:45 AM",
          },
        ],
      },
      {
        id: 2,
        user: {
          name: "Rahul Verma",
          avatar: "/avatars/rahul.jpg",
          course: "Python Masterclass",
        },
        unread: false,
        timestamp: "Yesterday",
        preview:
          "Thank you for the feedback on my project. I've made the changes...",
        conversation: [
          {
            sender: "student",
            message:
              "I submitted my project yesterday. Looking forward to your feedback!",
            time: "2 days ago",
          },
          {
            sender: "instructor",
            message:
              "Hi Rahul, I've reviewed your project. Good work overall, but you need to improve error handling in your code. Also, please add more comments to explain complex logic.",
            time: "Yesterday, 1:30 PM",
          },
          {
            sender: "student",
            message:
              "Thank you for the feedback on my project. I've made the changes you suggested and resubmitted. Please let me know if there's anything else I need to improve.",
            time: "Yesterday, 4:15 PM",
          },
        ],
      },
      {
        id: 3,
        user: {
          name: "Ankit Patel",
          avatar: "/avatars/ankit.jpg",
          course: "Web Development",
        },
        unread: true,
        timestamp: "2 days ago",
        preview: "Could you provide more examples of responsive layouts?",
        conversation: [
          {
            sender: "student",
            message:
              "Could you provide more examples of responsive layouts? I'm struggling with the concepts discussed in last week's lecture.",
            time: "2 days ago",
          },
        ],
      },
      {
        id: 4,
        user: {
          name: "Meera Desai",
          avatar: "/avatars/meera.jpg",
          course: "UX Design",
        },
        unread: false,
        timestamp: "3 days ago",
        preview: "I've submitted my final project for review...",
        conversation: [
          {
            sender: "student",
            message:
              "I've submitted my final project for review. I focused on improving the user flow as you suggested in our last discussion.",
            time: "3 days ago, 2:15 PM",
          },
          {
            sender: "instructor",
            message:
              "Great! I'll take a look at it this week and provide feedback. Thanks for implementing those suggestions.",
            time: "3 days ago, 3:20 PM",
          },
        ],
      },
    ],
    announcements: [
      {
        id: 1,
        title: "Python Masterclass: Live Session Scheduled",
        date: "Today",
        content:
          "Dear students, I've scheduled a live session for this Friday at 3 PM to cover advanced database operations. Looking forward to your participation!",
        course: "Python Masterclass",
        sentTo: 92,
        responses: 14,
      },
      {
        id: 2,
        title: "React Fundamentals: Mid-course Survey",
        date: "Yesterday",
        content:
          "Please take a few minutes to complete the mid-course survey. Your feedback helps me improve the course content and delivery.",
        course: "React Fundamentals",
        sentTo: 65,
        responses: 28,
      },
      {
        id: 3,
        title: "Web Development: Additional Resources",
        date: "3 days ago",
        content:
          "I've added some additional resources for learning CSS Grid and Flexbox in the resources section. These should help you with the upcoming project.",
        course: "Web Development",
        sentTo: 87,
        responses: 42,
      },
    ],
    templates: [
      {
        id: 1,
        title: "Assignment Feedback",
        content:
          "Hi [Student Name], Thank you for submitting your assignment. Here's my feedback: [Feedback]. Let me know if you have any questions.",
      },
      {
        id: 2,
        title: "Course Welcome",
        content:
          "Welcome to [Course Name]! I'm excited to have you join us. Please review the syllabus and introduce yourself in the discussion forum.",
      },
      {
        id: 3,
        title: "Follow-up on Question",
        content:
          "Hi [Student Name], I'm checking in regarding your question about [Topic]. Have you had a chance to review the additional resources I shared? Let me know if you need further clarification.",
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

  const sendMessage = () => {
    if (!messageText.trim() || !selectedMessage) return;

    // In a real app, you would send this to an API
    console.log("Sending message:", messageText);

    // Update the conversation locally for demo purposes
    const updatedMessages = communicationData.messages.map((msg) => {
      if (msg.id === selectedMessage.id) {
        return {
          ...msg,
          conversation: [
            ...msg.conversation,
            {
              sender: "instructor",
              message: messageText,
              time: "Just now",
            },
          ],
        };
      }
      return msg;
    });

    // Update the selected message
    const updatedSelectedMessage = updatedMessages.find(
      (msg) => msg.id === selectedMessage.id
    );
    setSelectedMessage(updatedSelectedMessage);

    // Clear the message input
    setMessageText("");
  };

  const MessageItem = ({ message, isSelected }) => (
    <div
      className={`border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
        isSelected ? "bg-blue-50" : ""
      }`}
      onClick={() => setSelectedMessage(message)}
    >
      <div className="flex items-center">
        <div className="relative">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
            {message.user.name.charAt(0)}
          </div>
          {message.unread && (
            <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full"></div>
          )}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-center">
            <p
              className={`text-sm font-medium ${
                message.unread ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {message.user.name}
            </p>
            <p className="text-xs text-gray-500">{message.timestamp}</p>
          </div>
          <p className="text-xs text-gray-500 mb-1">{message.user.course}</p>
          <p
            className={`text-sm truncate ${
              message.unread ? "font-medium text-gray-800" : "text-gray-600"
            }`}
          >
            {message.preview}
          </p>
        </div>
      </div>
    </div>
  );

  const AnnouncementItem = ({ announcement }) => (
    <div className="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-start">
        <div className="p-2 bg-blue-100 rounded-md mr-3">
          <Bell size={18} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <p className="font-medium text-sm text-gray-900">
              {announcement.title}
            </p>
            <p className="text-xs text-gray-500">{announcement.date}</p>
          </div>
          <p className="text-xs text-gray-500 mb-2">{announcement.course}</p>
          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
            {announcement.content}
          </p>
          <div className="flex space-x-4 text-xs text-gray-500">
            <span>Sent to: {announcement.sentTo} students</span>
            <span>Responses: {announcement.responses}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const TemplateItem = ({ template }) => (
    <div className="border border-gray-200 rounded-md p-4 hover:shadow-sm transition-shadow mb-4">
      <div className="flex justify-between items-center mb-2">
        <p className="font-medium text-gray-900">{template.title}</p>
        <div className="flex space-x-2">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Settings size={14} />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-3 line-clamp-3">
        {template.content}
      </p>
      <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
        Use template <ArrowRight size={12} className="ml-1" />
      </button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-1">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">
            Communication
          </h1>
          <p className="text-gray-500">
            Manage all student interactions and course announcements in one
            place.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-3 text-sm font-medium flex items-center ${
                  activeTab === "messages"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("messages")}
              >
                <MessageCircle size={16} className="mr-2" />
                Messages
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium flex items-center ${
                  activeTab === "announcements"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("announcements")}
              >
                <Bell size={16} className="mr-2" />
                Announcements
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium flex items-center ${
                  activeTab === "templates"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("templates")}
              >
                <Mail size={16} className="mr-2" />
                Templates
              </button>
            </div>

            {/* Content areas based on active tab */}
            {activeTab === "messages" && (
              <div className="flex h-screen max-h-[calc(100vh-220px)]">
                {/* Left sidebar - message list */}
                <div className="w-1/3 border-r border-gray-200 overflow-hidden flex flex-col">
                  {/* Search and filter header */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative mb-2">
                      <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="absolute left-3 top-2.5 text-gray-400">
                        <Search size={16} />
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        className="flex items-center text-xs font-medium text-gray-600 hover:text-gray-900"
                        onClick={() => setExpandedFilter(!expandedFilter)}
                      >
                        <Filter size={14} className="mr-1" />
                        {filter === "all"
                          ? "All messages"
                          : filter === "unread"
                          ? "Unread"
                          : "By course"}
                        <ChevronDown size={14} className="ml-1" />
                      </button>
                      {expandedFilter && (
                        <div className="absolute z-10 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200">
                          <div className="py-1">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setFilter("all");
                                setExpandedFilter(false);
                              }}
                            >
                              All messages
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setFilter("unread");
                                setExpandedFilter(false);
                              }}
                            >
                              Unread
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setFilter("course");
                                setExpandedFilter(false);
                              }}
                            >
                              By course
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message list */}
                  <div className="overflow-y-auto flex-1">
                    {communicationData.messages
                      .filter((msg) => {
                        if (filter === "unread") return msg.unread;
                        // Additional filters can be added for courses
                        return true;
                      })
                      .filter(
                        (msg) =>
                          msg.user.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          msg.preview
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          msg.user.course
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                      )
                      .map((message) => (
                        <MessageItem
                          key={message.id}
                          message={message}
                          isSelected={
                            selectedMessage && selectedMessage.id === message.id
                          }
                        />
                      ))}
                  </div>
                </div>

                {/* Right area - message content */}
                <div className="w-2/3 flex flex-col">
                  {selectedMessage ? (
                    <>
                      {/* Conversation header */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 mr-3">
                            {selectedMessage.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {selectedMessage.user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {selectedMessage.user.course}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Conversation messages */}
                      <div className="flex-1 p-4 overflow-y-auto">
                        {selectedMessage.conversation.map((msg, index) => (
                          <div
                            key={index}
                            className={`mb-4 flex ${
                              msg.sender === "instructor"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-3/4 p-3 rounded-lg ${
                                msg.sender === "instructor"
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <p className="text-sm">{msg.message}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.sender === "instructor"
                                    ? "text-blue-100"
                                    : "text-gray-500"
                                }`}
                              >
                                {msg.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message input */}
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-1 relative">
                            <textarea
                              className="w-full border border-gray-200 rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Type your message..."
                              rows="2"
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  sendMessage();
                                }
                              }}
                            ></textarea>
                            <button className="absolute right-2 bottom-2 text-gray-400 hover:text-gray-600">
                              <Paperclip size={18} />
                            </button>
                          </div>
                          <button
                            className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            onClick={sendMessage}
                          >
                            <Send size={18} />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center flex-col p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No conversation selected
                      </h3>
                      <p className="text-gray-500 max-w-md">
                        Select a message from the list to view the conversation.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "announcements" && (
              <div className="h-screen max-h-[calc(100vh-220px)] flex">
                {/* Announcements list */}
                <div className="w-2/3 border-r border-gray-200 overflow-hidden flex flex-col">
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                    <div className="relative w-64">
                      <input
                        type="text"
                        placeholder="Search announcements..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute left-3 top-2.5 text-gray-400">
                        <Search size={16} />
                      </div>
                    </div>
                    <button className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors flex items-center">
                      <Plus size={16} className="mr-1" />
                      New Announcement
                    </button>
                  </div>

                  <div className="overflow-y-auto flex-1">
                    {communicationData.announcements.map((announcement) => (
                      <AnnouncementItem
                        key={announcement.id}
                        announcement={announcement}
                      />
                    ))}
                  </div>
                </div>

                {/* Announcement details / editor would go here */}
                <div className="w-1/3 p-4">
                  <div className="border border-dashed border-gray-300 rounded-md h-full flex items-center justify-center">
                    <div className="text-center p-6">
                      <Bell size={24} className="mx-auto text-gray-400 mb-2" />
                      <h3 className="text-gray-700 font-medium mb-1">
                        Create or select an announcement
                      </h3>
                      <p className="text-sm text-gray-500">
                        Send important updates to all your students
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "templates" && (
              <div className="p-6 h-screen max-h-[calc(100vh-220px)] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Message Templates
                  </h3>
                  <button className="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors flex items-center">
                    <Plus size={16} className="mr-1" />
                    New Template
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {communicationData.templates.map((template) => (
                    <TemplateItem key={template.id} template={template} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Communication;
