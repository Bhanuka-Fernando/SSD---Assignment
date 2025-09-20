import React, { useEffect, useState } from "react";
import axios from "axios";
import Patientheader from "./Payment/Patientheader";
import SideNav from "./Admin/SideNav";
import { useParams } from "react-router-dom";

const AddPatientReport = () => {
  let { tid, pid } = useParams();
  const [patient, setPatient] = useState([]);
  const [details, setDetails] = useState("");
  const [result, setResult] = useState(null);
  const [test, setTest] = useState("");

  useEffect(() => {
    getPatient();
    getLabTest();
  }, []);

  const getPatient = async () => {
    axios
      .get(`http://localhost:8070/patient/get/${pid}`)
      .then((res) => {
        console.log(res.data.patient);
        setPatient(res.data.patient);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getLabTest = async () => {
    axios
      .get(`http://localhost:8070/test/get/${tid}`)
      .then((res) => {
        console.log(res.data.test);
        setTest(res.data.test);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const createReport = async (e) => {
    e.preventDefault();
    const newReport = {
      tid,
      result,
      details,
      pid,
    };

    axios
      .post(`http://localhost:8070/report/add`, newReport)
      .then((res) => {
        alert("Report Created");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        <Patientheader />

        <div className="p-6 flex-grow bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-6">Add a Patient Report</h1>

            <form onSubmit={createReport}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Patient</label>
                <input
                  className="border border-gray-300 rounded-md p-2 w-full"
                  type="text"
                  value={`${patient.firstName} ${patient.lastName} - ${patient._id}`}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700">Test ID: {test._id}</h4>
                <h4 className="font-semibold text-gray-700">Test Date: {new Date(test.date).toLocaleString()}</h4>
                <h4 className="font-semibold text-gray-700">Test Type: {test.type}</h4>
                <h4 className="font-semibold text-gray-700">Test Status: {test.status}</h4>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Test Result</label>
                <select
                  className="border border-gray-300 rounded-md p-2 w-full"
                  onChange={(e) => setResult(e.target.value)}
                >
                  <option value="">Test Result</option>
                  <option value="true">Positive</option>
                  <option value="false">Negative</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Test Details</label>
                <textarea
                  className="border border-gray-300 rounded-md p-2 w-full"
                  rows="5"
                  placeholder="Enter test details"
                  onChange={(e) => setDetails(e.target.value)}
                ></textarea>
              </div>

              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Create Report
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientReport;
