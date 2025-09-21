import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditChannel = () => {
  let { cid } = useParams();
  const [maxPatients, setMaxPatients] = useState(0);
  const [startDateTime, setStartDateTime] = useState("");
  const [channel, setChannel] = useState([]);

  function updateChannel(e) {
    e.preventDefault();
    const updatedChannel = { maxPatients, startDateTime };
    axios
      .put(`http://localhost:8070/channel/update/${channel._id}`, updatedChannel)
      .then((res) => {
        alert("Channel updated!");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  }

  const getChannel = async () => {
    axios
      .get(`http://localhost:8070/channel/get/${cid}`)
      .then((res) => {
        setChannel(res.data.Channel);
        setMaxPatients(res.data.Channel.maxPatients);
        setStartDateTime(res.data.Channel.startDateTime);
      })
      .catch((err) => alert(err.message));
  };

  useEffect(() => {
    getChannel();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 justify-center items-center p-10">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Edit Channeling Time</h1>
        <form onSubmit={updateChannel} className="space-y-6">
          <input
            type="text"
            value={channel.drName}
            readOnly
            className="w-full px-4 py-3 text-gray-700 bg-gray-200 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Maximum Patients"
            value={maxPatients}
            onChange={(e) => setMaxPatients(e.target.value)}
            className="w-full px-4 py-3 text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <label className="text-gray-500 text-sm">
            Current Date & Time: {new Date(startDateTime).toString()}
          </label>
          <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            className="w-full px-4 py-3 text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
            >
              Update and Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChannel;
