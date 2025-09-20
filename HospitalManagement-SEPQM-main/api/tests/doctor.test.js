// tests/doctor.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");  // Import the Express app
const Doctor = require("../models/Doctor"); // Import the Doctor model
const nodemailer = require("nodemailer"); // Mock nodemailer
const { MongoMemoryServer } = require('mongodb-memory-server');


// Mock nodemailer to prevent real email sending during tests
jest.mock('nodemailer');

// Mock nodemailer to prevent real email sending during tests
nodemailer.createTransport.mockReturnValue({
  sendMail: jest.fn((mailOptions, callback) => {
    console.log("Mock email sent:", mailOptions); // Log the mail options
    callback(null, 'Email Sent'); // Simulate successful email sending
  }),
});

let doctorId; // Store the doctor's ID for future tests

// Use an in-memory MongoDB instance for testing
const { connectToDatabase } = require("../Configurations/DB_Connection");
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

describe("Doctor API Tests", () => {
  it("should add a new doctor", async () => {
    const res = await request(app)
      .post("/doctor/add")
      .send({
        email: "doctor1@example.com",
        password: "password123",
        name: "Dr. John Doe",
        specialization: "Cardiology",
        qualifications: "MBBS, MD",
      });

    expect(res.status).toBe(200);
    expect(res.body).toBe("Doctor Added");

    // Store the doctor's ID for later tests
    const doctor = await Doctor.findOne({ email: "doctor1@example.com" });
    doctorId = doctor._id;  // Save the created doctor's ID
  });

  it("should fetch all doctors", async () => {
    const res = await request(app).get("/doctor");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);  // Check that at least one doctor is returned
  });

  it("should fetch a doctor by ID", async () => {
    const res = await request(app).get(`/doctor/get/${doctorId}`);
    expect(res.status).toBe(200);
    expect(res.body.doctor).toBeDefined();
    expect(res.body.doctor._id).toBe(doctorId.toString());
  });

  it("should update a doctor's information", async () => {
    const res = await request(app)
      .put(`/doctor/update/${doctorId}`)
      .send({
        name: "Dr. John Updated",
        email: "doctor1@example.com",
        password: "newpassword123",
        specialization: "Neurology",
        qualifications: "MBBS, MD, PhD",
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Doctor updated");

    // Verify the update
    const updatedDoctor = await Doctor.findById(doctorId);
    expect(updatedDoctor.name).toBe("Dr. John Updated");
    expect(updatedDoctor.specialization).toBe("Neurology");
  });
});
