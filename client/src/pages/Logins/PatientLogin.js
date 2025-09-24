import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api"; // shared axios instance (baseURL, interceptors, etc.)

const PatientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // prefer shared client; fallback to vanilla axios
  const client = api && api.post ? api : axios;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("type");

    if (token && type === "patient") {
      // prime Authorization header for subsequent API calls
      if (api && api.defaults) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      } else {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      navigate("/patientHome", { replace: true });
    }
  }, [navigate]);

  async function login(e) {
    e.preventDefault();

    try {
      // If using the shared client, rely on its baseURL (/patient/login).
      // Otherwise hit the explicit localhost endpoint (v1 behavior).
      const url =
        client === api ? "/patient/login" : "http://localhost:8070/patient/login";

      const { data } = await client.post(url, { email, password });

      if (data.rst === "success") {
        localStorage.setItem("type", "patient");
        localStorage.setItem("token", data.tok);

        // prime Authorization header immediately
        if (api && api.defaults) {
          api.defaults.headers.common.Authorization = `Bearer ${data.tok}`;
        }
        axios.defaults.headers.common.Authorization = `Bearer ${data.tok}`;

        alert("Login successful");
        navigate("/patientHome", { replace: true });
      } else if (data.rst === "incorrect password") {
        alert("Incorrect password");
      } else if (data.rst === "invalid user") {
        alert("Invalid user");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      alert("An error occurred during login");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-blue-300 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-sm w-full flex flex-col items-center">
        <img className="w-24 mb-6" src="/images/Hospital-logo-W.png" alt="Hospital Logo" />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient Login</h1>
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
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default PatientLogin;
