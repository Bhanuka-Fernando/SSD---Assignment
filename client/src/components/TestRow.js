import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import axios from "axios";

const TestRow = ({ item }) => {
  const logo = new Image();
  logo.src = "/images/Hospital-logo-W.png";

  const [report, setReport] = useState([]);
  useEffect(() => {
    getReport();
  }, []);

  const getReport = async () => {
    axios
      .get(`http://localhost:8070/report/getByTest/${item._id}`)
      .then((res) => {
        console.log(res.data.report);
        setReport(res.data.report);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deleteTest = async () => {
    axios
      .delete(`http://localhost:8070/test/delete/${item._id}`)
      .then((res) => {
        alert("Test Deleted!!");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    const margin = 10;
    const lineHeight = 5;
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();

    const text = `
    \n\nTest ID : ${item._id}\n
    Patient ID : ${item.patient}\n
    Name : ${item.name}\n
    Test Date : ${new Date(item.date).toLocaleString()}\n
    Test Type : ${item.type}\n
    
    Report- \n
    Report Id : ${report._id}\n
    Result : ${report.result}\n
    Details : ${report.details}

    `;
    const splitText = doc.splitTextToSize(
      text,
      doc.internal.pageSize.width - margin * 2
    );
    doc.text(splitText, 10, 60);

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
      "Helasuwa.lk \nTel: 0771231231 \nAddress No: No:11,Kandy road,\n",
      pdfWidth / 4 + 15,
      20
    );

    doc.save(`${report._id}.pdf`);
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      <td className="py-4 px-6">{item._id}</td>
      <td className="py-4 px-6">{item.patient}</td>
      <td className="py-4 px-6">{item.name}</td>
      <td className="py-4 px-6">{item.age}</td>
      <td className="py-4 px-6">{new Date(item.date).toDateString()}</td>
      <td className="py-4 px-6">{item.type}</td>
      <td className="py-4 px-6">{item.status}</td>
      {item.status === "Sample Provided" ? (
        <td className="py-4 px-6">
          <a href={"/addReport/" + item._id + "/" + item.patient}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
              Add Report
            </button>
          </a>
        </td>
      ) : (
        <td className="py-4 px-6 flex space-x-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
            onClick={downloadReport}
          >
            Report
          </button>

          <a href={"/editReport/" + item._id + "/" + item.patient}>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200">
              Edit Report
            </button>
          </a>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
            onClick={deleteTest}
          >
            Delete
          </button>
        </td>
      )}
    </tr>
  );
};

export default TestRow;
