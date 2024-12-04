import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { FaUserMd, FaClipboardList, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const Dashboard2 = () => {
  const [patients, setPatients] = useState([]);
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [finances, setFinances] = useState([]);

  // Fetch data for patients, bills, payments, appointments, and finances
  useEffect(() => {
    const fetchPatients = fetchData('https://erp-dash-server.onrender.com/api/patients');
    const fetchBills = fetchData('https://erp-dash-server.onrender.com/api/bills');
    const fetchPayments = fetchData('https://erp-dash-server.onrender.com/api/payments');
    const fetchAppointments = fetchData('https://erp-dash-server.onrender.com/api/appointments');
    const fetchFinances = fetchData('https://erp-dash-server.onrender.com/api/finances');

    Promise.all([fetchPatients, fetchBills, fetchPayments, fetchAppointments, fetchFinances])
      .then(([patientsData, billsData, paymentsData, appointmentsData, financesData]) => {
        setPatients(patientsData);
        setBills(billsData);
        setPayments(paymentsData);
        setAppointments(appointmentsData);
        setFinances(financesData);
      });
  }, []);

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

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">EHR Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Summary Cards */}
        <motion.div
          className="bg-blue-500 p-6 rounded-lg shadow-lg text-white flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
        >
          <div>
            <h2 className="text-xl">Patients</h2>
            <p className="text-3xl">{patients.length}</p>
          </div>
          <FaUserMd size={40} />
        </motion.div>

        <motion.div
          className="bg-green-500 p-6 rounded-lg shadow-lg text-white flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
        >
          <div>
            <h2 className="text-xl">Appointments</h2>
            <p className="text-3xl">{appointments.length}</p>
          </div>
          <FaCalendarAlt size={40} />
        </motion.div>

        <motion.div
          className="bg-yellow-500 p-6 rounded-lg shadow-lg text-white flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
        >
          <div>
            <h2 className="text-xl">Total Revenue</h2>
            <p className="text-3xl">₹{finances.reduce((total, finance) => total + finance.totalRevenue, 0)}</p>
          </div>
          <FaDollarSign size={40} />
        </motion.div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Appointment ID</th>
              <th className="px-4 py-2">Patient ID</th>
              <th className="px-4 py-2">Doctor ID</th>
              <th className="px-4 py-2">Appointment Date</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="border-t">
                <td className="px-4 py-2">{appointment.appointmentId}</td>
                <td className="px-4 py-2">{appointment.patientId}</td>
                <td className="px-4 py-2">{appointment.doctorId}</td>
                <td className="px-4 py-2">{new Date(appointment.appointmentDate).toLocaleString()}</td>
                <td className="px-4 py-2">{appointment.reason}</td>
                <td className="px-4 py-2">{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Finance Overview</h2>
        <Line data={financeChartData} />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Patient Bills</h2>
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Bill ID</th>
              <th className="px-4 py-2">Patient ID</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.billId} className="border-t">
                <td className="px-4 py-2">{bill.billId}</td>
                <td className="px-4 py-2">{bill.patientId}</td>
                <td className="px-4 py-2">{bill.totalAmount}</td>
                <td className="px-4 py-2">{bill.status}</td>
                <td className="px-4 py-2">{bill.paymentDate || 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
};

export default Dashboard2;
