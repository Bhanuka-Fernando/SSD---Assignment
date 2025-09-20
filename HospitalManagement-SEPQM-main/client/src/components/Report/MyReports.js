import React, { useEffect, useState } from "react";
import axios from "axios";
import RowReports from "./RowReports";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pid, setPid] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    getPrescriptions();
  }, []);

  const getSearch = async () => {
    axios
      .get(`http://localhost:8070/report/patient/search/${pid}?query=${query}`)
      .then((res) => {
        setReports(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPrescriptions = async () => {
    axios
      .get("http://localhost:8070/patient/check/", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setEmail(res.data.patient.email);
        setPassword(res.data.patient.password);
        setPid(res.data.patient._id);

        axios
          .get(
            `http://localhost:8070/report/patient/search/${res.data.patient._id}?query=${query}`
          )
          .then((res) => {
            setReports(res.data);
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
    <div className="p-8 bg-white rounded-lg shadow-md">
      {/* Header and Search Bar */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">My Reports</h1>
        <input
          type="text"
          onKeyUp={getSearch}
          onKeyDown={getSearch}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Search Reports"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </div>

      {/* Reports Table */}
      <table className="w-full table-auto bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-4 border-b">Report Id</th>
            <th className="p-4 border-b">Date</th>
            <th className="p-4 border-b">Test Id</th>
            <th className="p-4 border-b">Details</th>
            <th className="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((item, index) => (
            <RowReports key={index} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyReports;
