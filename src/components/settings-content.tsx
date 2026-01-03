/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Bell,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState<
    "account" | "notifications" | "privacy" | "security"
  >("account");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [accountSettings, setAccountSettings] = useState({
    email: "john.doe@example.com",
    language: "en",
    timezone: "America/Los_Angeles",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    applicationUpdates: true,
    newOpportunities: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowRecruiterContact: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = (type: string) => {
    setSaveMessage(`${type} settings saved successfully!`);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Password change logic here
    setSaveMessage("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const tabs = [
    { id: "account", label: "Account", icon: Mail },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <div>
      {/* Success Message */}
      {saveMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-green-900 text-sm">{saveMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            {/* Account Settings */}
            {activeTab === "account" && (
              <div>
                <h2 className="text-gray-900 mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={accountSettings.email}
                      onChange={(e) =>
                        setAccountSettings({
                          ...accountSettings,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600"
                    />
                    <p className="text-gray-500 text-xs mt-2">
                      This is your primary email for account notifications
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">
                      Language
                    </label>
                    <select
                      value={accountSettings.language}
                      onChange={(e) =>
                        setAccountSettings({
                          ...accountSettings,
                          language: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">
                      Timezone
                    </label>
                    <select
                      value={accountSettings.timezone}
                      onChange={(e) =>
                        setAccountSettings({
                          ...accountSettings,
                          timezone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600"
                    >
                      <option value="America/Los_Angeles">
                        Pacific Time (PT)
                      </option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/New_York">
                        Eastern Time (ET)
                      </option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleSave("Account")}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-gray-900 mb-2">Delete Account</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-gray-900 mb-6">Notification Preferences</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-gray-900 text-sm mb-1">
                          Email Notifications
                        </p>
                        <p className="text-gray-500 text-xs">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-gray-900 text-sm mb-1">
                          Push Notifications
                        </p>
                        <p className="text-gray-500 text-xs">
                          Receive push notifications on your device
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            pushNotifications: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <p className="text-gray-900 text-sm mb-1">
                        Application Updates
                      </p>
                      <p className="text-gray-500 text-xs">
                        Get notified about your application status
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.applicationUpdates}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            applicationUpdates: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <p className="text-gray-900 text-sm mb-1">
                        New Opportunities
                      </p>
                      <p className="text-gray-500 text-xs">
                        Alerts for new internship opportunities
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.newOpportunities}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            newOpportunities: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <p className="text-gray-900 text-sm mb-1">
                        Weekly Digest
                      </p>
                      <p className="text-gray-500 text-xs">
                        Weekly summary of your activity
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.weeklyDigest}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            weeklyDigest: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-gray-900 text-sm mb-1">
                        Marketing Emails
                      </p>
                      <p className="text-gray-500 text-xs">
                        Receive tips and product updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.marketingEmails}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            marketingEmails: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <button
                    onClick={() => handleSave("Notification")}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <div>
                <h2 className="text-gray-900 mb-6">Privacy Settings</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          profileVisibility: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600"
                    >
                      <option value="public">Public - Anyone can view</option>
                      <option value="recruiters">Recruiters Only</option>
                      <option value="private">Private - Only you</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <p className="text-gray-900 text-sm mb-1">
                        Show Email Address
                      </p>
                      <p className="text-gray-500 text-xs">
                        Display your email on your public profile
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showEmail}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            showEmail: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <p className="text-gray-900 text-sm mb-1">
                        Show Phone Number
                      </p>
                      <p className="text-gray-500 text-xs">
                        Display your phone number on your public profile
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showPhone}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            showPhone: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-gray-900 text-sm mb-1">
                        Allow Recruiter Contact
                      </p>
                      <p className="text-gray-500 text-xs">
                        Let recruiters message you directly
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.allowRecruiterContact}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            allowRecruiterContact: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <button
                    onClick={() => handleSave("Privacy")}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div>
                <h2 className="text-gray-900 mb-6">Security Settings</h2>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg outline-none focus:border-blue-600"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg outline-none focus:border-blue-600"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg outline-none focus:border-blue-600"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Change Password
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-gray-900 mb-4">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Add an extra layer of security to your account by enabling
                    two-factor authentication.
                  </p>
                  <button className="px-6 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
