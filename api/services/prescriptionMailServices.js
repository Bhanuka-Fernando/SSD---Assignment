const nodemailer = require("nodemailer");

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: "helasuwa@zohomail.com", // Zoho email address
        pass: process.env.EmailPass, // Email password from environment variables
    },
});

// Function to send email to the patient
const sendEmailToPatient = async (patientEmail) => {
    const mailOptions = {
        from: "helasuwa@zohomail.com", // sender address
        to: patientEmail, // recipient's email address
        subject: "Prescription Sent", // Subject line
        text: "Your prescription has been sent.", // Plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email: ", error);
        throw new Error("Failed to send email"); // Throw an error to be caught in the controller
    }
};

module.exports = {
    sendEmailToPatient,
};
