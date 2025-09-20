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
        setReport(res.data.report);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteTest = async () => {
    axios
      .delete(`http://localhost:8070/test/delete/${item._id}`)
      .then(() => {
        alert("Test Deleted!");
        window.location.reload();
      })
      .catch((error) => {
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


    const canvas1 = document.createElement('canvas');
    canvas1.width = logo.width;
    canvas1.height = logo.height;
    const ctx1 = canvas1.getContext('2d');
    ctx1.drawImage(logo, 0, 0, logo.width, logo.height);
    const dataURL1 = canvas1.toDataURL('image/png');

    doc.addImage(dataURL1, 'PNG', 5 , 5 , (pdfWidth/4) , (pdfWidth/4) * (logo.height / logo.width));

    doc.text(
      "Helasuwa.lk \nTel: 0771231231 \nAddress No: No:11,Kandy road,\n",
      pdfWidth / 4 + 15,
      20
    );

    doc.save(`${report._id}.pdf`);
  };

  return (
    <tr className="hover:bg-gray-100 border-b border-gray-200">
      <td className="px-4 py-2">{item._id}</td>
      <td className="px-4 py-2">{item.patient}</td>
      <td className="px-4 py-2">{item.name}</td>
      <td className="px-4 py-2">{item.age}</td>
      <td className="px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
      <td className="px-4 py-2">{item.type}</td>
      <td className="px-4 py-2">{item.status}</td>
      <td className="px-4 py-2 flex space-x-2">
        {item.status === "Sample Provided" ? (
          <a href={`/addReport/${item._id}/${item.patient}`}>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Add Report
            </button>
          </a>
        ) : (
          <>
            <button
              onClick={downloadReport}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download
            </button>
            <a href={`/editReport/${item._id}/${item.patient}`}>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Edit
              </button>
            </a>
            <button
              onClick={deleteTest}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default TestRow;
