import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaSearch, FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch patients data from the API
    axios.get('http://localhost:3000/api/patients')
      .then(response => setPatients(response.data))
      .catch(error => console.error("Error fetching patients:", error));
  }, []);

  const openModal = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setShowModal(false);
  };

  // Sample data for graph (replace with actual data if available)
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Admissions",
        backgroundColor: "#4f46e5",
        borderColor: "#4f46e5",
        data: [15, 25, 20, 30, 22, 17],
      },
    ],
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-500">
            <FaUserPlus className="mr-2" /> Add Patient
          </button>
        </div>

        {/* Search and Chart Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
          <div className="relative w-full lg:w-1/2">
            <input
              type="text"
              placeholder="Search by name or ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <div className="w-full lg:w-1/2" style={{ height:'300px' }}>
            <h3 className="text-lg font-semibold mb-2">Monthly Admissions</h3>
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white shadow-md rounded-lg mt-16 overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="w-1/3 px-4 py-2 text-left">Patient Name</th>
                <th className="w-1/4 px-4 py-2 text-left">Condition</th>
                <th className="w-1/4 px-4 py-2 text-left">Doctor Assigned</th>
                <th className="w-1/4 px-4 py-2 text-left">Insurance</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.patientId}
                  className="border-t hover:bg-gray-100 cursor-pointer"
                  onClick={() => openModal(patient)}
                >
                  <td className="px-4 py-3">{patient.name}</td>
                  <td className="px-4 py-3">{patient.currentStatus.condition}</td>
                  <td className="px-4 py-3">{patient.currentStatus.doctorAssigned}</td>
                  <td className="px-4 py-3">{patient.insuranceDetails.provider}</td>
                  <td className="px-4 py-3 text-indigo-600 hover:underline">View Details</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Patient Details Modal */}
        {showModal && selectedPatient && (
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
              <h2 className="text-2xl font-semibold mb-4">{selectedPatient.name}</h2>
              <p className="text-gray-600 mb-2"><strong>Patient ID:</strong> {selectedPatient.patientId}</p>
              <p className="text-gray-600 mb-2"><strong>Date of Birth:</strong> {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-2"><strong>Condition:</strong> {selectedPatient.currentStatus.condition}</p>
              <p className="text-gray-600 mb-2"><strong>Doctor Assigned:</strong> {selectedPatient.currentStatus.doctorAssigned}</p>
              <p className="text-gray-600 mb-2"><strong>Insurance Provider:</strong> {selectedPatient.insuranceDetails.provider}</p>

              {/* Medical History */}
              <h3 className="text-lg font-semibold mt-6">Medical History</h3>
              <ul className="space-y-2 mt-2">
                {selectedPatient.medicalHistory.map((record) => (
                  <li key={record._id} className="bg-gray-100 p-3 rounded-lg">
                    <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                    <p><strong>Notes:</strong> {record.notes}</p>
                    <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
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

export default Patients;
