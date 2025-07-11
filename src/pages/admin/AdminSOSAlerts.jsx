import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import MapDisplay from '../../components/MapDisplay';
import { Toaster, toast } from 'react-hot-toast';

const AdminSOSAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingAlertId, setEditingAlertId] = useState(null);
    const [editedData, setEditedData] = useState({});
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
        const adminUsername = "admin";
        fetch(`https://x21bqp0ggg.execute-api.ap-south-1.amazonaws.com/sosAlert/submitSOSAlert?username=${adminUsername}`)
            .then(res => res.json())
            .then(data => {
                let parsedAlerts = [];
                if (Array.isArray(data)) parsedAlerts = data;
                else if (typeof data.body === 'string') parsedAlerts = JSON.parse(data.body);
                else if (Array.isArray(data.body)) parsedAlerts = data.body;
                else if (data.body && Array.isArray(data.body.Items)) parsedAlerts = data.body.Items;
                setAlerts(parsedAlerts);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch alerts", err);
                toast.error("Failed to load alerts");
                setLoading(false);
            });
    };

    const handleEdit = (alert) => {
        setEditingAlertId(alert.sos_id);
        setEditedData({ location: alert.location, message: alert.message, urgency: alert.urgency });
    };

    const handleSave = async (id) => {
        toast.loading("Updating SOS alert...", { id: "update" });
        try {
            const response = await fetch("https://x21bqp0ggg.execute-api.ap-south-1.amazonaws.com/sosAlert/submitSOSAlert", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sos_id: id, location: editedData.location, message: editedData.message, urgency: editedData.urgency })
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
            <div className="flex">
                <Toaster position="top-right" />
                <AdminSidebar />
                <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">All SOS Alerts</h1>

                    {loading ? (
                        <p>Loading...</p>
                    ) : alerts.length === 0 ? (
                        <p>No SOS alerts found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-xl shadow text-sm border border-gray-300">
                                <thead className="bg-red-200 border-b border-gray-300 text-red-800">
                                    <tr>
                                        {["Username", "Contact", "Message", "Location", "Urgency", "Status", "Timestamp", "Map", "Actions"].map(header => (
                                            <th key={header} className="p-3 text-left border-r border-gray-200 whitespace-nowrap">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {alerts.map(alert => (
                                        <tr key={alert.sos_id} className="border-b border-gray-200 hover:bg-red-50 transition">
                                            <td className="p-2 border-r border-gray-100">{alert.username}</td>
                                            <td className="p-2 border-r border-gray-100">{alert.contact || 'N/A'}</td>
                                            <td className="p-2 border-r border-gray-100">
                                                {editingAlertId === alert.sos_id ? (
                                                    <input type="text" name="message" value={editedData.message} onChange={handleInputChange} className="border p-1 rounded w-full" />
                                                ) : alert.message}
                                            </td>
                                            <td className="p-2 border-r border-gray-100">
                                                {editingAlertId === alert.sos_id ? (
                                                    <input type="text" name="location" value={editedData.location} onChange={handleInputChange} className="border p-1 rounded w-full" />
                                                ) : alert.location}
                                            </td>
                                            <td className="p-2 border-r border-gray-100">
                                                {editingAlertId === alert.sos_id ? (
                                                    <select name="urgency" value={editedData.urgency} onChange={handleInputChange} className="border p-1 rounded w-full">
                                                        {['low', 'medium', 'high', 'critical'].map(level => (
                                                            <option key={level} value={level}>{level}</option>
                                                        ))}
                                                    </select>
                                                ) : alert.urgency}
                                            </td>
                                            <td className="p-2 border-r border-gray-100">{alert.status || "Pending"}</td>
                                            <td className="p-2 border-r border-gray-100">{new Date(alert.timestamp).toLocaleString()}</td>
                                            <td className="p-2 border-r border-gray-100">
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
                            </table>

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
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminSOSAlerts;