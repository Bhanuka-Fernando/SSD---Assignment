import axios from "axios";
import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react"; // Import QRCodeSVG

const Signup = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianNIC, setGuardianNIC] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [medicalStatus, setMedicalStatus] = useState("");
  const [allergies, setAllergies] = useState("");
  const [insuranceNo, setInsuranceNo] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");

  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState(""); // Add this line to define qrCodeValue state

  const qrCodeRef = useRef(null); // Reference for the QR code canvas

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

  function createPatient(e) {
    e.preventDefault();

    if (validateEmail(email)) {
      if (validatePassword(password)) {
        if (validatePhone(phone)) {
          if (cpassword === password) {
            if (validatePhone(emergencyPhone)) {
              const newPatient = {
                email,
                password,
                firstName,
                lastName,
                dob,
                gender,
                civilStatus,
                phone,
                emergencyPhone,
                guardianNIC,
                guardianName,
                guardianPhone,
                height,
                weight,
                bloodGroup,
                allergies,
                medicalStatus,
                insuranceNo,
                insuranceCompany,
              };

              // Generate QR code data from patient details
              const qrData = JSON.stringify(newPatient);
              setQrCodeValue(qrData); // Set the QR code value

              axios
                .post("http://localhost:8070/patient/add/", newPatient)
                .then((res) => {
                  if (res.data === "exist") {
                    alert("Email already exists");
                  } else {
                    alert("Patient Created");
                    //window.location.href = "/patientLogin";
                  }
                })
                .catch((err) => {
                  alert(err);
                });
            } else {
              alert("Invalid Emergency Phone No!");
            }
          } else {
            alert("Passwords don't match");
          }
        } else {
          alert("Invalid Phone Number");
        }
      } else {
        alert(
          "Password must contain 8 characters including 1 lowercase letter, 1 uppercase letter, 1 number, and at least 1 special character"
        );
      }
    } else {
      alert("Invalid Email");
    }
  }

const downloadQRCode = () => {
    const canvas = qrCodeRef.current.querySelector("canvas");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "qr-code.png";
      link.click();
    } else {
      alert("QR code not generated yet.");
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Patient Registration</h1>
        <form onSubmit={createPatient}>
          {/* Patient Details */}
          <div className="mb-4">
            <input
              className="input-fields w-full p-2 border rounded mb-3"
              type="text"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              className="input-fields w-full p-2 border rounded mb-3"
              type="text"
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              className="input-fields w-full p-2 border rounded mb-3"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="input-fields w-full p-2 border rounded mb-3"
              type="number"
              placeholder="Phone No"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <label className="block mb-1">Date of Birth</label>
            <input
              className="input-fields w-full p-2 border rounded mb-3"
              type="date"
              onChange={(e) => setDob(e.target.value)}
              required
            />
            <select
              className="input-fields w-full p-2 border rounded mb-3"
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              className="input-fields w-full p-2 border rounded mb-3"
              onChange={(e) => setCivilStatus(e.target.value)}
              required
            >
              <option value="">Civil Status</option>
              <option value="Married">Married</option>
              <option value="Single">Single</option>
              <option value="Other">Other</option>
            </select>
            <input
              className="input-fields w-full p-2 border rounded mb-3"
              type="number"
              placeholder="Height In cm"
              onChange={(e) => setHeight(e.target.value)}
              required
            />
            <input
              className="input-fields w-full p-2 border rounded mb-3"
              type="number"
              placeholder="Weight In Kg"
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            <select
              className="input-fields w-full p-2 border rounded mb-3"
              onChange={(e) => setBloodGroup(e.target.value)}
              required
            >
              <option value="">Blood Group</option>
              <option value="A+">A positive</option>
              <option value="A-">A negative</option>
              <option value="B+">B positive</option>
              <option value="B-">B negative</option>
              <option value="O+">O positive</option>
              <option value="O-">O negative</option>
              <option value="AB+">AB positive</option>
              <option value="AB-">AB negative</option>
            </select>
            <input
              className="input-fields w-full p-2 border rounded mb-3"
              type="text"
              placeholder="Medical Status Eg: Cancer Patient"
              onChange={(e) => setMedicalStatus(e.target.value)}
              required
            />
            <input
              className="input-fields w-full p-2 border rounded mb-3"
              type="text"
              placeholder="Allergies"
              onChange={(e) => setAllergies(e.target.value)}
              required
            />
            <input
              className="input-fields w-full p-2 border rounded mb-3"
              type="number"
              placeholder="Emergency Contact No"
              onChange={(e) => setEmergencyPhone(e.target.value)}
              required
            />
              <input
              className="input-fields w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 mb-3"
              type="text"
              placeholder="Insurance No"
              onChange={(e) => setInsuranceNo(e.target.value)}
            />
            <input
              className="input-fields w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 mb-3"
              type="text"
              placeholder="Insurance Company"
              onChange={(e) => setInsuranceCompany(e.target.value)}
            />
          </div>

          {/* Guardian Details */}
          <h4 className="font-semibold mb-2">Guardian Details</h4>
          <input
            className="input-fields w-full p-2 border rounded mb-3"
            type="text"
            placeholder="Guardian Name"
            onChange={(e) => setGuardianName(e.target.value)}
          />
          <input
            className="input-fields w-full p-2 border rounded mb-3"
            type="number"
            placeholder="Guardian NIC"
            onChange={(e) => setGuardianNIC(e.target.value)}
          />
          <input
            className="input-fields w-full p-2 border rounded mb-3"
            type="number"
            placeholder="Guardian Phone"
            onChange={(e) => setGuardianPhone(e.target.value)}
          />
         

          {/* Account Information */}
          <h4 className="font-semibold mb-2">Account Information</h4>
          <input
            className="input-fields w-full p-2 border rounded mb-3"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="input-fields w-full p-2 border rounded mb-3"
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setCpassword(e.target.value)}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
          >
            Submit
          </button>
        </form>

      
        {qrCodeValue && (
          <div className="mt-6 text-center" ref={qrCodeRef}>
            <QRCodeSVG value={qrCodeValue} size={128} />
            
            <p className="mt-2">Your QR Code</p>
            <button
              onClick={downloadQRCode}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Download QR Code
            </button>
          </div>
        )}
          
      </div>
    </div>
  );
};

export default Signup;

