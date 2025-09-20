import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DoctorHeader from '../../components/Doctor/DoctorHeader';
import DoctorSidePanel from '../../components/Doctor/DoctorSidePanel';
import DoctorChannels from '../../components/Doctor/DoctorChannels';
import AddChannel from '../../components/Doctor/AddChannel';
import AddPatinetRecord from '../../components/Doctor/AddPatinetRecord';
import AllPatients from '../../components/Doctor/AllPatients';
import DoctorProfile from '../../components/Doctor/DoctorProfile';
import ViewPatient from '../../components/Doctor/Viewpatient';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null); // Initialized as null for loading state
  const [selectedComponent, setSelectedComponent] = useState('channels');
  const [selectedPatientId, setSelectedPatientId] = useState(null); // Track selected patient ID
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token
    } else {
      getUser();
    }
    localStorage.setItem('previous', true);
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8070/doctor/check/', {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      setDoctor(response.data.doctor);
    } catch (error) {
      localStorage.removeItem('token');
      navigate('/'); // Redirect to login if fetching user fails
    }
  };

  const renderContent = () => {
    switch (selectedComponent) {
      case 'channels':
        return <DoctorChannels id={doctor?._id} />;
      case 'addChannel':
        return <AddChannel />;
      case 'addPatinetRecord':
        return <AddPatinetRecord />;
      case 'allPatients':
        return (
          <AllPatients onViewPatient={(patientId) => {
            setSelectedPatientId(patientId); // Set selected patient ID
            setSelectedComponent('viewPatient'); // Switch to ViewPatient component
          }} />
        );
      case 'profile':
        return <DoctorProfile />;
      case 'viewPatient':
        return <ViewPatient id={selectedPatientId} />; // Pass selected patient ID to ViewPatient
      default:
        return <DoctorChannels id={doctor?._id} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Pass doctor name to DoctorHeader */}
      <DoctorHeader doctorName={doctor ? doctor.name : ''} /> 
      <div className="flex flex-1">
        <DoctorSidePanel setSelectedComponent={setSelectedComponent} />
        <div className="flex-1 bg-gray-100 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
