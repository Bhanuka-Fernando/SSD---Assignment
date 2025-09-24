// adminController.js
const Admin = require("../models/Admin");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const secretKey = 'hey';
const bcrypt = require("bcrypt");


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


// controller.admin.js
exports.addAdmin = async (req, res) => {
  try {
    const { email, name, phone, roleName, allocatedWork, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      email,
      name,
      password: hashed,        // store bcrypt hash
      phone,
      roleName,
      allocatedWork,
    });

    await newAdmin.save();
    res.json("Admin Added");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
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
  try {
    const rawEmail = req.body?.email;
    const rawPassword = req.body?.password;

    // 1) Type enforcement blocks operator injection
    if (typeof rawEmail !== "string" || typeof rawPassword !== "string") {
      return res.status(400).json({ error: "Invalid input types" });
    }

    const email = rawEmail.trim();
    const password = rawPassword; // keep as-is for bcrypt compare

    if (!email || email.length > 254 || password.length > 256) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({ rst: "invalid admin" });
    }

    // Use bcrypt (store hashed passwords in DB)
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return res.status(401).json({ rst: "incorrect password" });
    }

    const token = jwt.sign(
      { sub: admin._id.toString(), email: admin.email },
      process.env.JWT_SECRET,             // do NOT hardcode secrets
      { expiresIn: "1h" }
    );

    // never return the password
    const { password: _omit, ...safe } = admin.toObject();
    return res.status(200).json({ rst: "success", data: safe, tok: token });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
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

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.searchAdmins = async (req, res) => {
  try {
    const raw = req.query?.query;
    if (typeof raw !== "string") return res.status(400).json({ error: "Invalid query" });

    const q = raw.trim();
    if (!q) return res.json([]);                  // empty search returns empty set
    if (q.length > 64) return res.status(400).json({ error: "Query too long" });

    const rx = new RegExp(escapeRegex(q), "i");   // safe regex

    const results = await Admin.find({
      $or: [
        { email: rx },
        { name: rx },
        { roleName: rx },
        { allocatedWork: rx },
      ],
    }).limit(50);

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
