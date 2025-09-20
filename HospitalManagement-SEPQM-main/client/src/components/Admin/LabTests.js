import React, { useEffect, useState } from "react";
import axios from "axios";
import TestRow from "./TestRow";

const LabTests = () => {
  const [tests, setTests] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getTests();
  }, []);

  const getTests = async () => {
    axios
      .get(`http://localhost:8070/test/`)
      .then((res) => {
        setTests(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchTest = async (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    axios
      .get(`http://localhost:8070/test/search?query=${searchQuery}`)
      .then((res) => {
        setTests(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <input
        type="text"
        onChange={searchTest}
        value={query}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search Lab Tests"
      />
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Test ID</th>
              <th className="px-4 py-2 text-left">Patient ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((item) => (
              <TestRow key={item._id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabTests;
