import React, { useEffect, useState } from "react";
import axios from "axios";
import AllDoctors from "./AllDoctors";
import DashboardHeader from "../DashboardHeader";
import SideNav from "./SideNav"; // Import SideNav component

const AddDoctor = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualifications, setQualifications] = useState("");

  useEffect(() => {}, []);

  const addDoctor = async (e) => {
    e.preventDefault();
    const newDoctor = { name, email, password, specialization, qualifications };

    axios
      .post(`http://localhost:8070/doctor/add`, newDoctor)
      .then((res) => {
        alert("Doctor Created");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <DashboardHeader />

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar */}
        <SideNav /> {/* Use the new SideNav component here */}

        {/* Main Content */}
        <div className="flex-grow p-6">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Add Doctor</h1>
            <form onSubmit={addDoctor} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="text"
                placeholder="Specialization"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSpecialization(e.target.value)}
              />
              <input
                type="text"
                placeholder="Qualifications"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setQualifications(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:opacity-90"
              >
                Add Doctor
              </button>
            </form>
          </div>
          <AllDoctors />
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
