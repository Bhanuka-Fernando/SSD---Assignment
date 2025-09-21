import React, { useState } from 'react';
import axios from 'axios';
import Patientheader from './Patientheader';
import PatientSideBar from '../PatientSideBar';

function InsuranceClaim() {
  const [claimDetails, setClaimDetails] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    sex: '',
    relationshipToInsured: '',
    status: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    mobileNumber: '',
    claimType: '',
    reason: '',
    policyNo: '',
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClaimDetails({ ...claimDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to validate policy number before submission
  const validatePolicyNumber = async () => {
    try {
      const response = await axios.post('http://localhost:8070/insurance/validatePolicy', {
        firstName: claimDetails.firstName,
        lastName: claimDetails.lastName,
        mobileNumber: claimDetails.mobileNumber,
        policyNo: claimDetails.policyNo,
      });

      return response.data.message === 'Policy number validated successfully';
    } catch (error) {
      console.error('Error validating policy number:', error);
      alert('Policy number does not match the registered insurance number.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // First, validate the policy number
    const isValid = await validatePolicyNumber();
    if (!isValid) return;

    const formData = new FormData();
    Object.keys(claimDetails).forEach((key) => {
      formData.append(key, claimDetails[key]);
    });
    if (file) formData.append('prescription', file);

    try {
      const response = await axios.post('http://localhost:8070/insurance', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(`Insurance claim submitted successfully! Claim ID: ${response.data.claimId}`);
    } catch (error) {
      console.error('Error submitting insurance claim:', error);
      alert('Submission failed.');
    }
  };

  return (
    <div>
      <Patientheader />
      <div className="flex">
        <PatientSideBar />
        <div className="flex-1 flex justify-center items-start mt-[80px] p-8 bg-gray-50 min-h-screen">
          <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Insurance Claim Form</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name Field */}
              <div>
                <label className="block text-gray-600 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDetails.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Last Name Field */}
              <div>
                <label className="block text-gray-600 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDetails.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Birth Date Field */}
              <div>
                <label className="block text-gray-600 mb-1">Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDetails.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Sex Field */}
              <div>
                <label className="block text-gray-600 mb-1">Sex</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sex"
                      value="Male"
                      className="mr-2"
                      checked={claimDetails.sex === "Male"}
                      onChange={handleChange}
                      required
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sex"
                      value="Female"
                      className="mr-2"
                      checked={claimDetails.sex === "Female"}
                      onChange={handleChange}
                      required
                    />
                    Female
                  </label>
                </div>
              </div>

              {/* Relationship to Insured Field */}
              <div>
                <label className="block text-gray-600 mb-1">Relationship to Insured</label>
                <select
                  name="relationshipToInsured"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDetails.relationshipToInsured}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Self">Self</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                </select>
              </div>

              {/* Marital Status Field */}
              <div>
                <label className="block text-gray-600 mb-1">Marital Status</label>
                <select
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDetails.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              {/* Remaining Fields */}
              <div>
                <label className="block text-gray-600 mb-1">Claim Type</label>
                <input
                  type="text"
                  name="claimType"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDetails.claimType}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Reason</label>
                <textarea
                  name="reason"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDetails.reason}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Policy Number</label>
                <input
                  type="text"
                  name="policyNo"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDetails.policyNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  name="addressLine1"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDetails.addressLine1}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDetails.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDetails.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDetails.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Upload Prescription</label>
                <input type="file" className="w-full px-3 py-2 border border-gray-300 rounded" onChange={handleFileChange} required />
              </div>

              <button type="submit" className="w-full mt-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
                Request Claim
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsuranceClaim;
