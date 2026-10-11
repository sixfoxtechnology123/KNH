import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./Components/Dashboard";
import PatientsRegt from "./Components/PatientsReg";
import PatientsBilling from "./Components/PatientBilling";
import Login from "./Components/Login"; // <-- Added Login import
import AdminController from "./Components/AdminController";
import ActivityHistory from "./Components/ActivityHistory";

const ProtectedRoute = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/" replace />;
};

const PermissionRoute = ({ permissionKey, children }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const canView = currentUser.role === "Admin" || currentUser.permissions?.[permissionKey]?.view;
  if (!localStorage.getItem("token")) return <Navigate to="/" replace />;
  return canView ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Toaster
          reverseOrder={false}
          position="top-center"
          toastOptions={{
            style: {
              fontWeight: 600,
              fontSize: "13px",
              fontFamily: "sans-serif",
              maxWidth: "340px",
              width: "100%",
              borderRadius: "4px",
              padding: "6px 12px",
              boxShadow: "none",
              display: "flex",
              alignItems: "center",
            },
            success: {
              icon: (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#14532d" 
                  strokeWidth="2.5" 
                  className="w-4 h-4 flex-shrink-0"
                  style={{ marginRight: "6px" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              style: {
                background: "#f0fdf4",
                color: "#14532d",
                border: "1px solid #15803d",
              },
            },
            error: {
              icon: (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#991b1b" 
                  strokeWidth="2.5" 
                  className="w-4 h-4 flex-shrink-0"
                  style={{ marginRight: "6px" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              style: {
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #b91c1c",
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Login />} /> {/* <-- Added Login route */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/patients-registration" element={<PermissionRoute permissionKey="patients_registration"><PatientsRegt /></PermissionRoute>} />
          <Route path="/patients-billing" element={<PermissionRoute permissionKey="patients_billing"><PatientsBilling /></PermissionRoute>} />
          <Route path="/admin-control" element={<PermissionRoute permissionKey="admin_controller"><AdminController /></PermissionRoute>} />
          <Route path="/activity-history" element={<PermissionRoute permissionKey="activity_history"><ActivityHistory /></PermissionRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
