const express = require('express');
const router = express.Router();
const cardController = require('../Controllers/controller.card');

// POST request to add a new card
router.post('/', cardController.addCard);

module.exports = router;
