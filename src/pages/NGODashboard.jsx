import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/Navbar";

const NGODashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterUrgency, setFilterUrgency] = useState("All");

  const ngo = JSON.parse(localStorage.getItem("resq_user"));

  useEffect(() => {
    fetchNGOAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, filterStatus, filterUrgency]);

  const fetchNGOAlerts = () => {
    fetch("https://x21bqp0ggg.execute-api.ap-south-1.amazonaws.com/ngostats/ngoSOSAlert")
      .then((res) => res.json())
      .then((data) => {
        const parsed = typeof data.body === "string" ? JSON.parse(data.body) : data.body || data;
        setAlerts(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch NGO alerts", err);
        toast.error("Failed to load NGO alerts");
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

  const handleStatusUpdate = async (sos_id) => {
    toast.loading("Updating status...", { id: "status" });
    try {
      const res = await fetch("https://x21bqp0ggg.execute-api.ap-south-1.amazonaws.com/ngostats/ngoSOSAlert", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sos_id, status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Status updated", { id: "status" });
        setEditingId(null);
        fetchNGOAlerts();
      } else {
        toast.error("Update failed: " + data.error, { id: "status" });
      }
    } catch (err) {
      toast.error("Error updating status", { id: "status" });
    }
  };

  const handleDelete = async (sos_id) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) return;

    toast.loading("Deleting alert...", { id: "delete" });
    try {
      const res = await fetch("https://x21bqp0ggg.execute-api.ap-south-1.amazonaws.com/ngostats/ngoSOSAlert", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sos_id }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Alert deleted", { id: "delete" });
        fetchNGOAlerts();
      } else {
        toast.error("Delete failed: " + data.error, { id: "delete" });
      }
    } catch (err) {
      toast.error("Error deleting alert", { id: "delete" });
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
    link.download = "sos_alerts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen p-6 bg-yellow-50 flex justify-center">
      <Toaster position="top-right" />
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-center mb-4 text-red-700">NGO Dashboard</h1>

        <div className="flex flex-wrap items-center justify-between mb-4 gap-4 px-2">
          <div className="flex gap-3">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border px-3 py-1 rounded">
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
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
                    <td className="p-2 border">
                      {editingId === alert.sos_id ? (
                        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="border p-1 rounded">
                          <option value="Pending">Pending</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            alert.status === "Resolved" ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {alert.status || "Pending"}
                        </span>
                      )}
                    </td>
                    <td className="p-2 border">{new Date(alert.timestamp).toLocaleString()}</td>
                    <td className="p-2 border space-x-1">
                      {editingId === alert.sos_id ? (
                        <>
                          <button onClick={() => handleStatusUpdate(alert.sos_id)} className="bg-green-600 px-2 py-1 rounded text-white">Save</button>
                          <button onClick={() => setEditingId(null)} className="bg-gray-500 px-2 py-1 rounded text-white">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(alert.sos_id); setNewStatus(alert.status); }} className="bg-blue-600 px-2 py-1 rounded text-white">Edit</button>
                          <button onClick={() => handleDelete(alert.sos_id)} className="bg-red-600 px-2 py-1 rounded text-white">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default NGODashboard;