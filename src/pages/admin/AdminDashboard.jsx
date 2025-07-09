import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@apollo/client';
import { LIST_SOS_ALERTS } from '../../graphql/queries';
import { CREATE_SOS_ALERT, UPDATE_SOS_STATUS } from '../../graphql/mutations';
import { ON_CREATE_SOS_ALERT, ON_UPDATE_SOS_STATUS } from '../../graphql/subscriptions';

const COLORS = ['#00C49F', '#FF8042'];

const AdminDashboard = () => {
  const [resolved, setResolved] = useState(0);
  const [pending, setPending] = useState(0);

  const { data, loading, error } = useQuery(LIST_SOS_ALERTS, {
    pollInterval: 5000, // Real-time polling
  });

  useEffect(() => {
    console.log("GraphQL Data:", data);
    console.log("GraphQL Loading:", loading);
    console.log("GraphQL Error:", error);

    if (data?.listResQNowGraphQLAPIS?.items) {
      const alerts = data.listResQNowGraphQLAPIS.items;


      console.log("All Alerts:", alerts);

      const res = alerts.filter(a => a.status === 'Resolved').length;
      const pend = alerts.filter(a => a.status !== 'Resolved').length;

      console.log("Resolved Alerts Count:", res);
      console.log("Pending Alerts Count:", pend);

      setResolved(res);
      setPending(pend);
    }
  }, [data, loading, error]);

  const chartData = [
    { name: 'Resolved', value: resolved },
    { name: 'Pending', value: pending },
  ];

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, Admin!</h1>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Total SOS Alerts</h3>
              <p className="text-2xl font-bold text-red-600">{resolved + pending}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Resolved Alerts</h3>
              <p className="text-2xl font-bold text-green-600">{resolved}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Active Volunteers</h3>
              <p className="text-2xl font-bold text-blue-600">--</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">NGOs</h3>
              <p className="text-2xl font-bold text-purple-600">--</p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">SOS Alert Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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