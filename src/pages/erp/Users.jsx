import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaSearch, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import Layout from '../../components/Layout';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/users');
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openModal = (userName) => {
    axios
      .get(`http://localhost:3000/api/users/${userName}`)
      .then((response) => {
        setSelectedUser(response.data);
        setModalIsOpen(true);
      })
      .catch((err) => console.error('Error fetching user details:', err));
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCheckboxChange = (userName) => {
    setSelectedUsers((prev) =>
      prev.includes(userName)
        ? prev.filter((name) => name !== userName)
        : [...prev, userName]
    );
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:3000/api/users', newUser);
      alert('User added successfully!');
      setNewUser({ name: '', email: '', role: '' });
      closeModal();
      // Fetch updated users
      const res = await axios.get('http://localhost:3000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearchQuery =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'All' || user.roles.some((role) => role.role === filter);
    return matchesSearchQuery && matchesFilter;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 className="text-3xl font-semibold text-center mt-6">Users</h1>

      {/* Search Bar and Filter */}
      <div className="flex justify-between mt-6 mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded-lg shadow-sm"
          />
          <FaSearch className="ml-2 text-gray-500" />
        </div>
        <div className="flex items-center">
          <select
            value={filter}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-lg shadow-sm"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Guest">Guest</option>
          </select>
          <button
            onClick={() => setModalIsOpen(true)}
            className="ml-4 px-4 py-2 bg-teal-500 text-white rounded shadow-sm"
          >
            <FaPlus className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="mt-6 overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={() => {
                    if (selectedUsers.length === filteredUsers.length) {
                      setSelectedUsers([]);
                    } else {
                      setSelectedUsers(filteredUsers.map((user) => user.name));
                    }
                  }}
                  checked={selectedUsers.length === filteredUsers.length}
                />
              </th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.name}
                className={`hover:bg-gray-50 cursor-pointer ${selectedUsers.includes(user.name) ? 'bg-gray-200' : ''}`}
                onClick={() => openModal(user.name)}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.name)}
                    onChange={() => handleCheckboxChange(user.name)}
                  />
                </td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FaEnvelope className="mr-2 text-gray-500" />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openModal(user.name)}
                    className="text-blue-500"
                  >
                    View Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for User Details */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="User Details"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-2xl font-bold text-center mb-4">User Details</h2>
        {selectedUser && (
          <div>
            <div className="mb-4">
              <strong>Name: </strong> {selectedUser.full_name}
            </div>
            <div className="mb-4">
              <strong>Email: </strong> {selectedUser.email}
            </div>
            <div className="mb-4">
              <strong>Username: </strong> {selectedUser.username}
            </div>
            <div className="mb-4">
              <strong>Role: </strong> {selectedUser.roles.map((role) => role.role).join(', ')}
            </div>
            <div className="mb-4">
              <strong>Phone: </strong> {selectedUser.phone || 'N/A'}
            </div>
            <div className="mb-4">
              <strong>Address: </strong> {selectedUser.address || 'N/A'}
            </div>
            <div className="mb-4">
              <strong>Created At: </strong> {new Date(selectedUser.creation).toLocaleString()}
            </div>
            <div className="mb-4">
              <strong>Last Modified: </strong> {new Date(selectedUser.modified).toLocaleString()}
            </div>
          </div>
        )}
        <button onClick={closeModal} className="mt-4 text-blue-500">
          Close
        </button>
      </Modal>

      {/* Modal for Adding User */}
      <Modal
        isOpen={modalIsOpen && !selectedUser}
        onRequestClose={closeModal}
        contentLabel="Add New User"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Add New User</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newUser.name}
              onChange={handleNewUserChange}
              className="px-4 py-2 border rounded-lg w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newUser.email}
              onChange={handleNewUserChange}
              className="px-4 py-2 border rounded-lg w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700">Role</label>
            <select
              id="role"
              name="role"
              value={newUser.role}
              onChange={handleNewUserChange}
              className="px-4 py-2 border rounded-lg w-full"
              required
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Guest">Guest</option>
            </select>
          </div>
          <button
            onClick={handleAddUser}
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded shadow-sm w-full"
          >
            Add User
          </button>
        </form>
      </Modal>
    </Layout>
  );
};

export default Users;
