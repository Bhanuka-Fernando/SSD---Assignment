import React, { useState, useEffect } from 'react';

export default function AddPatientRecord() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch patients when the component mounts
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

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Here you would handle the submission of the new patient record
    console.log("Submitting record for patient ID:", selectedPatientId);
    
    // Simulate a successful submission
    alert("Patient record added successfully!"); // Displaying alert

    // Add your submission logic here (e.g., API call to save the record)
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-semibold mb-6 text-center">Add Patient Record</h2>
        {loading && <p className="text-center text-gray-600">Loading patients...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          {/* Patient Selection */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-gray-700 mb-1">Select Patient</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            >
              <option value="">-- Select Patient --</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Other Patient Details */}
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Patient Blood Pressure</label>
            <input
              type="text"
              placeholder="Enter Blood Pressure"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Next of Kin</label>
            <input
              type="text"
              placeholder="Enter Next of Kin"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Patient Age</label>
            <input
              type="number"
              placeholder="Enter Age"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Gender</label>
            <input
              type="text"
              placeholder="Enter Gender"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Occupation</label>
            <input
              type="text"
              placeholder="Enter Occupation"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Doctor Name</label>
            <input
              type="text"
              placeholder="Enter Doctor Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Enter Description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 h-28 resize-none"
            ></textarea>
          </div>
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
