import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PatientHeader from "../Payment/Patientheader";
import PatientSideBar from "../PatientSideBar";

const MakeAppointment = () => {
  let { cid } = useParams();
  const [email, setEmail] = useState("");
  const [patient, setPatient] = useState("");
  const [channel, setChannel] = useState([]);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [contact, setContact] = useState(null);
  const [gender, setGender] = useState(null);
  const [doctor, setDoctor] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [drName, setDrName] = useState("");

  useEffect(() => {
    getUser();
    getChannel();
  }, []);

  const getChannel = async () => {
    axios
      .get(`http://localhost:8070/channel/get/${cid}`)
      .then((res) => {
        setChannel(res.data.Channel);
        setDoctor(res.data.Channel.doctor);
        setStartDateTime(res.data.Channel.startDateTime);
        setDrName(res.data.Channel.drName);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  function getUser() {
    axios
      .get("http://localhost:8070/patient/check/", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setEmail(res.data.patient.email);
        setPatient(res.data.patient._id);
      })
      .catch((err) => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }

  const validatePhone = (phn) => {
    const phoneNumberPattern = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneNumberPattern.test(phn);
  };

  function makeApt(e) {
    e.preventDefault();
    if (age >= 0) {
      if (validatePhone(contact)) {
        const newApt = {
          channel,
          patient,
          notes,
          name,
          age,
          contact,
          gender,
        };
        axios
          .post("http://localhost:8070/appointment/makeapt", newApt)
          .then((res) => {
            alert("Appointment Made");
          })
          .catch((err) => {
            alert(err);
          });
      } else {
        alert("Invalid phone number");
      }
    } else {
      alert("Age should be 0 or greater");
    }
  }

  return (
    <div>
      {/* Updated header */}
      <PatientHeader />

      <div className="flex">
        {/* Updated sidebar */}
        <PatientSideBar />

        <div className="ml-[220px] mt-[80px] p-8 flex-1 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Make an Appointment</h1>

          <h4 className="text-lg font-semibold">Channeling Doctor: {channel.drName}</h4>
          <h4 className="text-md text-gray-600">Channeling Date and Time: {new Date(channel.startDateTime).toString()}</h4>

          <form onSubmit={makeApt} className="mt-6 space-y-4">
            <input
              className="apt-inputs block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
              type="text"
              placeholder="Patient Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="apt-inputs block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
              type="number"
              placeholder="Patient Age"
              onChange={(e) => setAge(e.target.value)}
            />
            <input
              className="apt-inputs block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
              type="number"
              placeholder="Patient Contact No"
              onChange={(e) => setContact(e.target.value)}
            />
            <select
              className="apt-inputs block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <textarea
              className="apt-inputs block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="Any Special Notes"
              onChange={(e) => setNotes(e.target.value)}
              cols="30"
              rows="10"
            />
            <button className="btn-makeApt w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md">
              Make Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeAppointment;
