const mongoose = require('mongoose');

const insuranceClaimSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  sex: { type: String, required: true },
  relationshipToInsured: { type: String, required: true },
  status: { type: String, required: true },
  policyNo: { type: Number, required: true },
  addressLine1: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  claimType: { type: String, required: true },
  reason: { type: String, required: true },
  prescriptionFilePath: { type: String },
  claimId: { type: String, unique: true, default: () => `CLAIM-${Date.now()}` },
}, { timestamps: true }); 

module.exports = mongoose.model('InsuranceClaim', insuranceClaimSchema);
