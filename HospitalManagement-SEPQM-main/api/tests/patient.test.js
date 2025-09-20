// tests/patient.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");  // Import the Express app
const Patient = require("../models/Patient"); // Import the Patient model
const nodemailer = require("nodemailer"); // Mock nodemailer

// Mock nodemailer to prevent real email sending during tests
jest.mock('nodemailer');

// Mock nodemailer to prevent real email sending during tests
nodemailer.createTransport.mockReturnValue({
  sendMail: jest.fn((mailOptions, callback) => {
    console.log("Mock email sent:", mailOptions); // Log the mail options
    callback(null, 'Email Sent'); // Simulate successful email sending
  }),
});

let patientId; // Store the patient's ID for future tests

// Use an in-memory MongoDB instance for testing
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();  // Create an in-memory MongoDB instance
  const mongoUri = mongoServer.getUri();  // Get the connection URI

  // Ensure mongoose is connected only once to the in-memory database
  if (mongoose.connection.readyState === 0) {  // Not connected
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  // Disconnect mongoose and stop the in-memory MongoDB server
  await mongoose.disconnect();
  await mongoServer.stop();  // Stop the in-memory MongoDB server
});

describe("Valid Patient API Tests", () => {
  it("should add a new patient", async () => {
    const res = await request(app)
      .post("/patient/add")
      .send({
        email: "patient2@example.com",
        password: "password123",
        firstName: "Alice",
        lastName: "Smith",
        gender: "Female",
        dob: "1995-05-20",
        civilStatus: "Single",
        phone: "1234567890",
        emergencyPhone: "0987654321",
        gaurdianNIC: "NIC54321",
        gaurdianName: "Bob Smith",
        gaurdianPhone: "1122334455",
        height: "5.7",
        weight: "60",
        bloodGroup: "A+",
        allergies: "None",
        medicalStatus: "Healthy",
        insuranceNo: "INS54321",
        insuranceCompany: "ABC Insurance",
      });

    expect(res.status).toBe(200);
    expect(res.body).toBe("Patient Added");

    // Store the patient's ID for later tests
    const patient = await Patient.findOne({ email: "patient2@example.com" });
    patientId = patient._id;  // Save the created patient's ID
  });

  it("should login a patient", async () => {
    const res = await request(app)
      .post("/patient/login")
      .send({
        email: "patient2@example.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.rst).toBe("success");
    expect(res.body).toHaveProperty('tok');  // Ensure the token is generated
  });

  it("should fetch a patient by ID", async () => {
    const res = await request(app).get(`/patient/get/${patientId}`);
    expect(res.status).toBe(200);
    expect(res.body.patient).toBeDefined();
    expect(res.body.patient._id).toBe(patientId.toString());
  });

  it("should update a patient's information", async () => {
    const res = await request(app)
      .put(`/patient/update/${patientId}`)
      .send({
        firstName: "Alice Updated",
        lastName: "Smith Updated",
        phone: "9876543210",
        bloodGroup: "B+",
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Patient updated");

    // Verify the update
    const updatedPatient = await Patient.findById(patientId);
    expect(updatedPatient.firstName).toBe("Alice Updated");
    expect(updatedPatient.bloodGroup).toBe("B+");
  });

  it("should delete a patient", async () => {
    const res = await request(app).delete(`/patient/delete/${patientId}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Patient deleted");

    // Verify the patient is deleted
    const deletedPatient = await Patient.findById(patientId);
    expect(deletedPatient).toBeNull();
  });

  it("should fetch all patients", async () => {
    const res = await request(app).get("/patient");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);  // Ensure at least one patient exists
  });
});

describe("Invalid Patient API Tests", () => {
  it("should return an error if patient ID is invalid when fetching a patient", async () => {
    const res = await request(app).get(`/patient/get/invalid-id`);
    expect(res.status).toBe(500);  // Expect error message for invalid ID
    expect(res.body.error).toBeDefined();  // Ensure the error message is returned
  });

  it("should return an error if password is incorrect during login", async () => {
    const res = await request(app)
      .post("/patient/login")
      .send({
        email: "patient2@example.com",
        password: "wrongpassword",  // Incorrect password
      });

    expect(res.status).toBe(200);
    expect(res.body.rst).toBe("incorrect password");
  });

  it("should return an error if patient doesn't exist during login", async () => {
    const res = await request(app)
      .post("/patient/login")
      .send({
        email: "nonexistent@example.com",  // Non-existent email
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.rst).toBe("invalid user");
  });
});
