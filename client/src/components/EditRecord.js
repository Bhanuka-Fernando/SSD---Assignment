import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Patientheader from "./Payment/Patientheader";
import PatientSideBar from "./PatientSideBar";

const EditRecord = () => {
  let { id } = useParams();
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [record, setRecord] = useState([]);

  useEffect(() => {
    getRecord();
  }, []);

  const getRecord = async () => {
    console.log(id);
    axios
      .get(`http://localhost:8070/record/get/${id}`)
      .then((res) => {
        console.log(res.data.record);
        setRecord(res.data.record);
        setTitle(res.data.record.title);
        setReason(res.data.record.reason);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateRecord = async (e) => {
    e.preventDefault();
    const updatedRecord = {
      title,
      reason,
    };

    axios
      .put(`http://localhost:8070/record/update/${id}`, updatedRecord)
      .then((res) => {
        alert("Record Updated");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <PatientSideBar />

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <Patientheader />

        <div className="flex-grow p-6 bg-gray-100">
          <div className="bg-white p-12 rounded-lg shadow-md max-w-2xl mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-6">Edit My Record</h1>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Record Title</label>
              <input
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Reason</label>
              <input
                className="border border-gray-300 rounded-md p-2 w-full"
                type="text"
                placeholder="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <p className="text-sm text-gray-600 mb-6">
              This will update the record in your patient account as of today's date.
            </p>

            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={updateRecord}
            >
              Update and Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecord;
