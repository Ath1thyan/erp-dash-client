import React, { useState, useEffect } from 'react';
import { FaSearch, FaMoneyCheckAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Billings = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch bills data from the API
    axios.get('http://localhost:3000/api/bills')
      .then(response => setBills(response.data))
      .catch(error => console.error("Error fetching bills:", error));
  }, []);

  const openModal = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBill(null);
    setShowModal(false);
  };

  const chartData = {
    labels: bills.map(bill => `Bill ${bill.billId}`),
    datasets: [
      {
        label: "Total Amount (₹)",
        backgroundColor: "#4f46e5",
        borderColor: "#4f46e5",
        data: bills.map(bill => bill.totalAmount),
      },
    ],
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Billing</h1>
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search by Bill ID or Patient ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Billing Summary</h3>
          <div className="bg-white p-4 shadow rounded-lg">
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Billing Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="w-1/6 px-4 py-2 text-left">Bill ID</th>
                <th className="w-1/6 px-4 py-2 text-left">Patient ID</th>
                <th className="w-1/6 px-4 py-2 text-left">Total Amount</th>
                <th className="w-1/6 px-4 py-2 text-left">Status</th>
                <th className="w-1/6 px-4 py-2 text-left">Payment Date</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr
                  key={bill.billId}
                  className="border-t hover:bg-gray-100 cursor-pointer"
                  onClick={() => openModal(bill)}
                >
                  <td className="px-4 py-3">{bill.billId}</td>
                  <td className="px-4 py-3">{bill.patientId}</td>
                  <td className="px-4 py-3">₹{bill.totalAmount}</td>
                  <td className={`px-4 py-3 ${bill.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>{bill.status}</td>
                  <td className="px-4 py-3">{bill.paymentDate ? new Date(bill.paymentDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3 text-indigo-600 hover:underline">View Details</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Bill Details */}
        {showModal && selectedBill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
          >
            <div className="bg-white rounded-lg w-3/4 md:w-1/2 p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <h2 className="text-2xl font-semibold mb-4">Bill Details</h2>
              <p className="text-gray-600 mb-2"><strong>Bill ID:</strong> {selectedBill.billId}</p>
              <p className="text-gray-600 mb-2"><strong>Patient ID:</strong> {selectedBill.patientId}</p>
              <p className="text-gray-600 mb-2"><strong>Total Amount:</strong> ₹{selectedBill.totalAmount}</p>
              <p className="text-gray-600 mb-2"><strong>Status:</strong> {selectedBill.status}</p>
              {selectedBill.paymentDate && (
                <p className="text-gray-600 mb-2"><strong>Payment Date:</strong> {new Date(selectedBill.paymentDate).toLocaleDateString()}</p>
              )}

              {/* Services Section */}
              <h3 className="text-lg font-semibold mt-6">Services</h3>
              <ul className="space-y-2 mt-2">
                {selectedBill.services.map((service) => (
                  <li key={service._id} className="bg-gray-100 p-3 rounded-lg">
                    <p><strong>Description:</strong> {service.description}</p>
                    <p><strong>Cost:</strong> ₹{service.cost}</p>
                    <p><strong>Date:</strong> {new Date(service.date).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Billings;
