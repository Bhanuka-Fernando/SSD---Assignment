import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientTest = ({ patientId }) => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    if (patientId) {
      getTestsByPatientId();
    }
  }, [patientId]);

  const getTestsByPatientId = async () => {
    try {
      const res = await axios.get(`http://localhost:8070/test/patient/${patientId}`);
      setTests(res.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Tests for Patient ID: {patientId}</h2>
      {tests.length === 0 ? (
        <p className="text-gray-500">No tests found for this patient.</p>
      ) : (
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
            </tr>
          </thead>
          <tbody>
            {tests.map((item) => (
              <tr key={item._id} className="text-sm text-gray-600 border-b">
                <td className="py-3 px-6">{item._id}</td>
                <td className="py-3 px-6">{item.patient}</td>
                <td className="py-3 px-6">{item.name}</td>
                <td className="py-3 px-6">{item.age}</td>
                <td className="py-3 px-6">{new Date(item.date).toDateString()}</td>
                <td className="py-3 px-6">{item.type}</td>
                <td className="py-3 px-6">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientTest;
