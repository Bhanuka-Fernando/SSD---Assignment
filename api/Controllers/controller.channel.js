// api/Controllers/controller.channel.js
const Channel = require("../models/Channel");
const Appointment = require("../models/Appointment");

// Add a new channel
exports.addChannel = async (req, res) => {
  const { doctor, startDateTime, maxPatients, drName, specialization } = req.body;

  const newChannel = new Channel({
    doctor,
    drName,
    specialization,
    startDateTime,
    maxPatients,
  });

  try {
    await newChannel.save();
    res.json("Channel Added");
    console.log("Channel added");
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error in adding channel", error: err.message });
  }
};

// Get all channels
exports.getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find();
    res.json(channels);
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error in fetching channels", error: err.message });
  }
};

// Delete a channel by ID
exports.deleteChannelById = async (req, res) => {
  let cid = req.params.id;

  try {
    await Channel.findByIdAndDelete(cid);
    res.status(200).send({ status: "Channel deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error in deleting channel", error: err.message });
  }
};

// Search channels by date or doctor
exports.searchChannels = async (req, res) => {
  let date = new Date(req.params.date);
  const start = date.setHours(0, 0, 0, 0);
  const end = date.setHours(23, 59, 59, 999);
  let doctor = req.params.doctor || "";

  try {
    const channels = await Channel.find({
      $or: [
        { startDateTime: { $gte: start, $lte: end } },
        { drName: { $regex: doctor, $options: "i" } },
        { specialization: { $regex: doctor, $options: "i" } },
      ],
    });
    res.status(200).send({ status: "Channels fetched", channels });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: "Error in searching channels", error: err.message });
  }
};

// Get channels by doctor ID
exports.getChannelsByDoctor = async (req, res) => {
  let did = req.params.id;

  try {
    const channels = await Channel.find({ doctor: did }).sort({ startDateTime: 1 });
    res.status(200).json(channels);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: "Error in fetching channels by doctor", error: err.message });
  }
};

// Get a specific channel by ID
exports.getChannelById = async (req, res) => {
  let cid = req.params.id;

  try {
    const channel = await Channel.findById(cid);
    res.status(200).send({ status: "Channel fetched", channel });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: "Error in fetching channel", error: err.message });
  }
};

// Get the number of appointments for a specific channel
exports.getNoOfAppointments = async (req, res) => {
  let cid = req.params.id;

  try {
    const appointments = await Appointment.find({ channel: cid });
    const count = appointments.length;
    res.status(200).send({ status: "Channel fetched", count });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: "Error in fetching number of appointments", error: err.message });
  }
};

// Update a channel by ID
exports.updateChannelById = async (req, res) => {
  let cid = req.params.id;
  const { maxPatients, startDateTime } = req.body;

  const updateChannel = { maxPatients, startDateTime };

  try {
    await Channel.findByIdAndUpdate(cid, updateChannel);
    res.status(200).send({ status: "Channel updated" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error in updating channel", error: err.message });
  }
};
