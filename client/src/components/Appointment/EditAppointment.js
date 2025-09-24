import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PatientHeader from "../Payment/Patientheader";
import PatientSideBar from "../PatientSideBar";
import api from "../../api";

const EditAppointment = () => {
  const { aid, cid } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState({});
  const [appointment, setAppointment] = useState(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const tok = localStorage.getItem("token");
    const type = localStorage.getItem("type");
    if (!tok || type !== "patient") {
      navigate("/patientLogin", { replace: true });
      return;
    }
    api.defaults.headers.common.Authorization = `Bearer ${tok}`;

    // define inline so we don't need to add external functions to deps
    const load = async () => {
      try {
        const aptRes = await api.get(`/appointment/get/${aid}`);
        const apt = aptRes.data.apt;
        setAppointment(apt);
        setName(apt?.name || "");
        setAge(apt?.age ?? "");
        setContact(apt?.contact ?? "");
        setGender(apt?.gender || "");
        setNotes(apt?.notes || "");
      } catch (e) {
        alert(e?.response?.data?.error || "Failed to fetch appointment");
      }

      try {
        const chRes = await api.get(`/channel/get/${cid}`);
        setChannel(chRes.data.Channel || {});
      } catch (e) {
        alert(e?.response?.data?.error || "Failed to fetch channel");
      }
    };

    load();
  }, [aid, cid, navigate]);

  const editApt = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/appointment/update/${aid}`, { notes });
      alert("Appointment updated");
      // refresh
      const aptRes = await api.get(`/appointment/get/${aid}`);
      const apt = aptRes.data.apt;
      setNotes(apt?.notes || "");
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "Update failed";
      alert(msg);
      if ([401, 403].includes(err?.response?.status)) {
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        navigate("/patientLogin", { replace: true });
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    alert("You have logged out");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex">
      <PatientHeader onLogout={logout} />
      <PatientSideBar />
      <div className="flex-1 p-8 mt-16 bg-gray-50 min-h-screen ml-64">
        <h1 className="text-3xl font-semibold mb-6">Edit Appointment</h1>

        <div className="mb-6 bg-white p-4 shadow rounded-lg">
          <h4 className="text-lg font-bold">Channeling Doctor: {channel.drName}</h4>
          <h4 className="text-gray-600">
            Channeling Date and Time: {channel.startDateTime ? new Date(channel.startDateTime).toString() : "-"}
          </h4>
        </div>

        <form onSubmit={editApt} className="space-y-4">
          <input className="w-full px-4 py-2 border border-gray-300 rounded-lg" type="text" placeholder="Patient Name" value={name} disabled />
          <input className="w-full px-4 py-2 border border-gray-300 rounded-lg" type="number" placeholder="Patient Age" value={age} disabled />
          <input className="w-full px-4 py-2 border border-gray-300 rounded-lg" type="tel" placeholder="Contact No" value={contact} disabled />
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={gender} disabled>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Any Special Notes" rows="8" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition" type="submit">Update and Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditAppointment;
