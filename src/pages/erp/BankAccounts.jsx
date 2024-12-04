import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiPlus, FiChevronDown } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useSpring, animated } from 'react-spring';

// Register Chart.js components
Chart.register(...registerables);

const BankAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bankFilter, setBankFilter] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // Fetch bank accounts data
    axios.get('https://erp-dash-server.onrender.com/api/bankAccounts')
      .then(response => {
        setBankAccounts(response.data);
        setFilteredAccounts(response.data);
      })
      .catch(error => console.error("Error fetching bank accounts data", error));
  }, []);

  useEffect(() => {
    // Apply search and filter logic
    let filtered = bankAccounts;

    if (searchTerm) {
      filtered = filtered.filter(account =>
        account.account_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (bankFilter) {
      filtered = filtered.filter(account => account.bank.toLowerCase() === bankFilter.toLowerCase());
    }

    setFilteredAccounts(filtered);
  }, [searchTerm, bankFilter, bankAccounts]);

  const openModal = (accountName) => {
    // Fetch the account details
    axios.get(`https://erp-dash-server.onrender.com/api/bankAccounts/${accountName}`)
      .then(response => {
        setSelectedAccount(response.data);
        setModalIsOpen(true);
      })
      .catch(error => console.error("Error fetching account details", error));
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAccount(null);
  };

  const addNewAccount = () => {
    // Open a modal or redirect to a form to add a new bank account
    alert("Redirecting to add a new bank account");
  };

  // Dummy chart data (you can modify as per your needs)
  const accountChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Account Balance',
        data: [5000, 4000, 6000, 7000, 8000, 9000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
    <Layout>
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mt-8">Bank Accounts Dashboard</h1>

      {/* Search & Filter Bar */}
      <div className="flex justify-between items-center mt-6 space-x-6">
        <div className="flex items-center space-x-4 bg-gradient-to-r from-indigo-600 to-blue-500 p-4 rounded-lg shadow-xl w-2/5">
          <FiSearch className="text-white text-lg" />
          <input
            type="text"
            placeholder="Search Bank Accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none w-full p-2 rounded-md"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white p-4 rounded-lg shadow-xl">
            <FiFilter className="text-gray-600" />
            <select
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
              className="outline-none ml-2 text-gray-700"
            >
              <option value="">All Banks</option>
              <option value="sbi">SBI</option>
              {/* Add other banks if needed */}
            </select>
          </div>

          {/* Add New Bank Account Button */}
          <button
            onClick={addNewAccount}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg shadow-xl transition duration-200"
          >
            <FiPlus className="mr-2" />
            Add New Account
          </button>
        </div>
      </div>

      {/* List of Bank Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 px-6">
        {filteredAccounts.map(account => (
          <motion.div
            key={account.name}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-xl cursor-pointer transform transition-transform duration-300"
            onClick={() => openModal(account.name)}
          >
            <h2 className="text-xl font-semibold text-gray-800">{account.name}</h2>
            <p className="text-gray-500">Click to see details</p>
          </motion.div>
        ))}
      </div>

      {/* Account Details Modal */}
      {selectedAccount && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Bank Account Details"
          className="modal-content2"
          overlayClassName="modal-overlay2"
          closeTimeoutMS={200}
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Bank Account Details</h2>
            <div className="flex space-x-8">
              {/* Account Details */}
              <div className="flex-1 space-y-4 text-gray-700">
                <p><strong>Account Name:</strong> {selectedAccount.account_name}</p>
                <p><strong>Bank:</strong> {selectedAccount.bank}</p>
                <p><strong>Company:</strong> {selectedAccount.company}</p>
                <p><strong>Owner:</strong> {selectedAccount.owner}</p>
                <p><strong>Creation Date:</strong> {selectedAccount.creation}</p>
                <p><strong>Status:</strong> {selectedAccount.disabled === 0 ? 'Active' : 'Disabled'}</p>
                <p><strong>Default Account:</strong> {selectedAccount.is_default === 0 ? 'No' : 'Yes'}</p>
              </div>

              {/* Divider */}
              <div className="border-l-2 border-gray-300 mx-4"></div>

              {/* Chart */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Account Balance Overview</h3>
                <div className="w-full h-80 bg-gray-100 p-4 rounded-lg shadow-md">
                  <Bar data={accountChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full w-full transition duration-300"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default BankAccounts;
