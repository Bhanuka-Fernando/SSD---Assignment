import React, { useState } from 'react';
import axios from 'axios';

function CardPayment() {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expYear: '',
    expMonth: '',
    ccv: '',
  });
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateCardNumber = (number) => {
    const cleanNumber = number.replace(/\s+/g, ''); // Remove spaces for validation
    const regex = /^[0-9]{16}$/;
    return regex.test(cleanNumber);
  };

  const validateCardName = (name) => {
    return name.length > 2;
  };

  const validateExpYear = (year) => {
    const currentYear = new Date().getFullYear();
    return year.length === 4 && Number(year) >= currentYear;
  };

  const validateExpMonth = (month) => {
    const validMonth = Number(month);
    return month.length === 2 && validMonth >= 1 && validMonth <= 12;
  };

  const validateCCV = (ccv) => {
    const regex = /^[0-9]{3}$/;
    return regex.test(ccv);
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!validateCardNumber(cardDetails.cardNumber)) {
      validationErrors.cardNumber = 'Card number must be 16 digits.';
    }
    if (!validateCardName(cardDetails.cardName)) {
      validationErrors.cardName = 'Name on card must be at least 3 characters.';
    }
    if (!validateExpYear(cardDetails.expYear)) {
      validationErrors.expYear = 'Expiration year is invalid.';
    }
    if (!validateExpMonth(cardDetails.expMonth)) {
      validationErrors.expMonth = 'Expiration month must be between 01 and 12.';
    }
    if (!validateCCV(cardDetails.ccv)) {
      validationErrors.ccv = 'CCV must be 3 digits.';
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'cardNumber') {
      let numericValue = value.replace(/\D/g, ''); // Remove all non-digit characters
      if (numericValue.length > 16) {
        numericValue = numericValue.slice(0, 16); // Limit to 16 digits
      }
  
      // Add a space after every 4 digits
      const formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, '$1 ');
  
      setCardDetails({ ...cardDetails, [name]: formattedValue });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    try {
      await axios.post('http://localhost:8070/card', cardDetails);
      alert('Payment processed successfully!');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed.');
    }
  };

  return (
    <div className="container mx-auto mt-8 max-w-lg p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Select Payment Option</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-gray-600 mb-1">Number on Card</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            maxLength="19" // 16 digits + 3 spaces
            required
            value={cardDetails.cardNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
        </div>
        <div>
          <label htmlFor="cardName" className="block text-gray-600 mb-1">Name on Card</label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            required
            value={cardDetails.cardName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.cardName && <p className="text-red-500 text-sm">{errors.cardName}</p>}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="expYear" className="block text-gray-600 mb-1">Exp Year</label>
            <input
              type="text"
              id="expYear"
              name="expYear"
              maxLength="4"
              required
              value={cardDetails.expYear}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.expYear && <p className="text-red-500 text-sm">{errors.expYear}</p>}
          </div>
          <div>
            <label htmlFor="expMonth" className="block text-gray-600 mb-1">Exp Month</label>
            <input
              type="text"
              id="expMonth"
              name="expMonth"
              maxLength="2"
              required
              value={cardDetails.expMonth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.expMonth && <p className="text-red-500 text-sm">{errors.expMonth}</p>}
          </div>
          <div>
            <label htmlFor="ccv" className="block text-gray-600 mb-1">CCV</label>
            <input
              type="password"
              id="ccv"
              name="ccv"
              maxLength="3"
              required
              value={cardDetails.ccv}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.ccv && <p className="text-red-500 text-sm">{errors.ccv}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
        >
          Proceed To Payment
        </button>
        <button
          type="button"
          className="w-full py-2 mt-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-200"
          onClick={() => window.location.href = '/insurance-claim'}
        >
          Continue with Insurance
        </button>
      </form>
    </div>
  );
}

export default CardPayment;
