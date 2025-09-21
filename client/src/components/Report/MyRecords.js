import React, { useEffect, useState } from "react";
import axios from "axios";
import PatientHeader from "../Payment/Patientheader";
import PatientSideBar from "../PatientSideBar";
import MyReports from "./MyReports";
import AddRecord from "./AddRecord";
import LabTests from "../Patienttest";

const MyRecords = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [channels, setChannels] = useState([]);
  const [searched, setSearched] = useState(false);
  const [sChannels, setSChannels] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) {
      window.location.href = "/";
    } else {
      localStorage.setItem("previous", true);
      console.log(token);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <PatientHeader />

      {/* Main content area with sidebar and page content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <PatientSideBar />

        {/* Main content container */}
        <div className="flex-1 p-8 bg-gray-50 min-h-screen mt-16 ml-64">
          <h1 className="text-3xl font-bold mb-6">My Records</h1>

          {/* AddRecord Component */}
          <div className="mb-10">
            <AddRecord />
          </div>

          {/* MyReports Component */}
          <div>
            <MyReports />
          </div>
          <div>
            <LabTests />
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyRecords;
