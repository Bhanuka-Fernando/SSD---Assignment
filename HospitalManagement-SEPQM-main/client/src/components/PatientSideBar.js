import React from 'react';

const PatientSideBar = () => {
  return (
    <div className="fixed top-[80px] left-0 h-[calc(100vh-80px)] w-[220px] bg-white pt-5 shadow-md flex flex-col items-center z-50">
      <ul className="w-full">
        <a href="/patientHome">
          <li className="w-full py-3 px-5 my-2 text-lg font-medium text-black bg-[#f0ffff] hover:bg-gradient-to-r from-[#0E0F35] to-[#6441a5] hover:text-white transition-all duration-300 rounded-md shadow-lg hover:translate-x-1">
            Home
          </li>
        </a>
        <a href="/myAppointments">
          <li className="w-full py-3 px-5 my-2 text-lg font-medium text-black bg-[#f0ffff] hover:bg-gradient-to-r from-[#0E0F35] to-[#6441a5] hover:text-white transition-all duration-300 rounded-md shadow-lg hover:translate-x-1">
            My Appointments
          </li>
        </a>
        <a href="/patientProfile">
          <li className="w-full py-3 px-5 my-2 text-lg font-medium text-black bg-[#f0ffff] hover:bg-gradient-to-r from-[#0E0F35] to-[#6441a5] hover:text-white transition-all duration-300 rounded-md shadow-lg hover:translate-x-1">
            Profile
          </li>
        </a>
        <a href="/records">
          <li className="w-full py-3 px-5 my-2 text-lg font-medium text-black bg-[#f0ffff] hover:bg-gradient-to-r from-[#0E0F35] to-[#6441a5] hover:text-white transition-all duration-300 rounded-md shadow-lg hover:translate-x-1">
            My Records
          </li>
        </a>
        <a href="/myPrescriptions">
          <li className="w-full py-3 px-5 my-2 text-lg font-medium text-black bg-[#f0ffff] hover:bg-gradient-to-r from-[#0E0F35] to-[#6441a5] hover:text-white transition-all duration-300 rounded-md shadow-lg hover:translate-x-1">
            My Prescriptions
          </li>
        </a>
        <a href="/myClaims">
          <li className="w-full py-3 px-5 my-2 text-lg font-medium text-black bg-[#f0ffff] hover:bg-gradient-to-r from-[#0E0F35] to-[#6441a5] hover:text-white transition-all duration-300 rounded-md shadow-lg hover:translate-x-1">
            My Claims
          </li>
        </a>
        
      </ul>
    </div>
  );
};

export default PatientSideBar;
