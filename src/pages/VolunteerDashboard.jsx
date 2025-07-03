import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";

const VolunteerDashboard = () => {
  const [sosRequests, setSosRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API call to fetch SOS data
    fetch("https://x21bqp0ggg.execute-api.ap-south-1.amazonaws.com/sosStage/sos")
      .then(res => res.json())
      .then(data => {
        setSosRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch SOS data", err);
        setLoading(false);
      });
  }, []);

  const handleJoin = (id) => {
    // TODO: Add API call to assign volunteer
    console.log(`Joining SOS request: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-red-600 mb-6">
          Volunteer Dashboard
        </h1>

        {loading ? (
          <p className="text-center">Loading SOS requests...</p>
        ) : sosRequests.length === 0 ? (
          <p className="text-center">No active SOS requests.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sosRequests.map((sos) => (
              <div
                key={sos.id}
                className="bg-white shadow-md rounded-xl p-4 border border-red-200"
              >
                <h2 className="text-lg font-semibold text-gray-700">{sos.title}</h2>
                <p className="text-sm text-gray-600">Location: {sos.location}</p>
                <p className="text-sm text-gray-500">Time: {sos.time}</p>
                <button
                  onClick={() => handleJoin(sos.id)}
                  className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Join Mission
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;