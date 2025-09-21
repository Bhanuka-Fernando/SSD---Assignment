import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [doctor, setDoctor] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualifications, setQualifications] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const validatePassword = (tpassword) => {
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return pattern.test(tpassword);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const updateDoctor = async () => {
    const updatedDoctor = { name, email, qualifications, specialization, password };

    if (password === confirmPassword) {
      if (validatePassword(password)) {
        if (validateEmail(email)) {
          await axios
            .put(`http://localhost:8070/doctor/update/${id}`, updatedDoctor)
            .then(() => alert("Doctor Profile Updated"))
            .catch((err) => alert(err));
        } else {
          alert("Invalid Email");
        }
      } else {
        alert("Password must contain 8 characters including 1 lowercase letter, one uppercase letter, one number, and at least one special character.");
      }
    } else {
      alert("Passwords do not match!");
    }
  };

  const getUser = async () => {
    await axios
      .get("http://localhost:8070/doctor/check/", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const { email, password, name, qualifications, specialization, _id } = res.data.doctor;
        setEmail(email);
        setPassword(password);
        setConfirmPassword(password);
        setName(name);
        setDoctor(res.data.doctor);
        setId(_id);
        setQualifications(qualifications);
        setSpecialization(specialization);
      })
      .catch((err) => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-3xl font-semibold  mb-8 text-center">Doctor Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Specialized In</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Qualifications</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
            />
          </div>

          <button
            className="w-full px-4 py-2 mt-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
            onClick={updateDoctor}
          >
            Update and Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
