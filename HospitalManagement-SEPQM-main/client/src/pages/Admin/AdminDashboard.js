import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import DashboardHeader from "../../components/DashboardHeader";
import SideNav from "../../components/Admin/SideNav";
import AllDoctors from "../../components/Admin/AllDoctors";
import AllStaff from "../../components/Admin/AllStaff";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [doctorCount, setDoctorCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [channelCount, setChannelCount] = useState(0);
  const [insuranceClaimCount, setInsuranceClaimCount] = useState(0);

  useEffect(() => {
    fetchCounts();
    fetchChannelsAndClaims();
    calculateRevenue();
  }, []);

  const fetchCounts = async () => {
    try {
      const doctorRes = await axios.get("http://localhost:8070/doctor/");
      setDoctorCount(doctorRes.data.length);

      const staffRes = await axios.get("http://localhost:8070/admin/");
      setStaffCount(staffRes.data.length);

      const patientRes = await axios.get("http://localhost:8070/patient/");
      setPatientCount(patientRes.data.length);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const fetchChannelsAndClaims = async () => {
    try {
      const channelRes = await axios.get("http://localhost:8070/channel/");
      setChannelCount(channelRes.data.length);

      const claimsRes = await axios.get("http://localhost:8070/insurance/");
      setInsuranceClaimCount(claimsRes.data.length);
    } catch (error) {
      console.error("Error fetching channels and claims:", error);
    }
  };

  const calculateRevenue = async () => {
    try {
      const appointmentRes = await axios.get("http://localhost:8070/appointment/");
      const revenue = appointmentRes.data.length * 100; // Assuming each appointment is $100
      setMonthlyRevenue(revenue);
    } catch (error) {
      console.error("Error calculating revenue:", error);
    }
  };

  const revenueData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Revenue",
        data: [500, 600, 700, 800, 900, monthlyRevenue],
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.4)",
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ["Doctors", "Patients"],
    datasets: [
      {
        label: "Count",
        data: [doctorCount, patientCount],
        backgroundColor: ["#4A90E2", "#50E3C2"],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header at the top */}
      <DashboardHeader />

      {/* Main Content Area with Sidebar and Flexible Layout */}
      <div className="flex flex-grow flex-col md:flex-row">
        
        {/* Sidebar (Fixed on the left for larger screens) */}
        <SideNav />

        {/* Main content area, flexible and responsive */}
        <div className="flex-grow p-6 bg-white overflow-auto">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Doctors", value: doctorCount, color: "bg-gradient-to-r from-blue-500 to-blue-400" },
              { label: "Total Staff", value: staffCount, color: "bg-gradient-to-r from-green-500 to-green-400" },
              { label: "Total Patients", value: patientCount, color: "bg-gradient-to-r from-yellow-500 to-yellow-400" },
              { label: "Monthly Revenue", value: `$${monthlyRevenue}`, color: "bg-gradient-to-r from-pink-500 to-pink-400" },
              { label: "Total Channels", value: channelCount, color: "bg-gradient-to-r from-indigo-500 to-indigo-400" },
              { label: "Insurance Claims", value: insuranceClaimCount, color: "bg-gradient-to-r from-red-500 to-red-400" }
            ].map((item, index) => (
              <div
                key={index}
                className={`${item.color} shadow-lg rounded-2xl p-6 text-center transform transition-transform hover:scale-105`}
              >
                <h2 className="text-lg font-semibold text-white mb-2">{item.label}</h2>
                <p className="text-4xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Graph Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Revenue Over Time</h2>
              <Line data={revenueData} />
            </div>
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Doctor vs. Patient Ratio</h2>
              <Bar data={barData} />
            </div>
          </div>

          {/* Data Tables */}
          <div className="bg-white shadow-lg rounded-2xl p-8 mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Doctors</h2>
            <AllDoctors />
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-8 mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Staff</h2>
            <AllStaff />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
