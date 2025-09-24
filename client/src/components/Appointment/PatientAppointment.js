import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

const PatientAppointment = ({ apt }) => {
  const [channel, setChannel] = useState({});
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
        const { data } = await api.get(`/channel/get/${apt.channel}`);
        setChannel(data.Channel || {});
      } catch (err) {
        alert(err?.response?.data?.error || "Failed to load channel");
      }
    };
    load();
  }, [apt.channel, navigate]);

  const deleteApt = async () => {
    try {
      await api.delete(`/appointment/delete/${apt._id}`);
      alert("Appointment Deleted");
      // Optionally: trigger a reload in parent via callback, or:
      navigate(0); // quick refresh
    } catch (error) {
      if ([401, 403].includes(error?.response?.status)) {
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        navigate("/patientLogin", { replace: true });
      } else {
        alert(error?.response?.data?.error || "Delete failed");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Doctor: {channel.drName}</h2>
        <h2 className="text-md text-gray-600">
          Date and Time: {channel.startDateTime ? new Date(channel.startDateTime).toString() : "-"}
        </h2>
        <h4 className="text-sm text-gray-500">Appointment Id: {apt._id}</h4>
        <h3 className="text-md text-gray-600">Appointment No: {apt.appointmentNo}</h3>
        <h3 className="text-md text-gray-600">
          Name: {apt.name} | Age: {apt.age} | Gender: {apt.gender}
        </h3>
        <h3 className="text-md text-gray-600">Contact: {apt.contact}</h3>
        <h5 className="text-sm text-gray-500">
          Arrival Time: {apt.arrivalTime ? new Date(apt.arrivalTime).toLocaleString() : "-"}
        </h5>
        <h5 className="text-sm text-gray-500">Notes: {apt.notes}</h5>
        <h5 className="text-sm font-bold text-red-600">
          {apt.consulted ? "Consulted" : "No consultation yet"}
        </h5>
      </div>

      <div className="flex space-x-4">
        <button
          id="btn-delete-apt"
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={deleteApt}
        >
          Delete
        </button>

        <Link to={`/editApt/${apt._id}/${apt.channel}`}>
          <button
            id="btn-edit-apt"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PatientAppointment;