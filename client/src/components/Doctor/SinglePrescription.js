import React from "react";
import jsPDF from "jspdf";

const SinglePrescription = ({ prescription }) => {
  const logo = new Image();
  logo.src = "/images/Hospital-logo-W.png"; // Path to the logo image

  // Function to download the prescription as a PDF
  const downloadPrescription = () => {
    const doc = new jsPDF();
    const margin = 10;

    // Format the prescription content with date and text
    const text = `Date: ${new Date(prescription.date).toLocaleString()}\n\n${prescription.text}`;
    const splitText = doc.splitTextToSize(text, doc.internal.pageSize.width - margin * 2);
    doc.text(splitText, margin, 60);

    // Logo and header settings
    const pdfWidth = doc.internal.pageSize.getWidth();
    const canvas = document.createElement("canvas");
    canvas.width = logo.width;
    canvas.height = logo.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(logo, 0, 0, logo.width, logo.height);
    const dataURL = canvas.toDataURL("image/png");

    // Add logo and clinic information to the PDF
    doc.addImage(dataURL, "PNG", 10, 10, pdfWidth / 4, (pdfWidth / 4) * (logo.height / logo.width));
    doc.text("Helasuwa.lk\nTel: 0771231231\nAddress: No:11, Kandy road,", pdfWidth / 4 + 15, 20);

    // Save the document with a unique name based on prescription ID
    doc.save(`Prescription-${prescription._id}.pdf`);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 border border-gray-200">
      <h5 className="text-gray-600 mb-2">Date: {new Date(prescription.date).toLocaleString()}</h5>
      <p className="text-gray-800 mb-4">{prescription.text}</p>
      <button
        onClick={downloadPrescription}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Download Prescription
      </button>
    </div>
  );
};

export default SinglePrescription;
