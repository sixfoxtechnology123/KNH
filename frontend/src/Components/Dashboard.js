import React, { useState } from "react";
import { 
  UserPlus, 
  FileText, 
  ShieldCheck,
  Activity,
  Eye,
  EyeOff,
  KeyRound,
  LogOut
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../api/api";

import {
  masterDashboardShell,
  masterDashboardGradient,
  masterDashboardLayout,
  masterDashboardSimpleHeader,
  masterDashboardLogoContainer,
  masterDashboardAppName,
  masterDashboardAppSubtitle,
  masterDashboardMainContainer,
  masterDashboardMainOverlay,
  masterDashboardContentFlex,
  masterDashboardThreeCardsGrid,
  masterDashboardCardButton,
  masterDashboardIconPatients,
  masterDashboardIconBilling,
  masterDashboardIconAdmin,
  masterDashboardCardHeading,
} from "../GlobalComponent/masterPageStyles";

const Dashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const permissions = currentUser.permissions || {};
  const isAdmin = currentUser.role === "Admin";
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const canView = (key) => isAdmin || permissions[key]?.view;

  const openModule = (path, moduleName) => {
    localStorage.setItem("activeModule", moduleName);
    window.location.href = path; // Native routing, zero dependency issues
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      const response = await api.put("/auth/change-password", passwordData);
      if (response.data.success) {
        toast.success("Password changed successfully.");
        setShowPasswordModal(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className={masterDashboardShell}>
  

      {/* Overlay Soft Gradient */}
      <div className={masterDashboardGradient} />

      {/* Main Layout */}
      <div className={masterDashboardLayout}>
        
        {/* Simple Header */}
        <header className={masterDashboardSimpleHeader}>
          <div className="flex items-center gap-3">
            <div className={masterDashboardLogoContainer}>
             
            </div>

            <div className="flex flex-col leading-none">
              <h1
                className={masterDashboardAppName}
                style={{
                  fontFamily: "'Montserrat', 'Poppins', 'Inter', sans-serif",
                  letterSpacing: "0.20em",
                }}
              >
                KALYANI NURSING HOME
              </h1>
              <span
                className={masterDashboardAppSubtitle}
                style={{
                  fontFamily: "'Montserrat', 'Inter', sans-serif",
                }}
              >
                NURSING HOME & RESEARCH CENTRE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
            >
              <KeyRound size={14} /> Change Password
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        <main className={masterDashboardMainContainer}>
      

          {/* LIGHT OVERLAY */}
          <div className={masterDashboardMainOverlay} />

          {/* CONTENT */}
          <div className={masterDashboardContentFlex}>
            {/* Top Title */}
          

            {/* Dashboard Modules Grid */}
            <div className={masterDashboardThreeCardsGrid}>
              
              {/* 1. Patients Registration */}
              {canView("patients_registration") && (
                <button
                  type="button"
                  onClick={() => openModule("/patients-registration", "patients")}
                  className={masterDashboardCardButton}
                >
                  <div className={masterDashboardIconPatients}>
                    <UserPlus size={32} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className={masterDashboardCardHeading}>
                      Patients Registration
                    </h2>
                  </div>
                </button>
              )}

              {/* 2. Billing */}
              {canView("patients_billing") && (
                <button
                  type="button"
                  onClick={() => openModule("/patients-billing", "billing")}
                  className={masterDashboardCardButton}
                >
                  <div className={masterDashboardIconBilling}>
                    <FileText size={32} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className={masterDashboardCardHeading}>
                      Billing
                    </h2>
                  </div>
                </button>
              )}

              {/* 3. Admin Controller */}
              {canView("admin_controller") && (
                <button
                  type="button"
                  onClick={() => openModule("/admin-control", "admin")}
                  className={masterDashboardCardButton}
                >
                  <div className={masterDashboardIconAdmin}>
                    <ShieldCheck size={32} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className={masterDashboardCardHeading}>
                      Admin Controller
                    </h2>
                  </div>
                </button>
              )}

              {/* 4. Activity History */}
              {canView("activity_history") && (
                <button
                  type="button"
                  onClick={() => openModule("/activity-history", "activity")}
                  className={masterDashboardCardButton}
                >
                  <div className={masterDashboardIconAdmin}>
                    <Activity size={32} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className={masterDashboardCardHeading}>
                      Activity History
                    </h2>
                  </div>
                </button>
              )}

            </div>
          </div>
        </main>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl border border-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0a2540]">Change Password</h2>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-3">
              {[
                ["oldPassword", "Old Password", showOldPassword, setShowOldPassword],
                ["newPassword", "New Password", showNewPassword, setShowNewPassword],
                ["confirmPassword", "Confirm Password", showConfirmPassword, setShowConfirmPassword],
              ].map(([name, label, visible, setVisible]) => (
                <div key={name} className="relative">
                  <label className="mb-1 block text-xs font-bold text-slate-600">{label}</label>
                  <input
                    type={visible ? "text" : "password"}
                    value={passwordData[name]}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, [name]: e.target.value }))}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm focus:border-[#00b4d8] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]"
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute bottom-2.5 right-3 text-slate-400 hover:text-[#00b4d8]"
                  >
                    {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              ))}

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full rounded-lg bg-[#00b4d8] py-2.5 text-sm font-semibold text-white hover:bg-[#0096c7] disabled:opacity-60"
              >
                {changingPassword ? "Changing..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
