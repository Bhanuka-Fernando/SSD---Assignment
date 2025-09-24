import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PatientHeader from "../Payment/Patientheader";
import PatientSideBar from "../PatientSideBar";
import api from "../../api";

const MakeAppointment = () => {
  const { cid } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState({});
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    const tok = localStorage.getItem("token");
    const type = localStorage.getItem("type");
    if (!tok || type !== "patient") {
      navigate("/patientLogin", { replace: true });
      return;
    }
    api.defaults.headers.common.Authorization = `Bearer ${tok}`;

    const load = async () => {
      try {
        await api.get("/patient/check"); // validates token
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        navigate("/patientLogin", { replace: true });
        return;
      }

      try {
        const { data } = await api.get(`/channel/get/${cid}`);
        setChannel(data.Channel || {});
      } catch (e) {
        alert(e?.response?.data?.error || "Failed to fetch channel");
      }
    };

    load();
  }, [cid, navigate]);

  const validatePhone = (phn) =>
    /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(String(phn || ""));

  const makeApt = async (e) => {
    e.preventDefault();

    const ageNum = Number(age);
    if (!(ageNum >= 0)) return alert("Age should be 0 or greater");
    if (!validatePhone(contact)) return alert("Invalid phone number");

    const payload = {
      channel,         // must contain channel._id
      notes,
      name,
      age: ageNum,
      contact: String(contact),
      gender,
    };

    try {
      await api.post("/appointment/makeapt", payload);
      alert("Appointment made");
      navigate("/myAppointments");
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "Failed to make appointment";
      alert(msg);
      if ([401, 403].includes(err?.response?.status)) {
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        navigate("/patientLogin", { replace: true });
      }
    }
  };

  return (
    <div>
      <PatientHeader />
      <div className="flex">
        <PatientSideBar />
        <div className="ml-[220px] mt-[80px] p-8 flex-1 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Make an Appointment</h1>
          <h4 className="text-lg font-semibold">Channeling Doctor: {channel.drName || "-"}</h4>
          <h4 className="text-md text-gray-600">Channeling Date and Time: {channel.startDateTime ? new Date(channel.startDateTime).toString() : "-"}</h4>

          <form onSubmit={makeApt} className="mt-6 space-y-4">
            <input className="apt-inputs block w-full border border-gray-300 p-2 rounded-md shadow-sm" type="text" placeholder="Patient Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="apt-inputs block w-full border border-gray-300 p-2 rounded-md shadow-sm" type="number" placeholder="Patient Age" value={age} onChange={(e) => setAge(e.target.value)} required min="0" />
            <input className="apt-inputs block w-full border border-gray-300 p-2 rounded-md shadow-sm" type="tel" placeholder="Patient Contact No" value={contact} onChange={(e) => setContact(e.target.value)} required />
            <select className="apt-inputs block w-full border border-gray-300 p-2 rounded-md shadow-sm" value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <textarea className="apt-inputs block w-full border border-gray-300 p-2 rounded-md shadow-sm" placeholder="Any Special Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="8" />
            <button className="btn-makeApt w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md">Make Appointment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeAppointment;