import React from "react";
import axios from "axios";
import jsPDF from "jspdf";

const StaffRow = ({ item }) => {
  const logo = new Image();
  logo.src = "/images/Hospital-logo-W.png";

  const deleteStaff = async () => {
    axios
      .delete(`http://localhost:8070/admin/delete/${item._id}`)
      .then(() => {
        alert("Staff Deleted");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const downloadStaff = () => {
    const doc = new jsPDF();
    const margin = 10;

    const text = `
      Staff Report\n\n
      Name: ${item.name}\n
      Staff ID: ${item._id}\n
      Email: ${item.email}\n
      Role: ${item.roleName}\n
      Allocated Work: ${item.allocatedWork}
    `;
    const splitText = doc.splitTextToSize(
      text,
      doc.internal.pageSize.width - margin * 2
    );
    doc.text(splitText, 10, 60);

    const pdfWidth = doc.internal.pageSize.getWidth();
    const canvas1 = document.createElement("canvas");
    canvas1.width = logo.width;
    canvas1.height = logo.height;
    const ctx1 = canvas1.getContext("2d");
    ctx1.drawImage(logo, 0, 0, logo.width, logo.height);
    const dataURL1 = canvas1.toDataURL("image/png");

    doc.addImage(
      dataURL1,
      "PNG",
      5,
      5,
      pdfWidth / 4,
      (pdfWidth / 4) * (logo.height / logo.width)
    );
    doc.text(
      "Helasuwa.lk\nTel: 0771231231\nAddress: No:11, Kandy road",
      pdfWidth / 4 + 15,
      20
    );

    doc.save(`${item._id}.pdf`);
  };

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-6 py-3 font-medium">{item._id}</td>
      <td className="px-6 py-3 font-medium">{item.name}</td>
      <td className="px-6 py-3">{item.email}</td>
      <td className="px-6 py-3">{item.phone}</td>
      <td className="px-6 py-3">{item.roleName}</td>
      <td className="px-6 py-3">{item.allocatedWork}</td>
      <td className="px-6 py-3 flex space-x-2">
        <button
          onClick={deleteStaff}
          className="px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all duration-200 transform hover:scale-105"
        >
          Delete
        </button>
        <a href={`/editStaff/${item._id}`}>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-full shadow-md hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105">
            Edit
          </button>
        </a>
        <button
          onClick={downloadStaff}
          className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
        >
          Download
        </button>
      </td>
    </tr>
  );
};

export default StaffRow;
