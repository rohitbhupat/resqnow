import React from "react";
import DashboardCard from "../components/DashboardCard";

const NGODashboard = () => {
  const stats = [
    {
      title: "Total SOS Alerts",
      value: 128,
      icon: "🚨",
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Volunteers Available",
      value: 45,
      icon: "🧑‍🤝‍🧑",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Assigned Cases",
      value: 62,
      icon: "✅",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Pending Requests",
      value: 21,
      icon: "⏳",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="min-h-screen bg-yellow-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-red-700 text-center mb-8">
        NGO Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, idx) => (
          <DashboardCard
            key={idx}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>

      {/* You can later add: List of recent alerts, volunteer management, assignment table, etc. */}
    </div>
  );
};

export default NGODashboard;