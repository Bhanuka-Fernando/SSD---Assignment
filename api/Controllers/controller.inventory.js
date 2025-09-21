// controllers/inventoryController.js
const Inventory = require("../models/Inventory");

// Function to add new inventory
exports.addInventory = (req, res) => {
  const { item_id, item_name, category, quantity, price } = req.body;

  const newInventory = new Inventory({
    item_id,
    item_name,
    category,
    quantity: Number(quantity),
    price: Number(price),
  });

  newInventory
    .save()
    .then(() => {
      res.json("Data is saved to the database");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ status: "Error saving data!", error: error.message });
    });
};

// Function to get all inventory
exports.getAllInventory = (req, res) => {
  Inventory.find()
    .then((items) => {
      res.json(items);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ status: "Error retrieving data!", error: error.message });
    });
};

// Function to update inventory by ID
exports.updateInventoryById = async (req, res) => {
  let inventoryID = req.params.id;
  const { item_id, item_name, category, quantity, price } = req.body;

  const updateInventory = {
    item_id,
    item_name,
    category,
    quantity,
    price,
  };

  await Inventory.findByIdAndUpdate(inventoryID, updateInventory)
    .then(() => {
      res.status(200).send({ status: "Inventory updated" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ status: "Error updating data!", error: error.message });
    });
};

// Function to delete inventory by ID
exports.deleteInventoryById = async (req, res) => {
  let inventoryID = req.params.id;

  await Inventory.findByIdAndDelete(inventoryID)
    .then(() => {
      res.status(200).send({ status: "Inventory deleted" });
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).send({ status: "Error deleting data!", error: error.message });
    });
};

// Function to get inventory by ID
exports.getInventoryById = async (req, res) => {
  let inventoryID = req.params.id;

  await Inventory.findById(inventoryID)
    .then((item) => {
      res.status(200).send({ status: "Inventory fetched", item });
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).send({ status: "Error fetching data!", error: error.message });
    });
};
