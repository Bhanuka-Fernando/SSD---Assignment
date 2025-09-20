import React, { useEffect, useState } from 'react';
import axios from "axios";

const DoctorChannels = () => {
  const [channels, setChannels] = useState([]);
  const id = localStorage.getItem("doctor");

  useEffect(() => {
    getChannels();
  }, []);

  const getChannels = async () => {
    axios
      .get(`http://localhost:8070/channel/doctorchannels/${id}`)
      .then((res) => {
        setChannels(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteChannel = (channelId) => {
    axios
      .delete(`http://localhost:8070/channel/delete/${channelId}`)
      .then(() => {
        alert("Channel Deleted");
        setChannels(channels.filter((channel) => channel._id !== channelId));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold  mb-8 text-center">Channeling Times</h1>
      {channels.map((item, index) => (
        <div key={index} className="bg-white shadow-lg rounded-2xl p-6 mb-8 flex justify-between items-center hover:shadow-2xl transition-shadow duration-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{item.drName}</h2>
            <h3 className="text-gray-600 mt-2">Specialized In: {item.specialization}</h3>
            <h3 className="text-gray-600 mt-2">Date and Time: {new Date(item.startDateTime).toLocaleString()}</h3>
            <h4 className="text-gray-600 mt-2">Maximum Patients: {item.maxPatients}</h4>
          </div>

          <div className="flex flex-col space-y-2">
            <button
              onClick={() => deleteChannel(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
            >
              Delete
            </button>

            <a href={`/editChannel/${item._id}`} className="w-full">
              <button className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200 shadow-md">
                Edit
              </button>
            </a>

            <a href={`/viewChannel/${item._id}`} className="w-full">
              <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 shadow-md">
                View
              </button>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorChannels;
