import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWarehouse } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from '../../components/Layout';

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the list of warehouses
  useEffect(() => {
    axios.get('http://localhost:3000/api/warehouses')
      .then(response => {
        setWarehouses(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching warehouses:', error);
        setLoading(false);
      });
  }, []);

  // Fetch details of the selected warehouse
  const fetchWarehouseDetails = (warehouseName) => {
    setLoading(true);
    axios.get(`http://localhost:3000/api/warehouses/${warehouseName}`)
      .then(response => {
        setSelectedWarehouse(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching warehouse details:', error);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-semibold text-center mb-8">Warehouse Dashboard</h1>

        {/* Main layout with two columns: List and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Warehouse list */}
          <div className="col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {warehouses.map((warehouse, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl cursor-pointer"
                  onClick={() => fetchWarehouseDetails(warehouse.name)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center space-x-3">
                    <FaWarehouse className="text-2xl text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-700">{warehouse.name}</h2>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="col-span-1">
            <h2 className="text-2xl font-semibold mb-4">Warehouse Locations</h2>
            <MapContainer center={[51.505, -0.09]} zoom={13} className="h-96 w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[51.505, -0.09]}>
                <Popup>A warehouse located here.</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Warehouse details */}
        {selectedWarehouse && (
          <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Warehouse Details</h2>
            <p><strong>Name:</strong> {selectedWarehouse.name}</p>
            <p><strong>Owner:</strong> {selectedWarehouse.owner}</p>
            <p><strong>Company:</strong> {selectedWarehouse.company}</p>
            <p><strong>Creation Date:</strong> {new Date(selectedWarehouse.creation).toLocaleString()}</p>
            <p><strong>Last Modified:</strong> {new Date(selectedWarehouse.modified).toLocaleString()}</p>
            <p><strong>Parent Warehouse:</strong> {selectedWarehouse.parent_warehouse}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Warehouse;
