// controllers/testController.js
const Test = require("../models/Test");

// Function to add a new test
exports.addTest = (req, res) => {
  const { pid: patient, name, age, type } = req.body;

  const newTest = new Test({
    patient,
    name,
    age,
    type,
  });

  newTest
    .save()
    .then(() => {
      res.json("Test Added");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: "Error adding test", message: err.message });
    });
};

// Function to get all tests
exports.getAllTests = (req, res) => {
  Test.find()
    .then((tests) => {
      res.json(tests);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: "Error retrieving tests", message: err.message });
    });
};

// Function to get a test by ID
exports.getTestById = async (req, res) => {
  let tid = req.params.id;

  await Test.findById(tid)
    .then((test) => {
      res.status(200).send({ status: "Test fetched", test });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        status: "Error fetching test details",
        error: err.message,
      });
    });
};

// Function to search for tests by query
exports.searchTests = async (req, res) => {
  try {
    const query = req.query.query; // Assuming the search query is sent as a query parameter
    const results = await Test.find({
      $or: [
        { type: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { status: { $regex: query, $options: "i" } },
      ],
    });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// Function to delete a test by ID
exports.deleteTestById = async (req, res) => {
  let tid = req.params.id;

  await Test.findByIdAndDelete(tid)
    .then(() => {
      res.status(200).send({ status: "Test deleted" });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send({ status: "Error deleting test", error: err.message });
    });
};
