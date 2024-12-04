import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'chart.js/auto';

// Registering the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    // Fetch appointments from API
    const fetchAppointments = async () => {
      const response = await fetch('https://erp-dash-server.onrender.com/api/appointments');
      const data = await response.json();
      setAppointments(data);
    };
    fetchAppointments();
  }, []);

  // Prepare data for a simple line chart (e.g., appointments over time)
  const chartData = {
    labels: appointments.map((appointment) => new Date(appointment.appointmentDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Appointments',
        data: appointments.map(() => 1), // Simple count for demo purposes
        backgroundColor: '#4F46E5', // Blue color for the bars
        borderRadius: 5,
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false, // Hide the grid lines
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e0e0e0', // Light gray grid lines
        },
      },
    },
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <h2 className="text-3xl font-semibold text-gray-800">Appointments</h2>
          <div className="flex space-x-4">
            <AiOutlineCalendar className="text-3xl text-blue-600" />
            <AiOutlineClockCircle className="text-3xl text-blue-600" />
          </div>
        </motion.div>

        {/* Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-gray-700 mb-4">Appointments Overview</h3>
    <Bar data={chartData} options={options} />
  </div>

        {/* Appointment List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <motion.div
              key={appointment._id}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
              onClick={() => setSelectedAppointment(appointment)}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl text-blue-600">
                  <AiOutlineCalendar />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">{appointment.reason}</p>
                  <p className="text-sm text-gray-500">{new Date(appointment.appointmentDate).toLocaleString()}</p>
                  <p className={`text-sm font-medium ${appointment.status === 'Scheduled' ? 'text-green-500' : appointment.status === 'Cancelled' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {appointment.status}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for Appointment Details */}
        {selectedAppointment && (
          <div
            onClick={() => setSelectedAppointment(null)}
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md w-96"
            >
              <h3 className="text-2xl font-semibold text-gray-800">Appointment Details</h3>
              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-700">Reason: {selectedAppointment.reason}</p>
                <p className="text-sm text-gray-500">Date: {new Date(selectedAppointment.appointmentDate).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Status: {selectedAppointment.status}</p>
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Appointments;
