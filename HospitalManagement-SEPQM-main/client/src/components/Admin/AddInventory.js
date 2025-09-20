import React, { useState } from "react";
import axios from "axios";
import DashboardHeader from "../DashboardHeader";
import SideNav from "./SideNav"; // Assuming you have the SideNav component from before

const AddInventory = () => {
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const addInventory = async (e) => {
    e.preventDefault();
    const newInventory = {
      item_id: itemId,
      item_name: itemName,
      category,
      quantity: Number(quantity),
      price: Number(price),
    };

    axios
      .post(`http://localhost:8070/inventory/add`, newInventory)
      .then((res) => {
        alert("Inventory Item Added");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <DashboardHeader />

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar */}
        <SideNav /> {/* Include the SideNav component here */}

        {/* Main Content */}
        <div className="flex-grow p-6">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Add Inventory Item</h1>
            <form onSubmit={addInventory} className="space-y-4">
              <input
                type="text"
                placeholder="Item ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setItemId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Item Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setItemName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Category"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setCategory(e.target.value)}
              />
              <input
                type="number"
                placeholder="Quantity"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setQuantity(e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPrice(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:opacity-90"
              >
                Add Inventory
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInventory;
