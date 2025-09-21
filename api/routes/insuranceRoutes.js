const express = require('express');
const router = express.Router();
const insuranceController = require('../Controllers/controller.insurance');

// Route to validate policy number
router.post('/validatePolicy', insuranceController.validatePolicyNumber);

// Route to submit insurance claim
router.post('/', insuranceController.upload.single('prescription'), insuranceController.submitInsuranceClaim);

// Route to get all insurance claims
router.get('/', insuranceController.getAllClaims);

// Route to delete a claim by ID
router.delete('/:id', insuranceController.deleteClaimById);

// Route to delete all claims
router.delete('/', insuranceController.deleteAllClaims);

module.exports = router;
