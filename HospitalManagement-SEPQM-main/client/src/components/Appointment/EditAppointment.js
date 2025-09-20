import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PatientHeader from "../Payment/Patientheader";
import PatientSideBar from "../PatientSideBar";


const EditAppointment = (props) => {
  let { aid, cid } = useParams();

  const [channel, setChannel] = useState([]);
  const [notes, setNotes] = useState("");
  const [appointment, setAppointment] = useState([]);

  const [name, setName] = useState("");
  const [age, setAge] = useState(null);
  const [contact, setContact] = useState(null);
  const [gender, setGender] = useState(null);

  useEffect(() => {
    getApt();
    getChannel();
  }, []);

  const getApt = async () => {
    await axios
      .get(`http://localhost:8070/appointment/get/${aid}`)
      .then((res) => {
        setAppointment(res.data.apt);
        setNotes(res.data.apt.notes);
        setName(res.data.apt.name) ;
        setAge(res.data.apt.age) ;
        setContact(res.data.apt.contact) ;
        setGender(res.data.apt.gender) ;

        console.log(res.data.apt.age);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const getChannel = async () => {
    await axios
      .get(`http://localhost:8070/channel/get/${cid}`)
      .then((res) => {
        setChannel(res.data.Channel);

        console.log(res.data.Channel);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  function editApt(e) {
    e.preventDefault();

    const updatedApt = {
      notes,
      
    };
    axios
      .put(`http://localhost:8070/appointment/update/${aid}`, updatedApt)
      .then((res) => {
        alert("Appointment Udpated");
      })
      .catch((err) => {
        alert(err);
      });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.setItem("previous", false);
    alert("You have logged out");
    window.location.href = "/";
  }
  return (
    <div className="flex">
      <PatientHeader />
      <PatientSideBar />

      <div className="flex-1 p-8 mt-16 bg-gray-50 min-h-screen ml-64"> {/* Added margin-left for sidebar */}
        <h1 className="text-3xl font-semibold mb-6">Edit Appointment</h1>

        <div className="channel-details-apt mb-6 bg-white p-4 shadow rounded-lg">
          <h4 className="text-lg font-bold">Channeling Doctor: {channel.drName}</h4>
          <h4 className="text-gray-600">
            Channeling Date and Time: {new Date(channel.startDateTime).toString()}
          </h4>
        </div>

        <form onSubmit={editApt} className="space-y-4">
          <input
            className="apt-inputs w-full px-4 py-2 border border-gray-300 rounded-lg"
            type="text"
            placeholder="Patient Name"
            defaultValue={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <input
            className="apt-inputs w-full px-4 py-2 border border-gray-300 rounded-lg"
            type="number"
            placeholder="Patient Age"
            defaultValue={age}
            onChange={(e) => {
              setAge(e.target.value);
            }}
          />

          <input
            className="apt-inputs w-full px-4 py-2 border border-gray-300 rounded-lg"
            type="tel"
            placeholder="Contact No"
            defaultValue={contact}
            onChange={(e) => {
              setContact(e.target.value);
            }}
          />

          <select
            className="apt-inputs w-full px-4 py-2 border border-gray-300 rounded-lg"
            defaultValue={gender}
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <textarea
            className="apt-inputs w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Any Special Notes"
            cols="30"
            rows="10"
            defaultValue={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
          ></textarea>

          <button
            className="btn-makeApt bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
            type="submit"
          >
            Update and Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAppointment;
