import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8070";

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // send session cookie on every request
  axios.defaults.baseURL = API_BASE;
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // if already logged in via OIDC session, go to dashboard
    axios
      .get("/auth/me")
      .then((res) => {
        if (res.data?.user?.role === "doctor") {
          window.location.href = "/doctorDashboard";
        }
      })
      .catch(() => {/* not logged in, stay here */});
  }, []);

  const login = (e) => {
    e.preventDefault();
    const doctor = { email, password };
    axios
      .post("/doctor/login", doctor) // legacy form login (optional)
      .then((res) => {
        if (res.data.rst === "success") {
          // legacy flow kept for backward-compat
          alert("Login successful");
          window.location.href = "/doctorDashboard";
        } else if (res.data.rst === "incorrect password") {
          alert("Incorrect password");
        } else if (res.data.rst === "invalid doctor") {
          alert("Invalid user");
        }
      })
      .catch(() => alert("An error occurred during login"));
  };

  // 👉 Start Google OpenID for Doctor
  const googleLogin = () => {
    window.location.href = `${API_BASE}/auth/login?role=doctor`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-blue-300 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-sm w-full flex flex-col items-center">
        <img className="w-24 mb-6" src="/images/Hospital-logo-W.png" alt="Hospital Logo" />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Login</h1>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={googleLogin}
          className="w-full mb-6 flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          <img src="https://www.google.com/favicon.ico" alt="G" className="h-4 w-4" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center w-full mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Legacy email/password form (optional) */}
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

export default DoctorLogin;
