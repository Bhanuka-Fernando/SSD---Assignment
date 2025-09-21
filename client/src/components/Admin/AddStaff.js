import React, { useState } from "react";
import axios from "axios";

const AddStaff = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRollName] = useState("");
  const [allocatedWork, setAllocatedWork] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (tpassword) => {
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return pattern.test(tpassword);
  };

  const validatePhone = (phn) => {
    const phoneNumberPattern = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneNumberPattern.test(phn);
  };

  const addStaff = async (e) => {
    e.preventDefault();

    if (validateEmail(email)) {
      if (validatePhone(phone)) {
        if (validatePassword(password)) {
          const newAdmin = {
            name,
            email,
            password,
            roleName,
            allocatedWork,
            phone,
          };

          axios
            .post(`http://localhost:8070/admin/add`, newAdmin)
            .then(() => {
              alert("Staff Created");
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          alert(
            "Password must contain 8 characters including 1 lowercase letter, 1 uppercase letter, 1 number, and at least 1 special character."
          );
        }
      } else {
        alert("Invalid Phone");
      }
    } else {
      alert("Invalid Email");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <form onSubmit={addStaff} className="space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Add Staff</h1>

        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="tel"
          placeholder="Phone"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Staff Role"
          onChange={(e) => setRollName(e.target.value)}
        />

        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Allocated Work"
          onChange={(e) => setAllocatedWork(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:opacity-90"
        >
          Add Staff
        </button>
      </form>
    </div>
  );
};

export default AddStaff;
