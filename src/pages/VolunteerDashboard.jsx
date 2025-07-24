import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import MapDisplay from '../components/MapDisplay';
import usePageTitle from "../pages/usePageTitle";

const VolunteerDashboard = () => {
  usePageTitle("Volunteer Dashboard | ResQNow");
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterUrgency, setFilterUrgency] = useState("All");
  const volunteer = JSON.parse(localStorage.getItem("resq_user"));
  const [activeMapAlert, setActiveMapAlert] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, filterStatus, filterUrgency]);

  const fetchAlerts = () => {
    fetch(import.meta.env.VITE_VOLUNTEER_API)
      .then((res) => res.json())
      .then((data) => {
        const parsed = typeof data.body === "string" ? JSON.parse(data.body) : data.body || data;
        setAlerts(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch alerts", err);
        toast.error("Failed to load alerts");
        setLoading(false);
      });
  };

  const filterAlerts = () => {
    let filtered = [...alerts];
    if (filterStatus !== "All") {
      filtered = filtered.filter((a) => a.status === filterStatus);
    }
    if (filterUrgency !== "All") {
      filtered = filtered.filter((a) => a.urgency === filterUrgency);
    }
    setFilteredAlerts(filtered);
  };

  const handleJoin = async (sos_id) => {
    if (!volunteer?.username) {
      toast.error("Volunteer info missing");
      return;
    }

    toast.loading("Joining mission...", { id: "join" });
    try {
      const res = await fetch(import.meta.env.VITE_VOLUNTEER_API,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sos_id, volunteer_id: volunteer.username }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Successfully joined mission!", { id: "join" });
        fetchAlerts();
      } else {
        toast.error("Failed to join: " + data.error, { id: "join" });
      }
    } catch (err) {
      toast.error("Error joining mission", { id: "join" });
    }
  };

  const exportToCSV = () => {
    const headers = ["User", "Phone", "Message", "Location", "Urgency", "Status", "Time"];
    const rows = filteredAlerts.map((alert) => [
      alert.username,
      alert.contact || "N/A",
      alert.message,
      alert.location,
      alert.urgency,
      alert.status || "Pending",
      new Date(alert.timestamp).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "volunteer_alerts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const modalStyles = {
    overlay: "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40",
    container: "fixed inset-0 flex items-center justify-center z-50",
    content: "bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[40rem] overflow-y-auto transform transition-all duration-300",
  };
  return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl font-bold text-center mb-4 text-red-700">Volunteer Dashboard</h1>

          <div className="flex flex-wrap items-center justify-between mb-4 gap-4 px-2">
            <div className="flex gap-3">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border px-3 py-1 rounded">
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select value={filterUrgency} onChange={(e) => setFilterUrgency(e.target.value)} className="border px-3 py-1 rounded">
                <option value="All">All Urgency</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button onClick={exportToCSV} className="bg-green-600 text-white px-4 py-2 rounded">
              Export to CSV
            </button>
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : filteredAlerts.length === 0 ? (
            <p className="text-center">No SOS alerts found.</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full bg-white border rounded shadow text-sm text-left">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 border">User</th>
                    <th className="p-3 border">Phone</th>
                    <th className="p-3 border">Message</th>
                    <th className="p-3 border">Location</th>
                    <th className="p-3 border">Urgency</th>
                    <th className="p-3 text-left border-r border-gray-300">Map</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Time</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.map((alert) => (
                    <tr key={alert.sos_id} className="border-t">
                      <td className="p-2 border">{alert.username}</td>
                      <td className="p-2 border">{alert.contact || "N/A"}</td>
                      <td className="p-2 border">{alert.message}</td>
                      <td className="p-2 border">{alert.location}</td>
                      <td className="p-2 border capitalize">{alert.urgency}</td>
                      <td className="p-2 border-r border-gray-200">
                        <button onClick={() => setActiveMapAlert(alert)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold">

                          View Map
                        </button>
                      </td>
                      <td className="p-2 border">
                        <span className={`px-2 py-1 rounded text-white ${alert.status === "Resolved"
                          ? "bg-green-600"
                          : alert.status === "In Progress"
                            ? "bg-blue-600"
                            : "bg-red-600"
                          }`}>
                          {alert.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-2 border">{new Date(alert.timestamp).toLocaleString()}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleJoin(alert.sos_id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Join
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {activeMapAlert && (
                  <>
                    <div className={modalStyles.overlay} onClick={() => setActiveMapAlert(null)} />
                    <div className={modalStyles.container}>
                      <div className={modalStyles.content}>
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg font-bold text-gray-700">Map for {activeMapAlert.username}</h2>
                          <button onClick={() => setActiveMapAlert(null)} className="px-3 py-1 bg-red-500 text-white rounded">X</button>
                        </div>
                        <div className="h-full w-full overflow-hidden">
                          <MapDisplay alerts={[activeMapAlert]} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VolunteerDashboard;