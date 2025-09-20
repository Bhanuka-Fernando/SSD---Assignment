// controllers/insuranceController.js
const multer = require('multer');
const fs = require('fs');
const InsuranceClaim = require('../models/InsuranceClaim');
const Patient = require('../models/Patient');
const { sendClaimEmail } = require('../services/insuranceMailServices'); // Import the mail service

// Ensure 'uploads/' directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Validate policy number before submission
exports.validatePolicyNumber = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, policyNo } = req.body;

    // Find patient by name and phone number
    const patient = await Patient.findOne({
      firstName,
      lastName,
      phoneNo: mobileNumber,
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if insurance number matches the policy number
    if (patient.insuranceNo !== policyNo) {
      return res.status(400).json({
        message: 'The provided policy number does not match the registered insurance number.',
      });
    }

    return res.status(200).json({ message: 'Policy number validated successfully' });
  } catch (error) {
    console.error('Error validating policy number:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit insurance claim and send email notification
exports.submitInsuranceClaim = async (req, res) => {
  try {
    const { policyNo, firstName, lastName, mobileNumber } = req.body;

    // Find patient by name and phone number
    const patient = await Patient.findOne({
      firstName,
      lastName,
      phoneNo: mobileNumber,
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if insurance number matches the policy number
    if (patient.insuranceNo !== policyNo) {
      return res.status(400).json({
        message: 'The provided policy number does not match the registered insurance number.',
      });
    }

    // Create a new insurance claim
    const newClaim = new InsuranceClaim({
      ...req.body,
      prescriptionFilePath: req.file ? req.file.path : null,
    });

    await newClaim.save();

    // Send confirmation email to the patient
    if (patient.email) {
      await sendClaimEmail(patient.email); // Use the sendClaimEmail function from insuranceMailServices.js
    }

    res.status(201).json({
      message: 'Insurance claim submitted successfully',
      claimId: newClaim.claimId,
    });
  } catch (error) {
    console.error('Error submitting insurance claim:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all insurance claims
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await InsuranceClaim.find();
    res.json(claims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a claim by ID
exports.deleteClaimById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClaim = await InsuranceClaim.findByIdAndDelete(id);

    if (!deletedClaim) {
      return res.status(404).json({ message: 'Insurance claim not found' });
    }

    res.status(200).json({ message: 'Insurance claim deleted successfully' });
  } catch (error) {
    console.error('Error deleting claim:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete all claims
exports.deleteAllClaims = async (req, res) => {
  try {
    await InsuranceClaim.deleteMany({});
    res.status(200).json({ message: 'All insurance claims deleted successfully' });
  } catch (error) {
    console.error('Error deleting all claims:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export the upload functionality for file handling
exports.upload = upload;
