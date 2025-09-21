import React, { useEffect, useState } from 'react';
import axios from "axios";

const AddLabTest = () => {
  const [patients, setPatients] = useState([]);
  const [pid, setPid] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    getPatients();
  }, []);

  const createLabTest = async (e) => {
    e.preventDefault();
    const newTest = {
      name,
      pid,
      age,
      type
    };
    
    axios
      .post(`http://localhost:8070/test/add`, newTest)
      .then((res) => {
        alert("Test Created");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPatients = async () => {
    axios
      .get(`http://localhost:8070/patient/`)
      .then((res) => {
        setPatients(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <form onSubmit={createLabTest} className="space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">Add Lab Test</h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPid(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Select Patient</option>
          {patients.map((item) => (
            <option key={item._id} value={item._id}>
              {item.firstName} {item.lastName}, ID: {item._id}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Age"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="text"
          placeholder="Lab Test Type"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setType(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:opacity-90"
        >
          Add Lab Test
        </button>
      </form>
    </div>
  );
};

export default AddLabTest;
