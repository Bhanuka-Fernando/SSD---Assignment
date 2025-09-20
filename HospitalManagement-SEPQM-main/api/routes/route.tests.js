// routes/testRoutes.js

const express = require("express");
const router = express.Router();
const testController = require("../Controllers/controller.tests");

router.post("/add", testController.addTest);
router.get("/", testController.getAllTests);
router.get("/get/:id", testController.getTestById);
router.get("/search", testController.searchTests);
router.delete("/delete/:id", testController.deleteTestById);

module.exports = router;
