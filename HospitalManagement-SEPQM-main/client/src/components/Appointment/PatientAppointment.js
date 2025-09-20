import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientAppointment = ({ apt }) => {
  const [cid, setCid] = useState(apt.channel);
  const [channel, setChannel] = useState([]);

  useEffect(() => {
    getChannel();
  }, []);

  const getChannel = async () => {
    axios
      .get(`http://localhost:8070/channel/get/${cid}`)
      .then((res) => {
        setChannel(res.data.Channel);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const deleteApt = async () => {
    axios
      .delete(`http://localhost:8070/appointment/delete/${apt._id}`)
      .then((res) => {
        alert("Appointment Deleted");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Doctor: {channel.drName}
        </h2>
        <h2 className="text-md text-gray-600">
          Date and Time: {new Date(channel.startDateTime).toString()}
        </h2>
        <h4 className="text-sm text-gray-500">
          Appointment Id: {apt._id}
        </h4>
        <h3 className="text-md text-gray-600">
          Appointment No: {apt.appointmentNo}
        </h3>
        <h3 className="text-md text-gray-600">
          Name: {apt.name} | Age: {apt.age} | Gender: {apt.gender}
        </h3>
        <h3 className="text-md text-gray-600">
          Contact: {apt.contact}
        </h3>

        <h5 className="text-sm text-gray-500">
          Arrival Time: {new Date(apt.arrivalTime).toLocaleString()}
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

        <a href={`/editApt/${apt._id}/${apt.channel}`}>
          <button
            id="btn-edit-apt"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>
        </a>
      </div>
    </div>
  );
};

export default PatientAppointment;
