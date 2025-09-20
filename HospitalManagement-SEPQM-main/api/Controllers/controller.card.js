const Card = require('../models/Card');

// Controller for adding a new card
exports.addCard = async (req, res) => {
  try {
    const newCard = new Card(req.body);
    await newCard.save();
    res.status(201).json({ message: 'Card details saved successfully' });
  } catch (error) {
    console.error('Error saving card details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
