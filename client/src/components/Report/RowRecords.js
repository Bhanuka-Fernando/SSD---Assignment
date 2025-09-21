import React from "react";
import jsPDF from "jspdf";
import axios from "axios";

const RowRecords = ({ item }) => {
  const logo = new Image();
  logo.src = "/images/Hospital-logo-W.png";

  const deleteRecord = async () => {
    axios
      .delete(`http://localhost:8070/record/delete/${item._id}`)
      .then((res) => {
        alert("Record Deleted");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const downloadRecord = () => {
    const doc = new jsPDF();
    const margin = 10;
    const lineHeight = 5;

    const text = `\n\nDate: ${new Date(item.date).toString()}\n\nTitle: ${item.title}\nReason: ${item.reason}\n\nPrescriptions: ${item.prescriptions}\nReports: ${item.reports}\nAppointments: ${item.appointments}\nTests: ${item.tests}`;
    const splitText = doc.splitTextToSize(text, doc.internal.pageSize.width - margin * 2);
    doc.text(splitText, 10, 60);

    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();

    const canvas1 = document.createElement("canvas");
    canvas1.width = logo.width;
    canvas1.height = logo.height;
    const ctx1 = canvas1.getContext("2d");
    ctx1.drawImage(logo, 0, 0, logo.width, logo.height);
    const dataURL1 = canvas1.toDataURL("image/png");

    doc.addImage(dataURL1, "PNG", 5, 5, pdfWidth / 4, (pdfWidth / 4) * (logo.height / logo.width));

    doc.text("Helasuwa.lk\nTel: 0771231231\nAddress No: No:11, Kandy Road,\n", pdfWidth / 4 + 15, 20);

    doc.save(`${item._id}.pdf`);
  };

  return (
    <tr className="border-b hover:bg-gray-100">
      <td className="px-4 py-2">{item._id}</td>
      <td className="px-4 py-2">{item.patient}</td>
      <td className="px-4 py-2">{item.title}</td>
      <td className="px-4 py-2">{item.reason}</td>
      <td className="px-4 py-2">{new Date(item.date).toLocaleString()}</td>
      <td className="px-4 py-2 flex space-x-2">
        <button
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={downloadRecord}
        >
          Download
        </button>
        <button
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          onClick={deleteRecord}
        >
          Delete
        </button>
        <a href={"editRecord/" + item._id}>
          <button className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
            Update
          </button>
        </a>
      </td>
    </tr>
  );
};

export default RowRecords;
