import React from 'react';

const DashboardCard = ({ title, value, icon, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${color} p-5 rounded-lg shadow hover:scale-105 transition-transform`}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default DashboardCard;