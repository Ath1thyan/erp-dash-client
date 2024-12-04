import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { FaUsers, FaWarehouse, FaBuilding, FaUniversity } from 'react-icons/fa';
import Layout from '../components/Layout.jsx';
import axios from 'axios';
import { motion } from 'framer-motion';
import Modal from 'react-modal';

// Register Chart.js components
Chart.register(...registerables);

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStat, setSelectedStat] = useState(null); // For Modal
    const [modalIsOpen, setModalIsOpen] = useState(false); // Modal visibility

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await axios.get('https://erp-dash-server.onrender.com/api/users');
                setUsers(usersRes.data);

                const warehousesRes = await axios.get('https://erp-dash-server.onrender.com/api/warehouses');
                setWarehouses(warehousesRes.data);

                const companiesRes = await axios.get('https://erp-dash-server.onrender.com/api/companies');
                setCompanies(companiesRes.data);

                const bankAccountsRes = await axios.get('https://erp-dash-server.onrender.com/api/bankAccounts');
                setBankAccounts(bankAccountsRes.data);

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
            <h1 className="text-3xl font-semibold text-center mt-6">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer"
                    onClick={() => openModal('users')}
                >
                    <FaUsers className="text-teal-500 text-4xl mx-auto" />
                    <h2 className="text-xl font-bold mt-4">{users.length} Users</h2>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer"
                    onClick={() => openModal('warehouses')}
                >
                    <FaWarehouse className="text-purple-500 text-4xl mx-auto" />
                    <h2 className="text-xl font-bold mt-4">{warehouses.length} Warehouses</h2>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer"
                    onClick={() => openModal('companies')}
                >
                    <FaBuilding className="text-orange-500 text-4xl mx-auto" />
                    <h2 className="text-xl font-bold mt-4">{companies.length} Companies</h2>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer"
                    onClick={() => openModal('bankAccounts')}
                >
                    <FaUniversity className="text-blue-500 text-4xl mx-auto" />
                    <h2 className="text-xl font-bold mt-4">{bankAccounts.length} Bank Accounts</h2>
                </motion.div>
            </div>

             {/* User Distribution Line Chart */}
            <div className="mt-10 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">User Distribution</h3>
                <div className="h-80">
                    <Line 
                        data={userChartData} 
                        options={{ responsive: true, maintainAspectRatio: false }} 
                    />
                </div>
            </div>

            {/* Warehouse Performance Bar Chart */}
            <div className="mt-10 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Warehouse Performance</h3>
                <div className="h-80">
                    <Bar 
                        data={warehouseChartData} 
                        options={{ responsive: true, maintainAspectRatio: false }} 
                    />
                </div>
            </div>

            {/* Floating Action Button (FAB) */}
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 bg-teal-500 text-white rounded-full p-4 shadow-lg"
                onClick={() => alert('Add new item!')}
            >
                <span className="text-2xl">+</span>
            </motion.button>

            {/* Modal for Detailed View */}
            <Modal 
                isOpen={modalIsOpen} 
                onRequestClose={closeModal} 
                contentLabel="Detailed View" 
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h2 className="text-2xl font-bold text-center mb-4">Detailed View</h2>
                {selectedStat === 'users' && (
                    <div>
                        <h3 className="text-xl">User Details</h3>
                        <p>Total Users: {users.length}</p>
                        <ul>
                            {users.map((user, index) => (
                                <li key={index}>{user.name}</li>
                            ))}
                        </ul>
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
                        <h3 className="text-xl">Bank Account Details</h3>
                        <p>Total Bank Accounts: {bankAccounts.length}</p>
                        <ul>
                            {bankAccounts.map((account, index) => (
                                <li key={index}>{account.accountNumber}</li>
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

export default Dashboard;
