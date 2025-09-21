import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:8070/appointment/all'); // Adjust the API URL
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleViewClick = (appointmentId) => {
    navigate(`/appointment/${appointmentId}`); // Navigate to single appointment view
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-semibold mb-4">Appointments List</h1>
      {appointments.length === 0 ? (
        <p>No appointments available.</p>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <h3>Appointment ID: {appointment._id}</h3>
                <p>Doctor: {appointment.doctorName}</p>
                <p>Date: {new Date(appointment.date).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleViewClick(appointment._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
