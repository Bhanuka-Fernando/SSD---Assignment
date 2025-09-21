import React, { useEffect, useState } from "react";
import axios from "axios";
import StaffRow from "./StaffRow";

const AllStaff = () => {
  const [staffs, setStaffs] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getStaffs();
  }, []);

  const getStaffs = async () => {
    axios
      .get(`http://localhost:8070/admin/`)
      .then((res) => {
        setStaffs(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchStaffs = async () => {
    axios
      .get(`http://localhost:8070/admin/search?query=${query}`)
      .then((res) => {
        setStaffs(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <input
        type="text"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search Staff"
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={searchStaffs}
      />
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Staff ID</th>
              <th className="px-4 py-2 text-left">Staff Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Allocated Work</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((item) => (
              <StaffRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllStaff;
