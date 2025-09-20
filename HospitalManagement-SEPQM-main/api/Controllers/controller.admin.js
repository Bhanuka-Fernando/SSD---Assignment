// adminController.js
const Admin = require("../models/Admin");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const secretKey = 'hey';

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "helasuwa@zohomail.com",
    pass: process.env.EmailPass,
  },
});

// Add new admin
exports.addAdmin = (req, res) => {
  const { email, name, phone, roleName, allocatedWork, password } = req.body;

  const newAdmin = new Admin({
    email,
    name,
    password,
    phone,
    roleName,
    allocatedWork,
  });

  newAdmin.save().then(() => {
    const mailOptions = {
      from: "helasuwa@zohomail.com",
      to: email,
      subject: "Staff Profile Created",
      text: `Hello \nYour Staff Account has been created.\n\nEmail : ${email} \nPassword : ${password}\n\nThank You.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.json("Admin Added");
  }).catch(err => {
    console.log(err);
  });
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  let aid = req.params.id;

  await Admin.findByIdAndDelete(aid)
    .then(() => {
      res.status(200).send({ status: "Staff deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(202).send({ status: "Error with deleting the admin", error: err.message });
    });
};

// Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email });

  try {
    if (admin) {
      const result = password === admin.password;

      if (result) {
        const token = jwt.sign({ email: admin.email }, secretKey, { expiresIn: '1h' });
        res.status(200).send({ rst: "success", data: admin, tok: token });
      } else {
        res.status(200).send({ rst: "incorrect password" });
      }
    } else {
      res.status(200).send({ rst: "invalid admin" });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};

// Check token
exports.checkToken = async (req, res) => {
  const token = req.headers.authorization;
  let email = null;

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      console.log(error);
    } else {
      email = decoded.email;
    }
  });

  const admin = await Admin.findOne({ email: email });
  res.status(200).send({ rst: "checked", admin: admin });
};

// Get all admins
exports.getAllAdmins = (req, res) => {
  Admin.find()
    .then((admins) => {
      res.json(admins);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
  let aid = req.params.id;

  const usr = await Admin.findById(aid)
    .then((staff) => {
      res.status(200).send({ status: "Staff fetched", staff });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        status: "Error in getting staff details",
        error: err.message,
      });
    });
};

// Search admins
exports.searchAdmins = async (req, res) => {
  try {
    const query = req.query.query;
    const results = await Admin.find({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { roleName: { $regex: query, $options: "i" } },
        { allocatedWork: { $regex: query, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update admin
exports.updateAdmin = async (req, res) => {
  let sid = req.params.id;
  const { name, email, phone, roleName, allocatedWork } = req.body;

  const updateStaff = { name, email, phone, roleName, allocatedWork };

  await Admin.findByIdAndUpdate(sid, updateStaff)
    .then(() => {
      const mailOptions = {
        from: "hospitalitp@zohomail.com",
        to: email,
        subject: "Staff Profile Updated",
        text: `Hello ${name}, \nYour Staff Account has been Updated.\nEmail : ${email} \nNew Role : ${roleName}\nAllocated Work : ${allocatedWork}\nPhone : ${phone}\nThank You.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(200).send({ status: "Staff updated" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        status: "Error with updating information",
        error: err.message,
      });
    });
};

// Update admin with password
exports.updateAdminWithPassword = async (req, res) => {
  let sid = req.params.id;
  const { name, email, phone, roleName, allocatedWork, password } = req.body;

  const updateStaff = { name, email, phone, roleName, allocatedWork, password };

  await Admin.findByIdAndUpdate(sid, updateStaff)
    .then(() => {
      res.status(200).send({ status: "Staff updated" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        status: "Error with updating information",
        error: err.message,
      });
    });
};
