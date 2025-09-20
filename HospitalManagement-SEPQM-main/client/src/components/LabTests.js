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
        console.log(res.data);
        setTests(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const searchTest = async (e) => {
    setQuery(e.target.value);
    console.log(e.target.value);

    axios
      .get(`http://localhost:8070/test/search?query=${query}`)
      .then((res) => {
        console.log(res.data);
        setTests(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="p-4">
      <input
        type="text"
        onKeyUp={searchTest}
        className="mb-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Test ID</th>
            <th className="py-3 px-6 text-left">Patient ID</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Age</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Report</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((item, index) => (
            <TestRow key={index} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LabTests;
