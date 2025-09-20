import React from 'react';
import { FaCalendarAlt, FaUserPlus, FaUserMd, FaUsers, FaDoorOpen } from 'react-icons/fa';

export default function DoctorSidePanel({ setSelectedComponent }) {
  function logout() {
    localStorage.removeItem("token");
    localStorage.setItem("previous", false);
    console.log("You have logged out");
    window.location.href = "/";
  }

  return (
    <div className="flex flex-col justify-between bg-gradient-to-b from-gray-100 to-blue-100 min-h-screen w-64 p-6 shadow-2xl">
      {/* Header */}
      <div className="mb-8"> 
        <h2 className="text-2xl font-semibold text-blue-700 mb-1">Doctor Panel</h2>
        <p className="text-gray-600 text-sm">Welcome back, Doctor!</p>
      </div>

      {/* Menu Items */}
      <ul className="space-y-2 text-lg mb-6">
        <li
          onClick={() => setSelectedComponent("channels")}
          className="flex items-center px-4 py-3 text-gray-700 bg-white rounded-lg hover:bg-blue-500 hover:text-white transition duration-200 cursor-pointer shadow-md"
        >
          <FaCalendarAlt className="mr-3" />
          Appointments Times
        </li>
        <li
          onClick={() => setSelectedComponent("addChannel")}
          className="flex items-center px-4 py-3 text-gray-700 bg-white rounded-lg hover:bg-blue-500 hover:text-white transition duration-200 cursor-pointer shadow-md"
        >
          <FaUserPlus className="mr-3" />
          Create Appointment Slot
        </li>
        <li
          onClick={() => setSelectedComponent("profile")}
          className="flex items-center px-4 py-3 text-gray-700 bg-white rounded-lg hover:bg-blue-500 hover:text-white transition duration-200 cursor-pointer shadow-md"
        >
          <FaUserMd className="mr-3" />
          Profile
        </li>
        <li
          onClick={() => setSelectedComponent("allPatients")}
          className="flex items-center px-4 py-3 text-gray-700 bg-white rounded-lg hover:bg-blue-500 hover:text-white transition duration-200 cursor-pointer shadow-md"
        >
          <FaUsers className="mr-3" />
          Patients
        </li>
      
        <li
          onClick={() => setSelectedComponent("addPatinetRecord")}
          className="flex items-center px-4 py-3 text-gray-700 bg-white rounded-lg hover:bg-blue-500 hover:text-white transition duration-200 cursor-pointer shadow-md"
        >
          <FaUserPlus className="mr-3" />
          Add Records
        </li>
      </ul>

      {/* Logout Button at the Bottom */}
      <div className="mt-auto">
        <button
          onClick={logout}
          className="w-full px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-lg transition duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          <FaDoorOpen className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}
