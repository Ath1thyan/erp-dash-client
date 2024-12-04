import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { FaChartLine, FaDollarSign, FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Finance = () => {
  const [financeData, setFinanceData] = useState([]);
  const [selectedFinance, setSelectedFinance] = useState(null);

  // Fetching Finance Data
  useEffect(() => {
    axios.get('http://localhost:3000/api/finances')
      .then((response) => {
        setFinanceData(response.data);
      })
      .catch((error) => console.error('Error fetching finance data:', error));
  }, []);

  // Preparing Chart Data
  const chartData = {
    labels: financeData.map(item => `${item.department} (${item.month} ${item.year})`),
    datasets: [
      {
        label: 'Total Revenue',
        data: financeData.map(item => item.totalRevenue),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Profit/Loss',
        data: financeData.map(item => item.profitOrLoss),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  // Modal for detailed view of selected finance entry
  const handleFinanceClick = (id) => {
    axios.get(`http://localhost:3000/api/finances/${id}`)
      .then(response => {
        setSelectedFinance(response.data);
      })
      .catch(error => console.error('Error fetching finance detail:', error));
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Title Section */}
        <h2 className="text-2xl font-semibold">Finance Dashboard</h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center p-4 bg-white shadow-lg rounded-lg"
          >
            <FaChartLine className="text-3xl text-blue-500" />
            <div className="ml-4">
              <p className="text-gray-600">Total Revenue</p>
              <p className="text-xl font-semibold">₹{financeData.reduce((total, item) => total + item.totalRevenue, 0)}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center p-4 bg-white shadow-lg rounded-lg"
          >
            <FaDollarSign className="text-3xl text-green-500" />
            <div className="ml-4">
              <p className="text-gray-600">Profit/Loss</p>
              <p className="text-xl font-semibold">₹{financeData.reduce((total, item) => total + item.profitOrLoss, 0)}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center p-4 bg-white shadow-lg rounded-lg"
          >
            <FaClipboardList className="text-3xl text-yellow-500" />
            <div className="ml-4">
              <p className="text-gray-600">Total Departments</p>
              <p className="text-xl font-semibold">{financeData.length}</p>
            </div>
          </motion.div>
        </div>

        {/* Finance Data Chart */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Revenue & Profit/Loss Trends</h3>
          <Line data={chartData} options={{ responsive: true }} />
        </div>

        {/* Finance Data Table */}
        <div className="mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4">Finance ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {financeData.map(item => (
                <motion.tr
                  key={item._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleFinanceClick(item._id)}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                >
                  <td className="py-3 px-4">{item.financeId}</td>
                  <td className="py-3 px-4">{item.department}</td>
                  <td className="py-3 px-4">₹{item.totalRevenue}</td>
                  <td className="py-3 px-4">₹{item.profitOrLoss}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Detailed Finance View */}
        {selectedFinance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedFinance(null)}
          >
            <div className="bg-white rounded-lg p-6 w-1/2" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">{selectedFinance.department} - {selectedFinance.month} {selectedFinance.year}</h2>
              <p><strong>Finance ID:</strong> {selectedFinance.financeId}</p>
              <p><strong>Total Revenue:</strong> ₹{selectedFinance.totalRevenue}</p>
              <p><strong>Profit/Loss:</strong> ₹{selectedFinance.profitOrLoss}</p>

              <div className="mt-4">
                <h3 className="font-semibold">Expenses:</h3>
                <ul>
                  {selectedFinance.expenses.map(expense => (
                    <li key={expense._id} className="text-gray-700">
                      {expense.description}: ₹{expense.amount} (Date: {new Date(expense.date).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
                onClick={() => setSelectedFinance(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Finance;
