/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  SettingsOutlined,
  EmailOutlined,
  LockOutlined,
  SecurityOutlined,
  DeleteOutline,
  VisibilityOutlined,
  BlockOutlined,
  CircleNotificationsOutlined,
  LanguageOutlined,
  ScheduleOutlined,
  LinkOutlined,
} from "@mui/icons-material";
import { Divider, Switch } from "@mui/material";
import Navbar from "../../../Utils/Navbar";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    profileVisibility: "public",
    activityStatus: true,
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    language: "en",
    timezone: "UTC+00:00",
  });

  const [connectedAccounts, setConnectedAccounts] = useState([
    { provider: "google", connected: true },
    { provider: "facebook", connected: false },
    { provider: "github", connected: true },
  ]);

  const handleToggle = (field) => {
    setSettings({ ...settings, [field]: !settings[field] });
  };

  const handleAccountToggle = (provider) => {
    setConnectedAccounts(
      connectedAccounts.map((account) =>
        account.provider === provider
          ? { ...account, connected: !account.connected }
          : account
      )
    );
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = localStorage.getItem("userData");

      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Navbar />
      <div className="flex items-center mb-8">
        <SettingsOutlined className="text-gray-500 mr-2" />
        <h1 className="text-2xl font-medium text-gray-900">Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Account Settings */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <SecurityOutlined className="text-gray-400 mr-3" />
            <h2 className="text-lg font-medium text-gray-800">
              Account Security
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <EmailOutlined className="text-gray-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    Email Address
                  </h3>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Change
              </button>
            </div>

            <SettingItem
              icon={<LockOutlined className="text-gray-400" />}
              title="Change Password"
              description="Last changed 3 months ago"
              action={
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Change
                </button>
              }
            />

            <SettingItem
              icon={<SecurityOutlined className="text-gray-400" />}
              title="Two-Factor Authentication"
              description="Add an extra layer of security"
              action={
                <Switch
                  checked={settings.twoFactorEnabled}
                  onChange={() => handleToggle("twoFactorEnabled")}
                  color="primary"
                />
              }
            />

            <SettingItem
              icon={<DeleteOutline className="text-gray-400" />}
              title="Delete Account"
              description="Permanently remove your account"
              action={
                <button className="text-sm text-red-600 hover:text-red-800">
                  Delete
                </button>
              }
            />
          </div>
        </div>

        <Divider className="bg-gray-100" />

        {/* Privacy Settings */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <VisibilityOutlined className="text-gray-400 mr-3" />
            <h2 className="text-lg font-medium text-gray-800">Privacy</h2>
          </div>

          <div className="space-y-4">
            <SettingItem
              title="Profile Visibility"
              description="Who can see your profile"
              action={
                <select
                  value={settings.profileVisibility}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profileVisibility: e.target.value,
                    })
                  }
                  className="text-sm border border-gray-200 rounded px-2 py-1 bg-white"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              }
            />

            <SettingItem
              icon={<BlockOutlined className="text-gray-400" />}
              title="Blocked Users"
              description="3 users blocked"
              action={
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Manage
                </button>
              }
            />

            <SettingItem
              title="Activity Status"
              description="Show when you're online"
              action={
                <Switch
                  checked={settings.activityStatus}
                  onChange={() => handleToggle("activityStatus")}
                  color="primary"
                />
              }
            />
          </div>
        </div>

        <Divider className="bg-gray-100" />

        {/* Notification Settings */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <CircleNotificationsOutlined className="text-gray-400 mr-3" />
            <h2 className="text-lg font-medium text-gray-800">Notifications</h2>
          </div>
        </div>

        <Divider className="bg-gray-100" />

        {/* Language & Region */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <LanguageOutlined className="text-gray-400 mr-3" />
            <h2 className="text-lg font-medium text-gray-800">
              Language & Region
            </h2>
          </div>

          <div className="space-y-4">
            <SettingItem
              title="Language"
              action={
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                  className="text-sm border border-gray-200 rounded px-2 py-1 bg-white"
                >
                  <option value="en">English</option>
                  <option value="en">Hindi</option>
                </select>
              }
            />

            <SettingItem
              icon={<ScheduleOutlined className="text-gray-400" />}
              title="Time Zone"
              action={
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings({ ...settings, timezone: e.target.value })
                  }
                  className="text-sm border border-gray-200 rounded px-2 py-1 bg-white"
                >
                  <option value="UTC+00:00">UTC (GMT)</option>
                  <option value="UTC-05:00">Eastern Time (ET)</option>
                  <option value="UTC-08:00">Pacific Time (PT)</option>
                  <option value="UTC+01:00">Central European Time (CET)</option>
                </select>
              }
            />
          </div>
        </div>

        <Divider className="bg-gray-100" />

        {/* Connected Accounts */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <LinkOutlined className="text-gray-400 mr-3" />
            <h2 className="text-lg font-medium text-gray-800">
              Connected Accounts
            </h2>
          </div>

          <div className="space-y-4">
            {connectedAccounts.map((account) => (
              <SettingItem
                key={account.provider}
                title={`${
                  account.provider.charAt(0).toUpperCase() +
                  account.provider.slice(1)
                }`}
                action={
                  <Switch
                    checked={account.connected}
                    onChange={() => handleAccountToggle(account.provider)}
                    color="primary"
                  />
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable setting item component
const SettingItem = ({ icon, title, description, action }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      {icon && <span className="mr-3">{icon}</span>}
      <div>
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    </div>
    <div className="ml-4">{action}</div>
  </div>
);

export default Settings;
