import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const NGODashboard = () => {
  const [stats, setStats] = useState([]);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    fetch("https://your-api-id.execute-api.ap-south-1.amazonaws.com/prod/getStats") // Replace with actual API Gateway URL
      .then((res) => res.json())
      .then((data) => {
        setStats([
          {
            title: "Total SOS Alerts",
            value: data.totalAlerts,
            icon: "🚨",
            color: "bg-red-100 text-red-700",
          },
          {
            title: "Volunteers Available",
            value: data.volunteersAvailable,
            icon: "🧑‍🤝‍🧑",
            color: "bg-yellow-100 text-yellow-700",
          },
          {
            title: "Assigned Cases",
            value: data.assignedCases,
            icon: "✅",
            color: "bg-green-100 text-green-700",
          },
          {
            title: "Pending Requests",
            value: data.pendingRequests,
            icon: "⏳",
            color: "bg-orange-100 text-orange-700",
          },
        ]);
        setGraphData(data.alertTrends); // Example: [{ day: 'Mon', count: 5 }, ...]
      });
  }, []);

  return (
    <div className="min-h-screen bg-yellow-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-red-700 text-center mb-8">NGO Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {stats.map((item, idx) => (
          <DashboardCard
            key={idx}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
            onClick={() => alert(`${item.title} clicked! (Later show detailed graph)`)}
          />
        ))}
      </div>

      <h2 className="text-xl font-semibold text-red-600 mb-4">Real-Time SOS Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#e53e3e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NGODashboard;