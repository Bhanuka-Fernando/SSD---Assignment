import React, { useEffect, useState } from "react";
import axios from "axios";
import RowRecords from "./RowRecords";

const AddRecord = () => {
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [pid, setPid] = useState("");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getUser();
    getRecords();
  }, []);

  const getRecords = async () => {
    axios
      .get(`http://localhost:8070/record/`)
      .then((res) => {
        console.log(res.data);
        setRecords(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function getUser() {
    axios
      .get("http://localhost:8070/patient/check/", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPid(res.data.patient._id);
      })
      .catch((err) => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }

  const addRecord = async (e) => {
    e.preventDefault();
    const newRecord = {
      title,
      reason,
      pid,
    };

    axios
      .post(`http://localhost:8070/record/add`, newRecord)
      .then((res) => {
        alert("Record Created");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Create My Records</h1>
      <form onSubmit={addRecord} className="space-y-6 max-w-xl mx-auto">
        <div>
          <label className="block text-lg font-medium mb-2" htmlFor="title">
            Record Title
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2" htmlFor="reason">
            Reason
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Reason"
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <h4 className="text-gray-600">This will create a record of my patient account up to today's date.</h4>
        <button
          className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
          type="submit"
        >
          Get My Record
        </button>
      </form>

      <h1 className="text-3xl font-bold mt-12 mb-4 text-center">My Records</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-4 border-b font-medium">Record Id</th>
              <th className="px-6 py-4 border-b font-medium">Patient Id</th>
              <th className="px-6 py-4 border-b font-medium">Title</th>
              <th className="px-6 py-4 border-b font-medium">Reason</th>
              <th className="px-6 py-4 border-b font-medium">Date</th>
              <th className="px-6 py-4 border-b font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item, index) => (
              <RowRecords key={index} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddRecord;
