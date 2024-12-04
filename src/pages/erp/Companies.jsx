import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { FiSearch, FiFilter, FiPlus } from 'react-icons/fi';  // Icons

// Register Chart.js components
Chart.register(...registerables);

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  useEffect(() => {
    // Fetch list of companies
    axios.get('https://erp-dash-server.onrender.com/api/companies')
      .then(response => {
        setCompanies(response.data);
        setFilteredCompanies(response.data); // Default show all companies
      })
      .catch(error => {
        console.error("Error fetching companies data", error);
      });
  }, []);

  useEffect(() => {
    // Apply search filter
    let filtered = companies;
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter(company => company.category === categoryFilter);  // Assuming there's a category field
    }
    setFilteredCompanies(filtered);
  }, [searchTerm, categoryFilter, companies]);

  const openModal = (companyName) => {
    // Fetch selected company details
    axios.get(`http://localhost:3000/api/companies/${companyName}`)
      .then(response => {
        setSelectedCompany(response.data);
        setModalIsOpen(true);
      })
      .catch(error => {
        console.error("Error fetching company details", error);
      });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCompany(null);
  };

  // Chart Data for the selected company's sales
  const salesChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Monthly Sales Target',
        data: Array(7).fill(selectedCompany?.monthly_sales_target || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Monthly Sales',
        data: Array(7).fill(selectedCompany?.total_monthly_sales || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Layout>
      <h1 className="text-3xl font-semibold text-center mt-6">Companies Dashboard</h1>

      {/* Search & Filter Bar */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-lg w-1/3">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search Companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none w-full"
          />
        </div>
        
        {/* Filter */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-white p-3 rounded-lg shadow-lg">
            <FiFilter className="text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="outline-none ml-2"
            >
              <option value="">All Categories</option>
              <option value="tech">Tech</option>
              <option value="finance">Finance</option>
              <option value="retail">Retail</option>
              {/* Add more options based on your data */}
            </select>
          </div>

          {/* Add New Company Button */}
          <button className="flex items-center bg-blue-600 text-white p-3 rounded-lg shadow-lg">
            <FiPlus className="mr-2" />
            Add New Company
          </button>
        </div>
      </div>

      {/* List of Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-10 mt-8">
        {filteredCompanies.map(company => (
          <motion.div
            key={company.name}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer transition-transform duration-300"
            onClick={() => openModal(company.name)}
          >
            <h2 className="text-xl font-bold">{company.name}</h2>
            <p className="text-gray-600">Click to see details</p>
          </motion.div>
        ))}
      </div>

      {/* Company Details Modal */}
      {selectedCompany && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Company Details"
          className="modal-content2"
          overlayClassName="modal-overlay2"
          closeTimeoutMS={200}  // For smooth closing animation
        >
          <h2 className="text-2xl font-bold text-center mb-4">Company Details</h2>
          
          <div className="flex space-x-8">
            {/* Company Details */}
            <div className="flex-1 space-y-4">
              <p><strong>Company Name:</strong> {selectedCompany.company_name}</p>
              <p><strong>Owner:</strong> {selectedCompany.owner}</p>
              <p><strong>Country:</strong> {selectedCompany.country}</p>
              <p><strong>Website:</strong> <a href={selectedCompany.website} className="text-blue-500">{selectedCompany.website}</a></p>
              <p><strong>Description:</strong> {selectedCompany.company_description}</p>
              <p><strong>Tax ID:</strong> {selectedCompany.tax_id}</p>
              <p><strong>Email:</strong> {selectedCompany.email}</p>
              <p><strong>Phone:</strong> {selectedCompany.phone_no}</p>
            </div>

            {/* Divider */}
            <div className="border-l-2 border-gray-300 mx-4"></div>

            {/* Sales Chart */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
              <div className="w-full h-80">
                <Bar data={salesChartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
              </div>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="mt-4 bg-red-500 text-white p-2 rounded-full w-full"
          >
            Close
          </button>
        </Modal>
      )}
    </Layout>
  );
};

export default Companies;
