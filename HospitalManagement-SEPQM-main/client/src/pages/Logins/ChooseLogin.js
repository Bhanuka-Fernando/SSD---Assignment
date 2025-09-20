import React from "react";

const ChooseLogin = () => {
  const handleAdminButton = () => {
    window.location.href = "/adminLogin";
  };

  const handlePatientButton = () => {
    window.location.href = "/patientLogin";
  };

  const handleDoctorButton = () => {
    window.location.href = "/doctorLogin";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <div className="flex flex-col items-center mb-12">
        <img className="w-32 mb-4 animate-bounce" src="images/Hospital-logo-W.png" alt="Hospital Logo" />
        <h1 className="text-3xl font-bold text-gray-800">Helasuwa.lk</h1>
        <p className="text-gray-600 mt-2">Choose your role to proceed</p>
      </div>

      <div className=" p-10 max-w-sm w-full flex flex-col items-center">
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 mb-6"
          onClick={handleAdminButton}
        >
          Admin
        </button>
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 mb-6"
          onClick={handlePatientButton}
        >
          Patient
        </button>
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          onClick={handleDoctorButton}
        >
          Doctor
        </button>
      </div>
    </div>
  );
};

export default ChooseLogin;
