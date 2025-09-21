import React, { useEffect, useState } from "react";
import axios from "axios";

const SingleChannel = ({ channel }) => {
  const did = channel.doctor ;
  const [count, setCount] = useState(0);
  const [doctor, setDoctor] = useState([]);
  

  useEffect(() => {
    getPatientNo();
   
  }, []);

  const getPatientNo = async () => {
    axios
      .get(`http://localhost:8070/channel/NoOfAppointments/${channel._id}`)
      .then((res) => {
        setCount(res.data.count);
        console.log(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h5 className="font-bold text-lg mb-2">Doctor: {channel.drName}</h5>
      <p className="text-sm text-gray-600 mb-2">Specialized In: {channel.specialization}</p>
      <p className="text-sm text-gray-600 mb-2">{new Date(channel.startDateTime).toString()}</p>
      <p className="text-sm text-gray-600 mb-4">
        Available Spots: {parseInt(channel.maxPatients) - parseInt(count)}
      </p>

      <div>
        {channel.maxPatients == count ? (
          <a href={"/makeApt/" + channel._id}>
            <button id="make-apt-btn" disabled>
              Appointment Full
            </button>
          </a>
        ) : (
          <a href={`/makeApt/${channel._id}`}>
            <button className="bg-blue-500 text-white py-2 px-4 rounded">Make Appointment</button>
          </a>
        )}
      </div>
    </div>
  );
};

export default SingleChannel;
