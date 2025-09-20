import React from "react";
import DashboardHeader from "../DashboardHeader";
import SideNav from "./SideNav"; // Assuming SideNav is the updated sidebar component
import AddStaff from "./AddStaff";
import AllStaff from "./AllStaff";

const StaffDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <DashboardHeader />

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar */}
        <SideNav /> {/* Use the consistent SideNav component here */}

        {/* Main Content */}
        <div className="flex-grow p-6 space-y-6">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-4">Add Staff</h1>
            <AddStaff />
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-4">All Staff</h1>
            <AllStaff />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
