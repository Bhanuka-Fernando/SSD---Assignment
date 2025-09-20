import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaFlask, FaUsers, FaUserMd, FaUser, FaBox } from "react-icons/fa";

const SideNav = () => {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-blue-100 text-gray-700 w-64 p-6 min-h-screen shadow-2xl">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Admin Panel</h2>
      <p className="text-gray-600 mb-6">Welcome back, Administrator!</p>
      <nav className="space-y-3">
        <NavLink
          to="/admindashboard"
          exact
          className={({ isActive }) =>
            `flex items-center py-3 px-4 rounded-lg shadow-md transition-colors duration-200 cursor-pointer hover:bg-blue-500 hover:text-white ${
              isActive ? "bg-blue-500 text-white" : "bg-white"
            }`
          }
        >
          <FaHome className="mr-3" />
          <span>Overview</span>
        </NavLink>
        <NavLink
          to="/laboratory"
          className={({ isActive }) =>
            `flex items-center py-3 px-4 rounded-lg shadow-md transition-colors duration-200 cursor-pointer hover:bg-blue-500 hover:text-white ${
              isActive ? "bg-blue-500 text-white" : "bg-white"
            }`
          }
        >
          <FaFlask className="mr-3" />
          <span>Laboratory</span>
        </NavLink>
        <NavLink
          to="/staff"
          className={({ isActive }) =>
            `flex items-center py-3 px-4 rounded-lg shadow-md transition-colors duration-200 cursor-pointer hover:bg-blue-500 hover:text-white ${
              isActive ? "bg-blue-500 text-white" : "bg-white"
            }`
          }
        >
          <FaUsers className="mr-3" />
          <span>Staff Management</span>
        </NavLink>
        <NavLink
          to="/doctor"
          className={({ isActive }) =>
            `flex items-center py-3 px-4 rounded-lg shadow-md transition-colors duration-200 cursor-pointer hover:bg-blue-500 hover:text-white ${
              isActive ? "bg-blue-500 text-white" : "bg-white"
            }`
          }
        >
          <FaUserMd className="mr-3" />
          <span>Add Doctor</span>
        </NavLink>
        <NavLink
          to="/staffProfile"
          className={({ isActive }) =>
            `flex items-center py-3 px-4 rounded-lg shadow-md transition-colors duration-200 cursor-pointer hover:bg-blue-500 hover:text-white ${
              isActive ? "bg-blue-500 text-white" : "bg-white"
            }`
          }
        >
          <FaUser className="mr-3" />
          <span>Profile</span>
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            `flex items-center py-3 px-4 rounded-lg shadow-md transition-colors duration-200 cursor-pointer hover:bg-blue-500 hover:text-white ${
              isActive ? "bg-blue-500 text-white" : "bg-white"
            }`
          }
        >
          <FaBox className="mr-3" />
          <span>Inventory</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default SideNav;
