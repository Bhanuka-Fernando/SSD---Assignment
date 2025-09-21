import Patientheader from "../Payment/Patientheader";

import React, { useEffect, useState } from "react";
import axios from "axios";

const EditPatientProfile = () => {
  const [patient, setPatient] = useState([]);
  const [pid, setPid] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState("");

  const [civilStatus, setCivilStatus] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [gaurdianName, setGaurdianName] = useState("");
  const [gaurdianNIC, setGaurdianNIC] = useState("");
  const [gaurdianPhone, setGaurdianPhone] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [medicalStatus, setMedicalStatus] = useState("");
  const [allergies, setAllergies] = useState("");
  const [insuranceNo, setInsuranceNo] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return emailRegex.test(email);
  };

  const validatePassword = (tpassword) => {
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return pattern.test(tpassword);
  };

  const validatePhone = (phn) => {
    const phoneNumberPattern = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneNumberPattern.test(phn);
  };

  function getUser() {
    axios
      .get("http://localhost:8070/patient/check/", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPatient(res.data.patient);
        setPid(res.data.patient._id);
        setFirstName(res.data.patient.firstName);
        setLastName(res.data.patient.lastName);
        setEmail(res.data.patient.email);
        setGender(res.data.patient.gender);
        setDob(new Date(res.data.patient.dob));
        setPassword(res.data.patient.password);
        setConfirm(res.data.patient.password);
        setCivilStatus(res.data.patient.civilStatus);
        setPhone(res.data.patient.phoneNo);
        setEmergencyPhone(res.data.patient.emergencyPhone);
        setGaurdianNIC(res.data.patient.gaurdianNIC);
        setGaurdianName(res.data.patient.gaurdianName);
        setGaurdianPhone(res.data.patient.gaurdianPhone);
        setHeight(res.data.patient.height);
        setWeight(res.data.patient.weight);
        setBloodGroup(res.data.patient.bloodGroup);
        setMedicalStatus(res.data.patient.medicalStatus);
        setAllergies(res.data.patient.allergies);
        setInsuranceNo(res.data.patient.insuranceNo);
        setInsuranceCompany(res.data.patient.insuranceCompany);

        console.log(res.data.patient.height);
      })
      .catch((err) => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }

  function updatePatient(e) {
    e.preventDefault();

    const updatedPatient = {
      firstName,
      lastName,
      dob,
      email,
      gender,
      password,
      civilStatus,
      phone,
      emergencyPhone,
      gaurdianNIC,
      gaurdianName,
      gaurdianPhone,
      height,
      weight,
      bloodGroup,
      allergies,
      medicalStatus,
      insuranceNo,
      insuranceCompany,
    };

    if (validateEmail(email)) {
      if (validatePassword(password)) {
        if (validatePhone(phone)) {
          if (password == confirm) {
            axios
              .put(
                `http://localhost:8070/patient/update/${pid}`,
                updatedPatient
              )
              .then((res) => {
                alert("Patient profile updated!!");
                window.location.reload();
              })
              .catch(function (error) {
                console.log(error);
              });
          } else {
            alert("Password Do not Match");
          }
        } else {
          alert("Invalid Phone Number");
        }
      } else {
        alert(
          "Password must contain 8 characters including 1 lower case letter , one upper case letter , one number and at least one special character"
        );
      }
    } else {
      alert("Invalid Email");
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Patientheader />
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Edit Patient Profile</h2>

          <form onSubmit={updatePatient} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type="text"
                id="firstName"
                defaultValue={patient.firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type="text"
                id="lastName"
                defaultValue={patient.lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="dob">
                Date Of Birth
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type="date"
                id="dob"
                value={dob.toISOString().split("T")[0]}
                onChange={(e) => setDob(new Date(e.target.value))}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type="email"
                id="email"
                defaultValue={patient.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="gender">
                Gender
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                defaultValue={patient.gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="phone">
                Phone No
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type="text"
                id="phone"
                defaultValue={patient.phoneNo}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Other form inputs with similar Tailwind CSS styling */}
       
  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Phone No
    </label>
    <input
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      defaultValue={patient.phoneNo}
      onChange={(e) => setPhone(e.target.value)}
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Civil Status
    </label>
    <select
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      defaultValue={patient.civilStatus}
      onChange={(e) => setCivilStatus(e.target.value)}
    >
      <option value="Married">Married</option>
      <option value="Single">Single</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Height
    </label>
    <input
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="number"
      defaultValue={patient.height}
      onChange={(e) => setHeight(e.target.value)}
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Weight
    </label>
    <input
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="number"
      defaultValue={patient.weight}
      onChange={(e) => setWeight(e.target.value)}
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Blood Group
    </label>
    <select
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      defaultValue={patient.bloodGroup}
      onChange={(e) => setBloodGroup(e.target.value)}
    >
      <option value="A+">A positive</option>
      <option value="A-">A negative</option>
      <option value="B+">B positive</option>
      <option value="B-">B negative</option>
      <option value="O+">O positive</option>
      <option value="O-">O negative</option>
      <option value="AB+">AB positive</option>
      <option value="AB-">AB negative</option>
    </select>
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Medical Status
    </label>
    <input
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      defaultValue={patient.medicalStatus}
      onChange={(e) => setMedicalStatus(e.target.value)}
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Allergies
    </label>
    <input
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      defaultValue={patient.allergies}
      onChange={(e) => setAllergies(e.target.value)}
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Emergency Phone No
    </label>
    <input
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      defaultValue={patient.emergencyPhone}
      onChange={(e) => setEmergencyPhone(e.target.value)}
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Guardian Name
    </label>
    <input
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      defaultValue={patient.gaurdianName}
      onChange={(e) => setGaurdianName(e.target.value)}
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Guardian NIC
    </label>
    <input
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      defaultValue={patient.gaurdianNIC}
      onChange={(e) => setGaurdianNIC(e.target.value)}
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Insurance No
    </label>
    <input
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      defaultValue={patient.insuranceNo}
      onChange={(e) => setInsuranceNo(e.target.value)}
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Insurance Company
    </label>
    <input
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      defaultValue={patient.insuranceCompany}
      onChange={(e) => setInsuranceCompany(e.target.value)}
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Password
    </label>
    <input
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="password"
      defaultValue={patient.password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      Confirm Password
    </label>
    <input
      className="profile-inputs w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="password"
      defaultValue={patient.password}
      onChange={(e) => setConfirm(e.target.value)}
    />
  </div>

  <div className="flex justify-end">
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition-all duration-200">
      Update and Save
    </button>
  </div>
</form>

           
        </div>
      </div>
    </div>
  );
};

export default EditPatientProfile;
