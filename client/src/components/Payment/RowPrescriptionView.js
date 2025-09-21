import React from 'react';
import jsPDF from 'jspdf';

export default function RowPrescriptionView({ item, onClick }) {
    function downloadPrescription() {
        const doc = new jsPDF();
        const text = `\n\nDate :${new Date(item.date).toString()} \n\n ${item.text || ''}`;
        doc.text(text, 10, 60);
        doc.save(`${item._id}.pdf`);
    }

    return (
        <tr>
            <td>{item._id}</td>
            <td>{item.appointment || 'N/A'}</td>
            <td>{new Date(item.date).toLocaleString()}</td>
            <td>{item.text ? (item.text.length > 20 ? `${item.text.slice(0, 20)}...` : item.text) : 'No details'}</td>
            <td>
                <button 
                    className="download-btn-pres bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105" 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onClick(); 
                    }}
                >
                    View
                </button>
            </td>
        </tr>
    );
}
