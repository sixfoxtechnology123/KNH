import React from "react";
import { 
  UserPlus, 
  FileText, 
  ShieldCheck 
} from "lucide-react";

import logo from "./../Assets/ClinixLogo.jpeg";

import {
  masterDashboardShell,
  masterDashboardWatermark,
  masterDashboardGradient,
  masterDashboardLayout,
  masterDashboardSimpleHeader,
  masterDashboardLogoContainer,
  masterDashboardLogoBox,
  masterDashboardLogoImg,
  masterDashboardAppName,
  masterDashboardAppSubtitle,
  masterDashboardMainContainer,
  masterDashboardMainWatermark,
  masterDashboardMainOverlay,
  masterDashboardContentFlex,
  masterDashboardHubTitle,
  masterDashboardThreeCardsGrid,
  masterDashboardCardButton,
  masterDashboardIconPatients,
  masterDashboardIconBilling,
  masterDashboardIconAdmin,
  masterDashboardCardHeading,
  masterDashboardCardSubtext,
} from "../GlobalComponent/masterPageStyles";

const Dashboard = () => {
  const openModule = (path, moduleName) => {
    localStorage.setItem("activeModule", moduleName);
    window.location.href = path; // Native routing, zero dependency issues
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
        </header>

        <main className={masterDashboardMainContainer}>
      

          {/* LIGHT OVERLAY */}
          <div className={masterDashboardMainOverlay} />

          {/* CONTENT */}
          <div className={masterDashboardContentFlex}>
            {/* Top Title */}
          

            {/* Exactly 3 Big Icon Cards Grid */}
            <div className={masterDashboardThreeCardsGrid}>
              
              {/* 1. Patients Registration */}
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
                  <p className={masterDashboardCardSubtext}>
                    New OPD/IPD Patient Registry & Profiles
                  </p>
                </div>
              </button>

              {/* 2. Billing */}
              <button
                type="button"
                onClick={() => openModule("/billing", "billing")}
                className={masterDashboardCardButton}
              >
                <div className={masterDashboardIconBilling}>
                  <FileText size={32} strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className={masterDashboardCardHeading}>
                    Billing
                  </h2>
                  <p className={masterDashboardCardSubtext}>
                    Invoices, Receipts & Payments
                  </p>
                </div>
              </button>

              {/* 3. Admin Controller */}
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
                  <p className={masterDashboardCardSubtext}>
                    Access Control, Roles & System Settings
                  </p>
                </div>
              </button>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;