import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import PatientAppointment from "./PatientAppointment";
import Patientheader from "../Payment/Patientheader";
import PatientSideBar from "../PatientSideBar";

const PatientAppointments = () => {
  const [apts, setApts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const tok = localStorage.getItem("token");
    const type = localStorage.getItem("type");
    if (!tok || type !== "patient") {
      navigate("/patientLogin", { replace: true });
      return;
    }
    api.defaults.headers.common.Authorization = `Bearer ${tok}`;

    const load = async () => {
      try {
        // token identifies the patient; route in server allows /patientAppointments without id
        const { data } = await api.get("/appointment/patientAppointments");
        setApts(data.data || []);
      } catch (err) {
        if ([401, 403].includes(err?.response?.status)) {
          localStorage.removeItem("token");
          localStorage.removeItem("type");
          navigate("/patientLogin", { replace: true });
        } else {
          console.log(err);
          alert(err?.response?.data?.error || "Failed to load appointments");
        }
      }
    };
    load();
  }, [navigate]);

  return (
    <div>
      <Patientheader />
      <div className="flex">
        <PatientSideBar />
        <div className="ml-[220px] mt-[80px] p-8 flex-1 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>

          <div className="grid grid-cols-1 gap-6">
            {apts.map((item) => (
              <PatientAppointment key={item._id} apt={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
