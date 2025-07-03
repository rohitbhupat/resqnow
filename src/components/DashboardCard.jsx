import React from 'react';

const DashboardCard = ({ title, value, icon, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${color} p-5 rounded-lg shadow hover:scale-105 transition-transform flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        <span className="text-sm bg-white px-2 py-1 rounded-full text-gray-600 shadow">Live</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;