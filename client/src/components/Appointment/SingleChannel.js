import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

const SingleChannel = ({ channel }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/channel/NoOfAppointments/${channel._id}`);
        setCount(data.count || 0);
      } catch (err) {
        alert(err?.response?.data?.error || "Failed to load count");
      }
    };
    load();
  }, [channel._id]);

  const remaining = (parseInt(channel.maxPatients, 10) || 0) - (parseInt(count, 10) || 0);
  const full = remaining <= 0;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h5 className="font-bold text-lg mb-2">Doctor: {channel.drName}</h5>
      <p className="text-sm text-gray-600 mb-2">Specialized In: {channel.specialization}</p>
      <p className="text-sm text-gray-600 mb-2">
        {channel.startDateTime ? new Date(channel.startDateTime).toString() : "-"}
      </p>
      <p className="text-sm text-gray-600 mb-4">Available Spots: {Math.max(0, remaining)}</p>

      {full ? (
        <button id="make-apt-btn" disabled className="bg-gray-300 text-gray-600 py-2 px-4 rounded">
          Appointment Full
        </button>
      ) : (
        <Link to={`/makeApt/${channel._id}`}>
          <button className="bg-blue-500 text-white py-2 px-4 rounded">Make Appointment</button>
        </Link>
      )}
    </div>
  );
};

export default SingleChannel;
