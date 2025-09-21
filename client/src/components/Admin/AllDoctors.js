import React, { useEffect, useState } from "react";
import axios from "axios";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getDoctors();
  }, []);

  const getDoctors = async () => {
    axios
      .get(`http://localhost:8070/doctor/`)
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteDoctor = (id) => {
    axios
      .delete(`http://localhost:8070/doctor/delete/${id}`)
      .then(() => {
        alert("Doctor Deleted");
        setDoctors(doctors.filter((doctor) => doctor._id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Doctor ID</th>
              <th className="px-4 py-2 text-left">Doctor Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Specialization</th>
              <th className="px-4 py-2 text-left">Qualification</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-2">{doctor._id}</td>
                <td className="px-4 py-2">{doctor.name}</td>
                <td className="px-4 py-2">{doctor.email}</td>
                <td className="px-4 py-2">{doctor.specialization}</td>
                <td className="px-4 py-2">{doctor.qualifications}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => deleteDoctor(doctor._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllDoctors;
