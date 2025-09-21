import React, { useEffect, useState } from "react";
import axios from "axios";
import PatientRowReports from "./PatientRowReports";

export default function ViewPatient({ id }) {
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!id) return;

    // Fetch patient details
    axios
      .get(`http://localhost:8070/patient/get/${id}`)
      .then((response) => {
        setPatient(response.data.patient);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch patient details");
        setLoading(false);
      });

    // Fetch patient reports
    fetchReports(id);
  }, [id]);

  // Function to fetch reports based on patient ID and query
  const fetchReports = (patientId) => {
    axios
      .get(`http://localhost:8070/report/patient/search/${patientId}?query=${query}`)
      .then((res) => {
        setReports(res.data);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      });
  };

  // Function to handle search query updates
  const handleSearch = (e) => {
    setQuery(e.target.value);
    fetchReports(id);  // Fetch reports based on updated query
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!patient) {
    return <p className="text-center text-gray-500">No patient data found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-white p-10 shadow-lg rounded-lg">
        
        {/* Patient Profile Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Patient Profile</h2>
          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium">Name:</span> {patient.firstName} {patient.lastName}</p>
            <p><span className="font-medium">Date of Birth:</span> {patient.dob ? new Date(patient.dob).toDateString() : "N/A"}</p>
            <p><span className="font-medium">Email:</span> {patient.email || "N/A"}</p>
            <p><span className="font-medium">Phone No:</span> {patient.phoneNo || "N/A"}</p>
            <p><span className="font-medium">Gender:</span> {patient.gender || "N/A"}</p>
          </div>
        </div>

          {/* Reports Section */}
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">All Records</h2> {/* New Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports</h2>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search reports"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-4 py-2 font-semibold">Report ID</th>
              <th className="px-4 py-2 font-semibold">Date</th>
              <th className="px-4 py-2 font-semibold">Test ID</th>
              <th className="px-4 py-2 font-semibold">Details</th>
              <th className="px-4 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((item) => <PatientRowReports key={item._id} item={item} />)
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">No reports found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

      </div>
    </div>
  );
}
