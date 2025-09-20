import React from "react";

export default function DoctorHeader({ doctorName }) {

  function logout() {
    localStorage.removeItem("token");
    localStorage.setItem("previous", false);
    console.log("You have logged out");
    window.location.href = "/";
  }

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 shadow-md text-white">
      {/* Logo and Site Title */}
      <div className="flex items-center space-x-4">
        <img className="w-12 h-12 rounded-full shadow-md" src="/images/Hospital logo B.png" alt="Hospital Logo" />
        <h1 className="text-2xl font-bold tracking-wide">Helasuwa.lk</h1>
      </div>

      {/* Add Logout Button */}
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
      >
        Logout
      </button>
    </div>
  );
}
