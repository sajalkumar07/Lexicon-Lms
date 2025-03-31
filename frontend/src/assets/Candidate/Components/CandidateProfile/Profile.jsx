/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import EventIcon from "@mui/icons-material/Event";
import LockIcon from "@mui/icons-material/Lock";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LoginIcon from "@mui/icons-material/Login";
import Navbar from "../../../Utils/Navbar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    dob: "",
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
      facebook: "",
    },
  });

  useEffect(() => {
    const fetchUserData = () => {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setProfileData({
          name: parsedUserData.name || "",
          username:
            parsedUserData.username ||
            parsedUserData.name.split(" ")[0].toLowerCase() ||
            "",
          email: parsedUserData.email || "",
          phone: parsedUserData.phone || "",
          bio: parsedUserData.bio || "No bio added yet.",
          dob: parsedUserData.dob || "",
          socialLinks: parsedUserData.socialLinks || {
            linkedin: "",
            github: "",
            twitter: "",
            facebook: "",
          },
        });
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfileData({
        ...profileData,
        [parent]: {
          ...profileData[parent],
          [child]: value,
        },
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUserData = { ...user, ...profileData };
    localStorage.setItem("userData", JSON.stringify(updatedUserData));
    setUser(updatedUserData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-400"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 pt-24 pb-12">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-800 mb-3">
            Profile Not Available
          </h2>
          <p className="text-neutral-500 mb-6">
            Please log in to view your profile.
          </p>
          <Link to="/login">
            <button className="px-5 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-all flex items-center justify-center mx-auto">
              <LoginIcon className="mr-2" />
              Log In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const joinedDate = new Date(
    Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
  ).toLocaleDateString();
  const lastLogin = new Date(
    Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000
  ).toLocaleDateString();

  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Column - Profile Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-neutral-100">
            <div className="p-6 flex flex-col items-center border-b border-neutral-100">
              <div className="relative mb-4">
                <Avatar
                  alt={user.name || "User"}
                  src={user.avatar || ""}
                  sx={{ width: 96, height: 96 }}
                  className="border-2 border-neutral-200"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full text-neutral-700 hover:bg-neutral-50 transition-all shadow-sm border border-neutral-200">
                    <EditIcon style={{ fontSize: "16px" }} />
                  </button>
                )}
              </div>
              <h2 className="text-lg font-semibold text-neutral-900">
                {user.name}
              </h2>
              <p className="text-neutral-500 text-sm">
                @{profileData.username}
              </p>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-4 py-1.5 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-all text-sm flex items-center"
                >
                  <EditIcon className="mr-1" style={{ fontSize: "14px" }} />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="mt-4 px-4 py-1.5 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-all text-sm"
                >
                  Save Changes
                </button>
              )}
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-neutral-700 font-medium mb-3 text-xs uppercase tracking-wide">
                  Account Info
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-neutral-600 text-sm">
                    <EventIcon
                      className="text-neutral-400 mr-2"
                      style={{ fontSize: "16px" }}
                    />
                    <span>Joined {joinedDate}</span>
                  </div>
                  <div className="flex items-center text-neutral-600 text-sm">
                    <LoginIcon
                      className="text-neutral-400 mr-2"
                      style={{ fontSize: "16px" }}
                    />
                    <span>Last login {lastLogin}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <Link
                  to="/settings"
                  className="text-neutral-700 text-sm hover:text-neutral-900 transition-colors flex items-center"
                >
                  <LockIcon style={{ fontSize: "14px" }} className="mr-2" />
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Details */}
        <div className="md:col-span-3">
          <div className="bg-white  rounded-lg shadow-lg overflow-hidden border border-neutral-100">
            <div className="p-6 border-b border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-900">
                Profile Information
              </h2>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-neutral-700 font-medium mb-4 text-xs uppercase tracking-wide flex items-center">
                      <AccountBoxIcon
                        className="mr-2"
                        style={{ fontSize: "16px" }}
                      />
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-neutral-600 text-sm mb-1">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          />
                        ) : (
                          <p className="text-neutral-900">{profileData.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-neutral-600 text-sm mb-1">
                          Username
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="username"
                            value={profileData.username}
                            onChange={handleInputChange}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          />
                        ) : (
                          <p className="text-neutral-900">
                            @{profileData.username}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center text-neutral-600 text-sm mb-1">
                          <EmailIcon
                            className="mr-1"
                            style={{ fontSize: "14px" }}
                          />
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          />
                        ) : (
                          <p className="text-neutral-900">
                            {profileData.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center text-neutral-600 text-sm mb-1">
                          <PhoneIcon
                            className="mr-1"
                            style={{ fontSize: "14px" }}
                          />
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            placeholder="Optional"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          />
                        ) : (
                          <p className="text-neutral-500">
                            {profileData.phone || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center text-neutral-600 text-sm mb-1">
                          <CakeIcon
                            className="mr-1"
                            style={{ fontSize: "14px" }}
                          />
                          Date of Birth
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            name="dob"
                            value={profileData.dob}
                            onChange={handleInputChange}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          />
                        ) : (
                          <p className="text-neutral-500">
                            {profileData.dob || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-neutral-600 text-sm mb-1">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        placeholder="Tell us about yourself"
                      ></textarea>
                    ) : (
                      <p className="text-neutral-700">{profileData.bio}</p>
                    )}
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-neutral-700 font-medium mb-4 text-xs uppercase tracking-wide">
                      Social Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center text-neutral-600 text-sm mb-1">
                          <LinkedInIcon
                            className="mr-1"
                            style={{ fontSize: "14px" }}
                          />
                          LinkedIn
                        </label>
                        {isEditing ? (
                          <input
                            type="url"
                            name="socialLinks.linkedin"
                            value={profileData.socialLinks.linkedin}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          />
                        ) : (
                          <p className="text-neutral-500 truncate">
                            {profileData.socialLinks.linkedin || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center text-neutral-600 text-sm mb-1">
                          <GitHubIcon
                            className="mr-1"
                            style={{ fontSize: "14px" }}
                          />
                          GitHub
                        </label>
                        {isEditing ? (
                          <input
                            type="url"
                            name="socialLinks.github"
                            value={profileData.socialLinks.github}
                            onChange={handleInputChange}
                            placeholder="https://github.com/username"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          />
                        ) : (
                          <p className="text-neutral-500 truncate">
                            {profileData.socialLinks.github || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center text-neutral-600 text-sm mb-1">
                          <TwitterIcon
                            className="mr-1"
                            style={{ fontSize: "14px" }}
                          />
                          Twitter
                        </label>
                        {isEditing ? (
                          <input
                            type="url"
                            name="socialLinks.twitter"
                            value={profileData.socialLinks.twitter}
                            onChange={handleInputChange}
                            placeholder="https://twitter.com/username"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          />
                        ) : (
                          <p className="text-neutral-500 truncate">
                            {profileData.socialLinks.twitter || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center text-neutral-600 text-sm mb-1">
                          <FacebookIcon
                            className="mr-1"
                            style={{ fontSize: "14px" }}
                          />
                          Facebook
                        </label>
                        {isEditing ? (
                          <input
                            type="url"
                            name="socialLinks.facebook"
                            value={profileData.socialLinks.facebook}
                            onChange={handleInputChange}
                            placeholder="https://facebook.com/username"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                          />
                        ) : (
                          <p className="text-neutral-500 truncate">
                            {profileData.socialLinks.facebook || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-white text-neutral-700 rounded-md hover:bg-neutral-50 transition-all border border-neutral-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
