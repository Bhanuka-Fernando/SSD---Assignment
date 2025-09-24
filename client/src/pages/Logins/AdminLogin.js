import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("type");

    if (token != null && type === "admin") {
      window.location.href = "/laboratory";
    }
  }, []);

  function login(e) {
    e.preventDefault();

    const admin = { email, password };

    axios
      .post("http://192.168.8.100:8070/admin/login", admin)
      // .post("http://localhost:8070/admin/login", admin)
      .then((res) => {
        if (res.data.rst === "success") {
          localStorage.setItem("type", "admin");
          localStorage.setItem("token", res.data.tok);
          alert("Login successful");
          window.location = "/laboratory";
        } else if (res.data.rst === "incorrect password") {
          alert("Incorrect password");
        } else if (res.data.rst === "invalid admin") {
          alert("Invalid user");
        }
      })
      .catch((err) => {
        alert("An error occurred during login");
      });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-blue-300 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-sm w-full flex flex-col items-center">
        <img className="w-24 mb-6" src="/images/Hospital-logo-W.png" alt="Hospital Logo" />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Login</h1>
        <form className="w-full" onSubmit={login}>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-8">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition-all duration-200 shadow-md transform hover:scale-105"
          >
            Login
          </button>
          <p className="mt-6 text-gray-600 text-sm">
            Don’t have an account?{" "}
            <a href="/" className="text-blue-500 hover:underline">
              Go Back
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
