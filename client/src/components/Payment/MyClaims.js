import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Patientheader from './Patientheader';
import PatientSideBar from '../PatientSideBar';

const MyClaims = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await axios.get('http://localhost:8070/insurance');
      setClaims(response.data);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const handleDeleteClaim = async (claimId) => {
    try {
      await axios.delete(`http://localhost:8070/insurance/${claimId}`);
      setClaims(claims.filter((claim) => claim._id !== claimId));
      alert('Claim deleted successfully');
    } catch (error) {
      console.error('Error deleting claim:', error);
      alert('Failed to delete the claim');
    }
  };

  const handleClearAllClaims = async () => {
    try {
      await axios.delete('http://localhost:8070/insurance'); // Endpoint to clear all claims
      setClaims([]);
      alert('All claims cleared successfully');
    } catch (error) {
      console.error('Error clearing all claims:', error);
      alert('Failed to clear all claims');
    }
  };

  return (
    <div>
      <Patientheader />
      <div className="flex">
        <PatientSideBar />
        <div className="flex-1 p-8 mt-16 ml-64 bg-gray-50 min-h-screen">
          <h2 className="text-3xl font-semibold mb-4">My Claim History</h2>
          <div className="flex justify-end mb-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleClearAllClaims}
            >
              Clear All Claims
            </button>
          </div>
          <div className="overflow-auto rounded-lg shadow-lg mt-4">
            <table className="w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left font-semibold">Claim ID</th>
                  <th className="py-2 px-4 text-left font-semibold">Claim Type</th>
                  <th className="py-2 px-4 text-left font-semibold">Reason</th>
                  <th className="py-2 px-4 text-left font-semibold">Submitted Date</th>
                  <th className="py-2 px-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.length > 0 ? (
                  claims.map((claim) => (
                    <tr key={claim._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4">{claim.claimId}</td>
                      <td className="py-2 px-4">{claim.claimType}</td>
                      <td className="py-2 px-4">{claim.reason}</td>
                      <td className="py-2 px-4">
                        {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-2 px-4">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDeleteClaim(claim._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2 px-4 text-center" colSpan="5">
                      No claims found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClaims;