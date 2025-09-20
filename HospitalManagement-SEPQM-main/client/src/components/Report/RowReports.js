import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";

const RowReports = ({ item }) => {
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/images/Hospital-logo-W.png";
    img.onload = () => {
      setLogo(img);
    };
    img.onerror = () => {
      console.error("Failed to load logo image");
    };
  }, []);

  const downloadReport = () => {
    if (!logo) {
      alert("Logo image is still loading. Please wait.");
      return;
    }

    const doc = new jsPDF();
    const margin = 10;

    const text = `\n\nDate: ${new Date(item.date).toString()}\n\nResult: ${item.result ? "positive" : "negative"}\n\nDetails: ${item.details}`;
    const splitText = doc.splitTextToSize(text, doc.internal.pageSize.width - margin * 2);
    doc.text(splitText, margin, 60);

    const pdfWidth = doc.internal.pageSize.getWidth();
    
    // Draw logo
    const canvas1 = document.createElement("canvas");
    canvas1.width = logo.width;
    canvas1.height = logo.height;
    const ctx1 = canvas1.getContext("2d");
    ctx1.drawImage(logo, 0, 0, logo.width, logo.height);
    const dataURL1 = canvas1.toDataURL("image/png");

    doc.addImage(dataURL1, "PNG", 5, 5, pdfWidth / 4, (pdfWidth / 4) * (logo.height / logo.width));

    doc.text(
      "Helasuwa.lk\nTel: 0771231231\nAddress No: No:11, Kandy Road,\n",
      pdfWidth / 4 + 15,
      20
    );

    doc.save(`${item._id}.pdf`);
  };

  return (
    <tr className="border-b hover:bg-gray-100">
      <td className="px-4 py-2">{item._id}</td>
      <td className="px-4 py-2">{new Date(item.date).toLocaleString()}</td>
      <td className="px-4 py-2">{item.test}</td>
      <td className="px-4 py-2">{item.details}</td>
      <td className="px-4 py-2">
        <button
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={downloadReport}
          aria-label={`Download report for ${item._id}`}
        >
          Download
        </button>
      </td>
    </tr>
  );
};

export default RowReports;
