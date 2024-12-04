import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { FaUsers, FaWarehouse, FaBuilding, FaUniversity, FaUserMd, FaCalendarAlt, FaDollarSign, FaStore } from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import axios from 'axios';

// Register Chart.js components
Chart.register(...registerables);

const CombinedDashboard = () => {
  const [users, setUsers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [finances, setFinances] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState(null); // For Modal
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal visibility

  useEffect(() => {
    // Fetching data for both EHR and ERP components
    const fetchData = async () => {
      try {
        const usersRes = await axios.get('https://erp-dash-server.onrender.com/api/users');
        const warehousesRes = await axios.get('https://erp-dash-server.onrender.com/api/warehouses');
        const companiesRes = await axios.get('https://erp-dash-server.onrender.com/api/companies');
        const bankAccountsRes = await axios.get('https://erp-dash-server.onrender.com/api/bankAccounts');
        const patientsRes = await axios.get('https://erp-dash-server.onrender.com/api/patients');
        const appointmentsRes = await axios.get('https://erp-dash-server.onrender.com/api/appointments');
        const financesRes = await axios.get('https://erp-dash-server.onrender.com/api/finances');
        const billsRes = await axios.get('https://erp-dash-server.onrender.com/api/bills');
        
        setUsers(usersRes.data);
        setWarehouses(warehousesRes.data);
        setCompanies(companiesRes.data);
        setBankAccounts(bankAccountsRes.data);
        setPatients(patientsRes.data);
        setAppointments(appointmentsRes.data);
        setFinances(financesRes.data);
        setBills(billsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Line graph data for the User Distribution chart
  const userChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Number of Users',
        data: [120, 150, 180, 220, 240, 270, 300],  // Example data, replace with actual data
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true, // Makes the area below the line filled
        tension: 0.4,  // Smoothness of the curve
      },
    ],
  };

  // Bar graph data for warehouse comparison
  const warehouseChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Warehouses Opened',
        data: [10, 12, 15, 18, 20, 23, 25],  // Example data, replace with actual data
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
      },
    ],
  };

  const financeChartData = {
    labels: finances.map((finance) => `${finance.department} - ${finance.month} ${finance.year}`),
    datasets: [
      {
        label: 'Revenue',
        data: finances.map((finance) => finance.totalRevenue),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
      },
      {
        label: 'Expenses',
        data: finances.map((finance) => finance.expenses.reduce((total, expense) => total + expense.amount, 0)),
        borderColor: '#FF6347',
        backgroundColor: 'rgba(255, 99, 71, 0.2)',
        fill: true,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Revenue', 'Expenses'],
    datasets: [
      {
        data: [
          finances.reduce((total, finance) => total + finance.totalRevenue, 0),
          finances.reduce((total, finance) => total + finance.expenses.reduce((sum, expense) => sum + expense.amount, 0), 0)
        ],
        backgroundColor: ['#4CAF50', '#FF6347'],
        hoverBackgroundColor: ['#45a049', '#f44336'],
      },
    ],
  };

  // Function to handle modal open and passing data
  const openModal = (stat) => {
    setSelectedStat(stat);
    setModalIsOpen(true);
  };

  // Function to handle modal close
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedStat(null);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-semibold text-center mt-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        {/* EHR Stats */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer"
          onClick={() => openModal('patients')}
        >
          <div>
            <h2 className="text-xl">Patients</h2>
            <p className="text-3xl">{patients.length}</p>
          </div>
          <FaUserMd size={40} />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer"
          onClick={() => openModal('appointments')}
        >
          <div>
            <h2 className="text-xl">Appointments</h2>
            <p className="text-3xl">{appointments.length}</p>
          </div>
          <FaCalendarAlt size={40} />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer"
          onClick={() => openModal('finances')}
        >
          <div>
            <h2 className="text-xl">Total Revenue</h2>
            <p className="text-3xl">₹{finances.reduce((total, finance) => total + finance.totalRevenue, 0)}</p>
          </div>
          <FaDollarSign size={40} />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-purple-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer"
          onClick={() => openModal('warehouses')}
        >
          <div>
            <h2 className="text-xl">Warehouses</h2>
            <p className="text-3xl">{warehouses.length}</p>
          </div>
          <FaWarehouse size={40} />
        </motion.div>

        {/* New Cards */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-pink-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer"
          onClick={() => openModal('companies')}
        >
          <div>
            <h2 className="text-xl">Companies</h2>
            <p className="text-3xl">{companies.length}</p>
          </div>
          <FaBuilding size={40} />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-teal-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer"
          onClick={() => openModal('bankAccounts')}
        >
          <div>
            <h2 className="text-xl">Bank Accounts</h2>
            <p className="text-3xl">{bankAccounts.length}</p>
          </div>
          <FaUniversity size={40} />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-orange-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between cursor-pointer"
          onClick={() => openModal('bills')}
        >
          <div>
            <h2 className="text-xl">Bills</h2>
            <p className="text-3xl">{bills.length}</p>
          </div>
          <FaStore size={40} />
        </motion.div>
      </div>

      {/* Charts */}
      <div className="mt-10 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Finance Overview</h3>
        <div className="h-80">
          <Line 
            data={financeChartData} 
            options={{ responsive: true, maintainAspectRatio: false }} 
          />
        </div>
      </div>

      <div className="mt-10 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">User Distribution</h3>
        <div className="h-80">
          <Line 
            data={userChartData} 
            options={{ responsive: true, maintainAspectRatio: false }} 
          />
        </div>
      </div>

      <div className="mt-10 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Warehouse Performance</h3>
        <div className="h-80">
          <Bar 
            data={warehouseChartData} 
            options={{ responsive: true, maintainAspectRatio: false }} 
          />
        </div>
      </div>

      {/* Doughnut Chart for Revenue vs Expenses */}
      <div className="mt-10 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Revenue vs Expenses</h3>
        <div className="h-80">
          <Doughnut 
            data={doughnutChartData} 
            options={{ responsive: true, maintainAspectRatio: false }} 
          />
        </div>
      </div>

      {/* Modal for Detailed View */}
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal} 
        contentLabel="Detailed View" 
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Detailed View</h2>
        {selectedStat === 'patients' && (
          <div>
            <h3 className="text-xl">Patient Details</h3>
            <p>Total Patients: {patients.length}</p>
            <ul>
              {patients.map((patient, index) => (
                <li key={index}>{patient.name}</li>
              ))}
            </ul>
          </div>
        )}
        {selectedStat === 'appointments' && (
          <div>
            <h3 className="text-xl">Appointment Details</h3>
            <p>Total Appointments: {appointments.length}</p>
            <ul>
              {appointments.map((appointment, index) => (
                <li key={index}>{appointment.reason}</li>
              ))}
            </ul>
          </div>
        )}
        {selectedStat === 'finances' && (
          <div>
            <h3 className="text-xl">Financial Overview</h3>
            <p>Total Revenue: ₹{finances.reduce((total, finance) => total + finance.totalRevenue, 0)}</p>
            <p>Total Expenses: ₹{finances.reduce((total, finance) => total + finance.expenses.reduce((sum, expense) => sum + expense.amount, 0), 0)}</p>
          </div>
        )}
        {selectedStat === 'warehouses' && (
          <div>
            <h3 className="text-xl">Warehouse Details</h3>
            <p>Total Warehouses: {warehouses.length}</p>
            <ul>
              {warehouses.map((warehouse, index) => (
                <li key={index}>{warehouse.name}</li>
              ))}
            </ul>
          </div>
        )}
        {selectedStat === 'companies' && (
          <div>
            <h3 className="text-xl">Company Details</h3>
            <p>Total Companies: {companies.length}</p>
            <ul>
              {companies.map((company, index) => (
                <li key={index}>{company.name}</li>
              ))}
            </ul>
          </div>
        )}
        {selectedStat === 'bankAccounts' && (
          <div>
            <h3 className="text-xl">Bank Accounts</h3>
            <ul>
              {bankAccounts.map((account, index) => (
                <li key={index}>{account.bankName}</li>
              ))}
            </ul>
          </div>
        )}
        {selectedStat === 'bills' && (
          <div>
            <h3 className="text-xl">Bill Details</h3>
            <ul>
              {bills.map((bill, index) => (
                <li key={index}>{bill.billNumber}</li>
              ))}
            </ul>
          </div>
        )}
        <button 
          onClick={closeModal} 
          className="mt-4 bg-red-500 text-white p-2 rounded-full w-full"
        >
          Close
        </button>
      </Modal>
    </Layout>
  );
};

export default CombinedDashboard;
