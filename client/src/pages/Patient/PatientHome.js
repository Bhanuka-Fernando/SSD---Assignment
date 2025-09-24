// pages/Patient/PatientHome.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PatientHeader from "../../components/Payment/Patientheader";
import PatientSideBar from "../../components/PatientSideBar";
import AllChannels from "../../components/Appointment/AllChannels";
import api from "../../api";

const PatientHome = () => {
  const dt = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [channels, setChannels] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("type");

    // hard guard
    if (!token || type !== "patient") {
      navigate("/patientLogin", { replace: true });
      return;
    }
    // prime axios for this tab / hard refresh
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    getUser();
    getChannels();
  }, [navigate]);

  const getChannels = async () => {
    try {
      const res = await api.get("/channel"); // baseURL already set
      setChannels(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const res = await api.get("/patient/check"); // token added by api interceptor/defaults
      setEmail(res.data.patient.email || "");
    } catch (err) {
      // token invalid -> logout and go to login
      localStorage.removeItem("token");
      localStorage.removeItem("type");
      navigate("/patientLogin", { replace: true });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    alert("You have logged out");
    navigate("/", { replace: true });
  };

  const dateParam = date ? encodeURIComponent(date) : "";
  const doctorParam = doctor ? encodeURIComponent(doctor) : "";

  return (
    <div className="flex flex-col h-screen">
      <PatientHeader onLogout={logout} />

      <div className="flex flex-grow">
        <PatientSideBar />

        <div className="flex-grow p-8 bg-gray-100 ml-64 mt-8">
          <div className="search-container mb-4 mt-10">
            <input
              className="search-inputs border border-gray-300 rounded p-2 w-full md:w-1/3"
              type="text"
              placeholder="Search Doctor"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            />
            <input
              className="search-inputs border border-gray-300 rounded p-2 w-full md:w-1/3 ml-2"
              type="date"
              min={dt}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Link to={`/searchChannels/${dateParam}/${doctorParam}`}>
              <button className="search-btn bg-blue-500 text-white rounded p-2 ml-2">
                Search
              </button>
            </Link>
          </div>

          <AllChannels channels={channels} />
        </div>
      </div>
    </div>
  );
};

export default PatientHome;
