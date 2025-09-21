import React, { useEffect, useState } from 'react';

export default function AllPatients({ onViewPatient }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8070/patient/")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        return response.json();
      })
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">All Patients</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            {patients.length === 0 ? (
              <p className="text-center text-gray-600">No patients found.</p>
            ) : (
              <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-800">
                    <th className="px-6 py-4 text-left font-semibold border-b border-gray-300">Name</th>
                    <th className="px-6 py-4 text-left font-semibold border-b border-gray-300">Gender</th>
                    <th className="px-6 py-4 text-left font-semibold border-b border-gray-300">Medical Status</th>
                    <th className="px-6 py-4 text-left font-semibold border-b border-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient._id} className="border-b hover:bg-gray-100">
                      <td className="px-6 py-4 text-gray-800">{patient.firstName} {patient.lastName}</td>
                      <td className="px-6 py-4 text-gray-800">{patient.gender}</td>
                      <td className="px-6 py-4 text-gray-800">{patient.medicalStatus}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onViewPatient(patient._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200"
                          aria-label={`View details for ${patient.firstName} ${patient.lastName}`}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
