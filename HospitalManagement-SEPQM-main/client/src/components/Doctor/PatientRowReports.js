import React from "react";
import jsPDF from "jspdf";

export default function PatientRowReports({ item }) {
  const logo = new Image();
  logo.src = "/images/Hospital-logo-W.png";

  function downloadReport() {
    const doc = new jsPDF();
    const margin = 10;

    const text = `\n\nDate: ${new Date(item.date).toString()} \n\n Result: ${
      item.result ? "Positive" : "Negative"
    }\n\n Details: ${item.details}`;
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
      "Helasuwa.lk \nTel: 0771231231 \nAddress No: No:11, Kandy road,\n",
      pdfWidth / 4 + 15,
      20
    );

    doc.save(`${item._id}.pdf`);
  }

  return (
    <tr className="border-b hover:bg-gray-50 transition duration-200">
      <td className="px-4 py-3 text-gray-700">{item._id}</td>
      <td className="px-4 py-3 text-gray-700">
        {new Date(item.date).toLocaleString()}
      </td>
      <td className="px-4 py-3 text-gray-700">{item.test}</td>
      <td className="px-4 py-3 text-gray-700">{item.details}</td>
      <td className="px-4 py-3 text-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200"
          onClick={downloadReport}
        >
          Download
        </button>
      </td>
    </tr>
  );
}
