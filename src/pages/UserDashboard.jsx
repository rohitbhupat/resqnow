import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from "../components/Navbar";
import MapDisplay from '../components/MapDisplay';

const UserDashboard = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingAlertId, setEditingAlertId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const user = JSON.parse(localStorage.getItem('resq_user'));
    const [activeMapAlert, setActiveMapAlert] = useState(null);
    useEffect(() => {
        if (activeMapAlert) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [activeMapAlert]);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = () => {
        if (user?.username) {
            const url = `https://x21bqp0ggg.execute-api.ap-south-1.amazonaws.com/sosAlert/submitSOSAlert?username=${user.username}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    let parsedAlerts = [];
                    if (Array.isArray(data)) parsedAlerts = data;
                    else if (typeof data.body === 'string') parsedAlerts = JSON.parse(data.body);
                    else if (Array.isArray(data.body)) parsedAlerts = data.body;

                    setAlerts(parsedAlerts);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch user alerts", err);
                    toast.error("Failed to load alerts");
                    setLoading(false);
                });
        }
    };

    const handleEdit = (alert) => {
        setEditingAlertId(alert.sos_id);
        setEditedData({
            location: alert.location,
            message: alert.message,
            urgency: alert.urgency,
        });
    };

    const handleSave = async (id) => {
        toast.loading("Updating SOS alert...", { id: "update" });
        try {
            const response = await fetch("https://x21bqp0ggg.execute-api.ap-south-1.amazonaws.com/sosAlert/submitSOSAlert", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sos_id: id,
                    location: editedData.location,
                    message: editedData.message,
                    urgency: editedData.urgency
                })
            });

            const result = await response.json();
            if (response.ok) {
                toast.success("SOS alert updated successfully", { id: "update" });
                setEditingAlertId(null);
                fetchAlerts();
            } else {
                toast.error("Update failed: " + result.error, { id: "update" });
            }
        } catch (error) {
            console.error("Error while updating:", error);
            toast.error("An error occurred during update", { id: "update" });
        }
    };

    const handleCancelSOS = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to cancel this SOS alert?");
        if (!confirmDelete) return;

        toast.loading("Cancelling SOS alert...", { id: "cancel" });
        try {
            const response = await fetch("https://x21bqp0ggg.execute-api.ap-south-1.amazonaws.com/sosAlert/submitSOSAlert", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sos_id: id })
            });

            const result = await response.json();
            if (response.ok) {
                toast.success("SOS alert cancelled", { id: "cancel" });
                fetchAlerts();
            } else {
                toast.error("Cancel failed: " + result.error, { id: "cancel" });
            }
        } catch (error) {
            console.error("Error while deleting:", error);
            toast.error("Error cancelling alert", { id: "cancel" });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));
    };

    const modalStyles = {
        overlay: "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40",
        container: "fixed inset-0 flex items-center justify-center z-50",
        content: "bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[40rem] overflow-y-auto transform transition-all duration-300",
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen p-6 bg-blue-50">
                <Toaster position="top-right" />
                <h1 className="text-2xl font-bold text-center mb-6 text-red-700">My SOS History</h1>

                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : alerts.length === 0 ? (
                    <p className="text-center">No alerts submitted yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-xl shadow text-sm border border-gray-300">
                            <thead className="bg-red-100 border-b border-gray-300 text-red-800">
                                <tr>
                                    <th className="p-3 text-left border-r border-gray-300">Name</th>
                                    <th className="p-3 text-left border-r border-gray-300">Phone</th>
                                    <th className="p-3 text-left border-r border-gray-300">Message</th>
                                    <th className="p-3 text-left border-r border-gray-300">Location</th>
                                    <th className="p-3 text-left border-r border-gray-300">Urgency</th>
                                    <th className="p-3 text-left border-r border-gray-300">Status</th>
                                    <th className="p-3 text-left border-r border-gray-300">Time</th>
                                    <th className="p-3 text-left border-r border-gray-300">Map</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alerts.map(alert => (
                                    <tr key={alert.sos_id} className="border-b border-gray-200 hover:bg-red-50 transition">
                                        <td className="p-2 border-r border-gray-200">{alert.username}</td>
                                        <td className="p-2 border-r border-gray-200">{alert.contact || "N/A"}</td>
                                        <td className="p-2 border-r border-gray-200">
                                            {editingAlertId === alert.sos_id ? (
                                                <input type="text" name="message" value={editedData.message} onChange={handleInputChange} className="border p-1 rounded w-full" />
                                            ) : alert.message}
                                        </td>
                                        <td className="p-2 border-r border-gray-200">
                                            {editingAlertId === alert.sos_id ? (
                                                <input type="text" name="location" value={editedData.location} onChange={handleInputChange} className="border p-1 rounded w-full" />
                                            ) : alert.location}
                                        </td>
                                        <td className="p-2 border-r border-gray-200">
                                            {editingAlertId === alert.sos_id ? (
                                                <select name="urgency" value={editedData.urgency} onChange={handleInputChange} className="border p-1 rounded w-full">
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="critical">Critical</option>
                                                </select>
                                            ) : alert.urgency}
                                        </td>
                                        <td className="p-2 border-r border-gray-200">{alert.status || "Pending"}</td>
                                        <td className="p-2 border-r border-gray-200">{new Date(alert.timestamp).toLocaleString()}</td>
                                        <td className="p-2 border-r border-gray-200">
                                            <button onClick={() => setActiveMapAlert(alert)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold">

                                                View Map
                                            </button>
                                        </td>
                                        <td className="p-2 space-x-1">
                                            {editingAlertId === alert.sos_id ? (
                                                <>
                                                    <button onClick={() => handleSave(alert.sos_id)} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-semibold">Save</button>
                                                    <button onClick={() => setEditingAlertId(null)} className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-xs font-semibold">Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleEdit(alert)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold">Edit</button>
                                                    <button onClick={() => handleCancelSOS(alert.sos_id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold">Cancel</button>
                                                </>
                                            )}
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
        </>
    );
};

export default UserDashboard;