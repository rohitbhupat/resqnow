import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@apollo/client';
import { LIST_SOS_ALERTS } from '../../graphql/queries';
import usePageTitle from "../../pages/usePageTitle";

const COLORS = ['#00C49F', '#FF8042']; // Green, Orange

const AdminDashboard = () => {
  usePageTitle("Dashboard | ResQNow Admin");

  const [resolved, setResolved] = useState(0);
  const [pending, setPending] = useState(0);
  const navigate = useNavigate();


  const { data: sosData } = useQuery(LIST_SOS_ALERTS, {
    pollInterval: 5000,
  });

  useEffect(() => {
    if (sosData?.listResQNowGraphQLAPIS?.items) {
      const alerts = sosData.listResQNowGraphQLAPIS.items;
      const resolvedCount = alerts.filter(
        (alert) => alert.status === 'Resolved'
      ).length;
      const pendingCount = alerts.length - resolvedCount;

      setResolved(resolvedCount);
      setPending(pendingCount);
    }
  }, [sosData]);

  const chartData = [
    { name: 'Resolved', value: resolved },
    { name: 'Pending', value: pending },
  ];

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Welcome, Admin!</h1>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
            >
              Home
            </button>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Total SOS Alerts</h3>
              <p className="text-2xl font-bold text-red-600">
                {resolved + pending}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Resolved Alerts</h3>
              <p className="text-2xl font-bold text-green-600">{resolved}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Pending Alerts</h3>
              <p className="text-2xl font-bold text-orange-600">{pending}</p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              SOS Alert Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;