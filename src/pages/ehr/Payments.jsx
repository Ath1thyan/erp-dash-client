import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { FaCreditCard, FaCashRegister, FaCalendarAlt, FaSearch, FaMoneyBillWave } from 'react-icons/fa'
import { motion } from 'framer-motion'
import axios from 'axios'
import { format } from 'date-fns'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css'
import ReactPaginate from 'react-paginate'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filterDate, setFilterDate] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10 // Changed from 5 to 10

  // Fetch payments data from API
  useEffect(() => {
    axios.get('https://erp-dash-server.onrender.com/api/payments')
      .then(response => setPayments(response.data))
      .catch(error => console.error('Error fetching payments:', error))
  }, [])

  const handleRowClick = (payment) => {
    setSelectedPayment(payment)
    setShowModal(true)
  }

  // Filter payments by selected date
  const filteredPayments = payments.filter(payment => 
    filterDate ? format(new Date(payment.dateOfPayment), 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd') : true
  )

  // Calculate summary statistics
  const totalPayments = filteredPayments.reduce((sum, p) => sum + p.amountPaid, 0)
  const averagePayment = filteredPayments.length ? (totalPayments / filteredPayments.length).toFixed(2) : 0

  // Paginate payments data
  const pageCount = Math.ceil(filteredPayments.length / itemsPerPage)
  const paginatedPayments = filteredPayments.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  // Handle page change
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected)
  }

  // Summary Statistics Card
  const StatsCard = ({ icon, title, value, color }) => (
    <div className="flex items-center bg-white shadow-md p-4 rounded-lg w-1/4 text-center">
      {icon}
      <div className="ml-3">
        <p className="text-gray-600">{title}</p>
        <p className={`text-2xl font-bold text-${color}`}>{value}</p>
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="p-6 space-y-8">

        {/* Summary Cards */}
        <div className="flex justify-around space-x-6">
          <StatsCard 
            icon={<FaMoneyBillWave className="text-green-500 text-3xl" />} 
            title="Total Payments" 
            value={`₹${totalPayments}`} 
            color="green-500"
          />
          <StatsCard 
            icon={<FaMoneyBillWave className="text-blue-500 text-3xl" />} 
            title="Average Payment" 
            value={`₹${averagePayment}`} 
            color="blue-500"
          />
          <StatsCard 
            icon={<FaCreditCard className="text-yellow-500 text-3xl" />} 
            title="Transactions" 
            value={filteredPayments.length} 
            color="yellow-500"
          />
        </div>

        {/* Filter Section */}
        <div className="flex items-center justify-between mt-6 space-x-6">
          <div className="flex items-center space-x-4">
            <FaSearch className="text-gray-600" />
            <input
              type="text"
              className="border border-gray-300 rounded py-2 px-4"
              placeholder="Search by payment ID..."
            />
            <DatePicker
              onChange={setFilterDate}
              value={filterDate}
              className="border border-gray-300 rounded py-2 px-4"
            />
            <button onClick={() => setFilterDate(null)} className="px-4 py-2 bg-red-500 text-white rounded">
              Clear Filter
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-6 shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4">Payment ID</th>
                <th className="py-3 px-4">Bill ID</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map(payment => (
                <motion.tr
                  key={payment._id}
                  whileHover={{ scale: 1.02 }}
                  className="border-b hover:bg-gray-100 cursor-pointer transition duration-200 ease-in-out"
                  onClick={() => handleRowClick(payment)}
                >
                  <td className="py-2 px-4">{payment.paymentId}</td>
                  <td className="py-2 px-4">{payment.billId}</td>
                  <td className="py-2 px-4">₹{payment.amountPaid}</td>
                  <td className="py-2 px-4 flex items-center">
                    {payment.paymentMethod === 'Credit Card' ? <FaCreditCard className="mr-2" /> : payment.paymentMethod === 'Cash' ? <FaCashRegister className="mr-2" /> : <FaCalendarAlt className="mr-2" />}
                    {payment.paymentMethod}
                  </td>
                  <td className="py-2 px-4">{format(new Date(payment.dateOfPayment), 'dd MMM yyyy')}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName={"flex space-x-2"}
            activeClassName={"bg-blue-500 text-white rounded px-3 py-1"}
            pageClassName={"page-item cursor-pointer text-sm px-3 py-1 border rounded"}
            previousClassName={"cursor-pointer text-sm px-3 py-1 border rounded"}
            nextClassName={"cursor-pointer text-sm px-3 py-1 border rounded"}
          />
        </div>

        {/* Modal for Payment Details */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div className="bg-white rounded-lg p-6 w-1/2" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Payment Details</h2>
              {selectedPayment && (
                <div>
                  <p><strong>Payment ID:</strong> {selectedPayment.paymentId}</p>
                  <p><strong>Bill ID:</strong> {selectedPayment.billId}</p>
                  <p><strong>Amount Paid:</strong> ₹{selectedPayment.amountPaid}</p>
                  <p><strong>Payment Method:</strong> {selectedPayment.paymentMethod}</p>
                  <p><strong>Date of Payment:</strong> {format(new Date(selectedPayment.dateOfPayment), 'dd MMM yyyy')}</p>
                </div>
              )}
              <button className="mt-4 px-4 py-2 bg-gray-800 text-white rounded" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}

export default Payments
