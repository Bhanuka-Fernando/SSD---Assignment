import React, { useEffect, useState } from "react";
import axios from "axios";
import PatientAppointment from "./PatientAppointment";
import Patientheader from "../Payment/Patientheader";
import PatientSideBar from "../PatientSideBar";

const PatientAppointments = () => {
  const [user, setUser] = useState([]);
  const [apts, setApts] = useState([]);

  useEffect(() => {
    getUser();
  }, []);

  function getUser() {
    axios
      .get("http://localhost:8070/patient/check/", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUser(res.data.patient);

        axios
          .get(
            `http://localhost:8070/appointment/patientAppointments/${res.data.patient._id}`
          )
          .then((res) => {
            setApts(res.data.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch((err) => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }

  return (
    <div>
      <Patientheader />

      <div className="flex">
        <PatientSideBar />
        
        <div className="ml-[220px] mt-[80px] p-8 flex-1 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>

          <div className="grid grid-cols-1 gap-6">
            {apts.map((item, index) => (
              <PatientAppointment key={index} apt={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
