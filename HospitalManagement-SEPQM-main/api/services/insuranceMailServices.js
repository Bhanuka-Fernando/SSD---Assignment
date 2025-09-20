const nodemailer = require('nodemailer');

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "helasuwa@zohomail.com", // Your email address
    pass: process.env.EmailPass, // Your email password stored in environment variables
  },
});

// Function to send email to the patient after claim submission
const sendClaimEmail = async (patientEmail) => {
  const mailOptions = {
    from: "helasuwa@zohomail.com", // Sender email address
    to: patientEmail, // Patient's email address
    subject: "Insurance Claim Request Received", // Email subject
    text: "Hello,\nYour insurance claim request has been received and is being processed. The insurance company will review your claim and inform you of further details shortly.", // Email content
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Insurance claim email sent successfully");
  } catch (error) {
    console.error("Error sending insurance claim email: ", error);
  }
};

module.exports = {
  sendClaimEmail,
};
