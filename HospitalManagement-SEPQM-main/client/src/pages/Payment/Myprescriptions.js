import React, { useEffect, useState } from 'react';
import axios from "axios";
import RowPrescriptionView from '../../components/Payment/RowPrescriptionView';
import PrescriptionDetails from '../../components/Payment/PrescriptionDetails';
import PatientSideBar from '../../components/PatientSideBar';
import Patientheader from '../../components/Payment/Patientheader.js';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pid, setPid] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    getPrescriptions();
  }, []);

  const getSearch = async () => {
    axios
      .get(`http://localhost:8070/prescription/patient/search/${pid}?query=${query}`)
      .then((res) => {
        setPrescriptions(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPrescriptions = async () => {
    axios
      .get("http://localhost:8070/patient/check/", {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setEmail(res.data.patient.email);
        setPassword(res.data.patient.password);
        setPid(res.data.patient._id);

        axios
          .get(`http://localhost:8070/prescription/patient/search/${res.data.patient._id}?query=${query}`)
          .then((res) => {
            setPrescriptions(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  };

  return (
    <div>
      <Patientheader />
      <div className="flex">
        <PatientSideBar />
        
        <div className="ml-[220px] mt-[80px] p-8 flex-1 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Prescriptions</h1>

          <div className="mb-4">
            <input
              type="text"
              onKeyUp={getSearch}
              onKeyDown={getSearch}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Search for a prescription"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {selectedPrescription ? (
            <PrescriptionDetails
              prescription={selectedPrescription}
              onBack={() => setSelectedPrescription(null)}
            />
          ) : (
            <div className="overflow-auto rounded-lg shadow-lg">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="py-3 px-5 text-left font-semibold">Prescription ID</th>
                    <th className="py-3 px-5 text-left font-semibold">Appointment ID</th>
                    <th className="py-3 px-5 text-left font-semibold">Date/Time</th>
                    <th className="py-3 px-5 text-left font-semibold">Prescription</th>
                    <th className="py-3 px-5 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((item) => (
                    <RowPrescriptionView
                      key={item._id}
                      item={item}
                      onClick={() => setSelectedPrescription(item)}
                      className="hover:bg-gray-100 transition duration-200"
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPrescriptions;
