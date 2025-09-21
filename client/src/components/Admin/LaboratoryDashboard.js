import React from "react";
import DashboardHeader from "../DashboardHeader";
import SideNav from "./SideNav"; // Assuming you are using the SideNav component for navigation
import AddPatientReport from "../AddPatientReport";
import AddLabTest from "./AddLabTest";
import LabTests from "./LabTests";

const LaboratoryDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <DashboardHeader />

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar */}
        <SideNav /> {/* Use the SideNav component here */}

        {/* Main Content */}
        <div className="flex-grow p-6 space-y-6">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <AddLabTest />
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <LabTests />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryDashboard;
