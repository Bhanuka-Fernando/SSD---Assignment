import React, { useState } from 'react';
import jsPDF from 'jspdf';
import CardPayment from './CardPayment';

export default function PrescriptionDetails({ prescription, onBack }) {
    const [showPaymentModal, setShowPaymentModal] = useState(false); 

    function calculateTotalAmount() {
        const regex = /Price:\s*\$(\d+\.\d{2})/g;
        let total = 0;
        let match;

        while ((match = regex.exec(prescription.text)) !== null) {
            total += parseFloat(match[1]);
        }
        return total;
    }

    function downloadPrescription() {
        const doc = new jsPDF();
        const margin = 10;
    
        // Create a new image object
        const logo = new Image();
        logo.src = "/images/Hospital-logo-W.png"; 
    
        // Wait for the image to load before generating the PDF
        logo.onload = function () {
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
    
            // Format the prescription content with date and text
            const prescriptionText = prescription.text || "No prescription details available";
            const formattedDate = `Date: ${new Date(prescription.date).toLocaleString()}\n\n`;
            const splitText = doc.splitTextToSize(prescriptionText, doc.internal.pageSize.width - margin * 2);
            doc.text(formattedDate, margin, 60);
            doc.text(splitText, margin, 70);
    
            
            const totalAmount = calculateTotalAmount();
            doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, margin, 90 + splitText.length * 10);
    

            doc.save(`Prescription-${prescription._id}.pdf`);
        };
    
        logo.onerror = function () {
            console.error("Error loading the logo image.");
            alert("Failed to load the logo image. Please check the file path.");
        };
    }
    
    
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <button 
                className="text-blue-500 mb-4 underline hover:text-blue-600"
                onClick={onBack}
            >
                ← Back to All Prescriptions
            </button>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Prescription Details</h2>
                
                <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
                    <div>
                        <p><span className="font-semibold">Prescription ID:</span> {prescription._id}</p>
                        <p><span className="font-semibold">Appointment ID:</span> {prescription.appointment || 'N/A'}</p>
                    </div>
                    <div>
                        <p><span className="font-semibold">Date:</span> {new Date(prescription.date).toLocaleString()}</p>
                        <p><span className="font-semibold">Total Amount:</span> ${calculateTotalAmount().toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">Prescription:</h3>
                    <p className="whitespace-pre-wrap text-gray-600">{prescription.text || "No prescription details available"}</p>
                </div>

                <div className="flex space-x-4">
                    <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                        onClick={downloadPrescription}
                    >
                        Download Prescription
                    </button>
                    <button 
                        onClick={() => setShowPaymentModal(true)} 
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
                    >
                        Pay Now: ${calculateTotalAmount().toFixed(2)}
                    </button>
                </div>
            </div>

            {showPaymentModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Proceed with Payment</h2>
                        
                        {/* Render CardPayment Component Here */}
                        <CardPayment />


                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
