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
  try {
      if (result) {
    // 1) Reject non-strings (blocks objects like {"$ne":null})
    if (typeof req.body.email !== "string" || typeof req.body.password !== "string") {
      return res.status(400).send({ rst: "validation failed" });
    }

    // 2) Force primitive strings
    const email = String(req.body.email);
    const pass  = String(req.body.password);

    // 3) Use exact match ($eq) so operators from user input are NOT executed
    const doctor = await Doctor.findOne({ email: { $eq: email } }).lean();

    if (!doctor) return res.status(200).send({ rst: "invalid doctor" });

    // keep your current compare (you said you only want NoSQLi fix)
    const result = pass === doctor.password;
    if (!result) return res.status(200).send({ rst: "incorrect password" });

    const token = jwt.sign({ email: doctor.email }, "hey", { expiresIn: "1h" });
    res.status(200).send({ rst: "success", data: doctor, tok: token });
  } catch (e) {
    res.status(500).send({ rst: "error" });
  }
};


// Function to check doctor authorization
exports.checkDoctor = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ rst: "no token" });

    let decoded;
    try {
      decoded = jwt.verify(token, "hey");
    } catch (e) {
      return res.status(401).send({ rst: "invalid token" });
    }

    // Ensure decoded.email is a plain string (not an object)
    const email = typeof decoded.email === "string" ? decoded.email : "";
    if (!email) return res.status(400).send({ rst: "validation failed" });

    // Exact match prevents operator injection from token payload
    const doctor = await Doctor.findOne({ email: { $eq: email } }).lean();
    if (!doctor) return res.status(404).send({ rst: "not found" });

    res.status(200).send({ rst: "checked", doctor });
  } catch (e) {
    res.status(500).send({ rst: "error" });
  }
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
