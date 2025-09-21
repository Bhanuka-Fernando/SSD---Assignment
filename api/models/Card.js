const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  cardNumber: { 
    type: String, 
    required: true
 },
  cardName: { 
    type: String, 
    required: true 
},
  expYear: { 
    type: String,
    required: true 
},
  expMonth: { 
    type: String, 
    required: true 
},
  ccv: { 
    type: String,
     required: true 
    },
});

module.exports = mongoose.model('Card', cardSchema);
