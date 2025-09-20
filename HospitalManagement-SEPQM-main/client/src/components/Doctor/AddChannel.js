import React, { useEffect, useState } from "react";
import axios from "axios";

const AddChannel = () => {
  const [doctor, setDoctor] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [maxPatients, setMaxPatients] = useState(0);
  const [startDateTime, setStartDateTime] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const createChannel = async (e) => {
    e.preventDefault();
    const drName = doctor.name;

    const newChannel = {
      doctor,
      drName,
      startDateTime,
      maxPatients,
      specialization,
    };

    await axios
      .post("http://localhost:8070/channel/add/", newChannel)
      .then((res) => {
        alert("Channel created!!!");
        window.location.reload();
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getUser = async () => {
    await axios
      .get("http://localhost:8070/doctor/check/", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setEmail(res.data.doctor.email);
        setPassword(res.data.doctor.password);
        setName(res.data.doctor.name);
        setSpecialization(res.data.doctor.specialization);
        setDoctor(res.data.doctor);
        setId(res.data.doctor._id);
        console.log(res.data.doctor._id);
      })
      .catch((err) => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold  mb-8 text-center">Create Channeling Time</h1>
        <form onSubmit={createChannel} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <label className="block text-gray-700 mb-2">Doctor Name</label>
            <input
              type="text"
              value={doctor.name}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Maximum Patients</label>
            <input
              type="number"
              placeholder="Maximum Patients"
              onChange={(e) => setMaxPatients(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Start Date and Time</label>
            <input
              type="datetime-local"
              onChange={(e) => setStartDateTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
          >
            Create Channeling Time
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChannel;
