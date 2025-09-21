// routes/inventoryRoutes.js

const express = require("express");
const router = express.Router();
const inventoryController = require("../Controllers/controller.inventory");

router.post("/add", inventoryController.addInventory);
router.get("/", inventoryController.getAllInventory);
router.put("/update/:id", inventoryController.updateInventoryById);
router.delete("/delete/:id", inventoryController.deleteInventoryById);
router.get("/get/:id", inventoryController.getInventoryById);

module.exports = router;
