import React from "react";

export default function DoctorHeader({ doctorName }) {

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 shadow-md text-white">
      {/* Logo and Site Title */}
      <div className="flex items-center space-x-4">
        <img className="w-12 h-12 rounded-full shadow-md" src="/images/Hospital logo B.png" alt="Hospital Logo" />
        <h1 className="text-2xl font-bold tracking-wide">Helasuwa.lk</h1>
      </div>

      {/* Doctor Name */}
      <div className="text-lg font-medium">
        Dr. {doctorName}
      </div>
    </div>
  );
}
