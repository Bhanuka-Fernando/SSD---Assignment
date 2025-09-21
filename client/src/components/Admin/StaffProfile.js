import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardHeader from "../DashboardHeader";
import SideNav from "./SideNav"; // Assuming you have the SideNav component

const StaffProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [roleName, setRoleName] = useState("");
  const [allocatedWork, setAllocatedWork] = useState("");
  const [id, setId] = useState("");

  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    getUser();
  }, []);

  function getUser() {
    axios
      .get("http://localhost:8070/admin/check/", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setEmail(res.data.admin.email);
        setPassword(res.data.admin.password);
        setConfirmPassword(res.data.admin.password);
        setAdmin(res.data.admin);
        setName(res.data.admin.name);
        setId(res.data.admin._id);
        setPhone(res.data.admin.phone);
        setRoleName(res.data.admin.roleName);
        setAllocatedWork(res.data.admin.allocatedWork);
        console.log(res.data.admin.email);
      })
      .catch((err) => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }

  const editStaff = async (e) => {
    e.preventDefault();
    const updateAdmin = {
      name,
      email,
      roleName,
      allocatedWork,
      phone,
      password,
    };

    if (password === confirmPassword) {
      axios
        .put(`http://localhost:8070/admin/updateStaff/${id}`, updateAdmin)
        .then((res) => {
          alert("Staff Updated");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Password does not match");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <DashboardHeader />

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar */}
        <SideNav /> {/* Use the SideNav component here */}

        {/* Main Content */}
        <div className="flex-grow p-6">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Edit Staff Profile</h1>
            <form onSubmit={editStaff} className="space-y-4">
              <div>
                <label className="block text-gray-600">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={admin.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={admin.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600">Phone</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={admin.phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600">Role</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={admin.roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600">Allocated Work</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={admin.allocatedWork}
                  onChange={(e) => setAllocatedWork(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={admin.password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={admin.password}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:opacity-90"
              >
                Update and Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
