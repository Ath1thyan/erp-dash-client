import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaDatabase, FaHeartbeat, FaChevronDown } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({ dashboard: false, erp: false, ehr: false });

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gray-800 text-white transition-width duration-200 fixed h-full`}>
        <div className="flex items-center justify-between p-4">
          <span className="text-lg font-semibold">{isCollapsed ? 'App' : 'My Application'}</span>
          <button onClick={toggleSidebar} className="text-gray-400">
            <FiMenu size={20} />
          </button>
        </div>
        <nav className="mt-4">
          {/* Dashboard */}
          <div>
            <button onClick={() => toggleSection('dashboard')} className="flex items-center w-full px-4 py-2 hover:bg-gray-700">
              <FaTachometerAlt />
              {!isCollapsed && <span className="ml-3">Dashboard</span>}
              {!isCollapsed && <FaChevronDown className={`ml-auto transition-transform ${openSections.dashboard ? 'rotate-180' : ''}`} />}
            </button>
            {!isCollapsed && openSections.dashboard && (
              <div className="ml-8 mt-1">
                <Link to="/dashboard/overview" className="block py-1 hover:text-gray-400">Overview</Link>
                <Link to="/dashboard/erp" className="block py-1 hover:text-gray-400">ERP</Link>
                <Link to="/dashboard/ehr" className="block py-1 hover:text-gray-400">EHR</Link>
              </div>
            )}
          </div>

          {/* ERP */}
          <div>
            <button onClick={() => toggleSection('erp')} className="flex items-center w-full px-4 py-2 hover:bg-gray-700">
              <FaDatabase />
              {!isCollapsed && <span className="ml-3">ERP</span>}
              {!isCollapsed && <FaChevronDown className={`ml-auto transition-transform ${openSections.erp ? 'rotate-180' : ''}`} />}
            </button>
            {!isCollapsed && openSections.erp && (
              <div className="ml-8 mt-1">
                <Link to="/erp/users" className="block py-1 hover:text-gray-400">Users</Link>
                <Link to="/erp/warehouses" className="block py-1 hover:text-gray-400">Warehouses</Link>
                <Link to="/erp/companies" className="block py-1 hover:text-gray-400">Companies</Link>
                <Link to="/erp/bank-acc" className="block py-1 hover:text-gray-400">Bank Accounts</Link>
              </div>
            )}
          </div>

          {/* EHR */}
          <div>
            <button onClick={() => toggleSection('ehr')} className="flex items-center w-full px-4 py-2 hover:bg-gray-700">
              <FaHeartbeat />
              {!isCollapsed && <span className="ml-3">EHR</span>}
              {!isCollapsed && <FaChevronDown className={`ml-auto transition-transform ${openSections.ehr ? 'rotate-180' : ''}`} />}
            </button>
            {!isCollapsed && openSections.ehr && (
              <div className="ml-8 mt-1">
                <Link to="/ehr/patients" className="block py-1 hover:text-gray-400">Patients</Link>
                <Link to="/ehr/appointments" className="block py-1 hover:text-gray-400">Appointments</Link>
                <Link to="/ehr/bills" className="block py-1 hover:text-gray-400">Billings</Link>
                <Link to="/ehr/payments" className="block py-1 hover:text-gray-400">Payments</Link>
                <Link to="/ehr/finance" className="block py-1 hover:text-gray-400">Finance</Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} flex flex-col h-full`}>
        {/* Header */}
        <header className="bg-gray-200 p-4 shadow-md fixed w-full z-10">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </header>

        {/* Content */}
        <main className="mt-16 p-4 flex-grow bg-gray-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
