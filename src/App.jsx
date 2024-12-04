import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Users from './pages/erp/Users';
import Warehouse from './pages/erp/Warehouse';
import Companies from './pages/erp/Companies';
import BankAccounts from './pages/erp/BankAccounts';
import Patients from './pages/ehr/Patients';
import Billings from './pages/ehr/Billings';
import Payments from './pages/ehr/Payments';
import Finance from './pages/ehr/Finance';
import Appointments from './pages/ehr/Appointments';
import Dashboard2 from './pages/Dashboard2';
import CombinedDashboard from './pages/CombinedDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard/erp" element={<Dashboard />} />
        <Route path="/dashboard/ehr" element={<Dashboard2 />} />
        <Route path="/" element={<CombinedDashboard />} />
        <Route path="/dashboard/overview" element={<CombinedDashboard />} />
        <Route path="/erp/users" element={<Users />} />
        <Route path="/erp/warehouses" element={<Warehouse />} />
        <Route path="/erp/companies" element={<Companies />} />
        <Route path="/erp/bank-acc" element={<BankAccounts />} />

        <Route path="/ehr/patients" element={<Patients />} />
        <Route path="/ehr/bills" element={<Billings />} />
        <Route path="/ehr/payments" element={<Payments/>} />
        <Route path="/ehr/finance" element={<Finance/>} />
        <Route path="/ehr/appointments" element={<Appointments/>} />
      </Routes>
    </Router>
  )
}

export default App;
