// controllers/doctorController.js

const Doctor = require("../models/Doctor");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const secretKey = "hey";

// Function to add a new doctor
exports.addDoctor = (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "helasuwa@zohomail.com",
      pass: process.env.EmailPass,
    },
  });

  const { email, password, name, specialization, qualifications } = req.body;

  const newDoctor = new Doctor({
    email,
    name,
    password,
    specialization,
    qualifications,
  });

  newDoctor
    .save()
    .then(() => {
      const mailOptions = {
        from: "helasuwa@zohomail.com",
        to: `${email}`,
        subject: "Helasuwa Doctor Profile",
        text: `Thank You! \nDoctor for joining with us.\n
                \nEmail: ${email} \nPassword: ${password}\n\n.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.json("Doctor Added");
    })
    .catch((err) => {
      console.log(err);
    });
};

// Function for doctor login
exports.loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email: email });

  try {
    if (doctor) {
      const result = password === doctor.password;

      if (result) {
        const token = jwt.sign({ email: doctor.email }, secretKey, {
          expiresIn: "1h",
        });
        res.status(200).send({ rst: "success", data: doctor, tok: token });
      } else {
        res.status(200).send({ rst: "incorrect password" });
      }
    } else {
      res.status(200).send({ rst: "invalid doctor" });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};

// Function to check doctor authorization
exports.checkDoctor = async (req, res) => {
  const token = req.headers.authorization;
  let email = null;
  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      console.log(error);
    } else {
      email = decoded.email;
    }
  });
  const doctor = await Doctor.findOne({ email });
  res.status(200).send({ rst: "checked", doctor });
};

// Function to fetch all doctors
exports.getAllDoctors = (req, res) => {
  Doctor.find()
    .then((doctors) => {
      res.json(doctors);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Function to fetch a doctor by ID
exports.getDoctorById = async (req, res) => {
  const cid = req.params.id;

  await Doctor.findById(cid)
    .then((doctor) => {
      res.status(200).send({ status: "Doctor fetched", doctor });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        status: "Error in getting doctor details",
        error: err.message,
      });
    });
};

// Function to update a doctor
exports.updateDoctor = async (req, res) => {
  const did = req.params.id;

  const { name, email, specialization, qualifications, password } = req.body;

  const updateDoctor = {
    name,
    email,
    password,
    specialization,
    qualifications,
  };

  await Doctor.findByIdAndUpdate(did, updateDoctor)
    .then(() => {
      res.status(200).send({ status: "Doctor updated" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        status: "Error with updating information",
        error: err.message,
      });
    });
};
