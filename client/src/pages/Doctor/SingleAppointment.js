import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import SinglePrescription from "../../components/Doctor/SinglePrescription";

const SingleAppointment = ({ apt }) => {
  const logo = new Image();
  logo.src = "/images/Hospital-logo-W.png";

  const [patient, setPatient] = useState({});
  const [pid, setPid] = useState(apt.patient);
  const [beforAfter, setBeforeAfter] = useState("After");

  const [morning, setMorning] = useState(false);
  const [evening, setEvening] = useState(false);
  const [night, setNight] = useState(false);

  const [morningQ, setMorningQ] = useState(0);
  const [eveningQ, setEveningQ] = useState(0);
  const [nightQ, setNightQ] = useState(0);

  const [text, setText] = useState("");
  const [drug, setDrug] = useState("");
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8070/inventory")
      .then((response) => {
        setInventory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching inventory:", error);
      });

    getPrescriptions();
    patientDetails();
  }, []);

  const addToPres = async (e) => {
    e.preventDefault();
    setText(
      `${text}\n  ${drug} [ ${beforAfter} Meal ] (Price: $${price}) :\n\t Morning - ${morningQ} \n\t Evening - ${eveningQ} \n\t Night - ${nightQ} \n`
    );
    alert("Prescription added!");
  };

  const patientDetails = async () => {
    axios
      .get(`http://localhost:8070/patient/get/${apt.patient}`)
      .then((res) => {
        setPatient(res.data.patient);
      })
      .catch((err) => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  };

  const getPrescriptions = async () => {
    axios
      .get(`http://localhost:8070/prescription/appointmentPrescriptions/${apt._id}`)
      .then((res) => {
        setPrescriptions(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBeforeAndAfter = (e) => {
    setBeforeAfter(e.target.value);
  };

  const generatePres = (e) => {
    e.preventDefault();

    const newPrescription = {
      text,
      apt,
      pid,
    };

    axios
      .post("http://localhost:8070/prescription/add", newPrescription)
      .then(() => {
        alert("Prescription added!");
      })
      .catch((err) => {
        alert(err);
      });
  };

  const markConsulted = () => {
    axios
      .put(`http://localhost:8070/appointment/markConsulted/${apt._id}`)
      .then(() => {
        alert("Appointment marked as consulted");
      })
      .catch((err) => {
        alert(err);
      });
  };

  function downloadProfile() {
    const doc = new jsPDF();
    const margin = 10;

    const textContent = `\n\nPatient Report \n\n
      Name : ${patient.firstName}  ${patient.lastName} \n
      Date of Birth : ${new Date(patient.dob).toDateString()} \n
      Email : ${patient.email} \n
      Gender : ${patient.gender}\n
      Height : ${patient.height} \n
      Weight : ${patient.weight} \n
      Phone : ${patient.phoneNo}\n
      Blood Group : ${patient.bloodGroup}\n
      Civil Status : ${patient.civilStatus} \n
      Medical Status : ${patient.medicalStatus}\n
      Emergency Phone : ${patient.emergencyPhone}\n
      Guardian Name : ${patient.guardianName}\n
      Guardian NIC : ${patient.guardianNIC}\n
      Guardian Phone No : ${patient.guardianPhone}\n
      Insurance No : ${patient.insuranceNo} \n
      Insurance Company : ${patient.insuranceCompany} \n`;

    const splitText = doc.splitTextToSize(textContent, doc.internal.pageSize.width - margin * 2);
    doc.text(splitText, 10, 60);

    const pdfWidth = doc.internal.pageSize.getWidth();

    const canvas1 = document.createElement("canvas");
    canvas1.width = logo.width;
    canvas1.height = logo.height;
    const ctx1 = canvas1.getContext("2d");
    ctx1.drawImage(logo, 0, 0, logo.width, logo.height);
    const dataURL1 = canvas1.toDataURL("image/png");

    doc.addImage(dataURL1, "PNG", 15, 10, 30, 30);
    doc.setFontSize(12);
    doc.text("Helasuwa.lk", 50, 15);
    doc.text("Tel: 0771231231", 50, 22);
    doc.text("Address: No:11, Kandy road", 50, 29);

    doc.save(`${patient._id}.pdf`);
  }

  const handleDrugChange = (e) => {
    const selectedDrug = e.target.value;
    setDrug(selectedDrug);

    const selectedItem = inventory.find((item) => item.item_name === selectedDrug);
    setPrice(selectedItem ? selectedItem.price : 0);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start border-b pb-6 mb-6">
          <img src="/images/Hospital-logo-W.png" alt="Hospital Logo" className="w-24 h-24 object-contain mb-4 md:mb-0 md:mr-6" />
          <div>
          <h2 className="text-2xl font-bold text-gray-800">Patient Name: {patient.firstName} {patient.lastName}</h2>
            <h2 className="text-gray-600 mt-2">Appointment ID: {apt._id}</h2>
          
            <p className="text-gray-600">Appointment No: {apt.appointmentNo}</p>
            <button
              onClick={downloadProfile}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
              View Patient Details
            </button>
          </div>
        </div>

        {/* Prescription Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Prescription Text</label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              placeholder="Enter prescription details here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>

          {/* Drug Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Select Medicine</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={drug}
                onChange={handleDrugChange}
              >
                <option value="" disabled>Select Medicine</option>
                {inventory.map((item) => (
                  <option key={item.item_id} value={item.item_name}>{item.item_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Price</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                placeholder="Price"
                value={price > 0 ? `$${price}` : ""}
                readOnly
              />
            </div>
          </div>

          {/* Before/After Meal */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Meal Timing</label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="beforeAfter"
                  value="Before"
                  checked={beforAfter === "Before"}
                  onChange={handleBeforeAndAfter}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Before Meal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="beforeAfter"
                  value="After"
                  checked={beforAfter === "After"}
                  onChange={handleBeforeAndAfter}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">After Meal</span>
              </label>
            </div>
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Dosage</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Morning */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={morning}
                  onChange={() => setMorning(!morning)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="text-gray-700">Morning</span>
                <input
                  type="number"
                  placeholder="Qty"
                  value={morning ? morningQ : ""}
                  disabled={!morning}
                  onChange={(e) => setMorningQ(e.target.value)}
                  className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Evening */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={evening}
                  onChange={() => setEvening(!evening)}
                  className="form-checkbox h-5 w-5 text-yellow-600"
                />
                <span className="text-gray-700">Evening</span>
                <input
                  type="number"
                  placeholder="Qty"
                  value={evening ? eveningQ : ""}
                  disabled={!evening}
                  onChange={(e) => setEveningQ(e.target.value)}
                  className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Night */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={night}
                  onChange={() => setNight(!night)}
                  className="form-checkbox h-5 w-5 text-purple-600"
                />
                <span className="text-gray-700">Night</span>
                <input
                  type="number"
                  placeholder="Qty"
                  value={night ? nightQ : ""}
                  disabled={!night}
                  onChange={(e) => setNightQ(e.target.value)}
                  className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={generatePres}
              className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg shadow hover:bg-green-700 transition duration-300"
            >
              Generate Prescription
            </button>
            <button
              onClick={addToPres}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
              Add To Prescription
            </button>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Prescriptions</h3>
          {prescriptions.length > 0 ? (
            <div className="space-y-4">
              {prescriptions.map((item) => (
                <SinglePrescription key={item._id} prescription={item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No prescriptions available.</p>
          )}
        </div>

        {/* Consultation Status */}
        <div className="mt-8 text-center">
          {apt.consulted ? (
            <button className="bg-gray-400 text-white px-6 py-3 rounded-lg shadow cursor-not-allowed">
              Consulted
            </button>
          ) : (
            <button
              onClick={markConsulted}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition duration-300"
            >
              Mark as Consulted
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleAppointment;
