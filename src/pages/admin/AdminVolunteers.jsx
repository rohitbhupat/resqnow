import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { toast, Toaster } from 'react-hot-toast';

const AdminVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingVolunteer, setEditingVolunteer] = useState(null);
    const [editedData, setEditedData] = useState({});

    const API = "https://x21bqp0ggg.execute-api.ap-south-1.amazonaws.com/userapi/userAPI";

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const res = await fetch(`${API}?scan=true&role=volunteer`);
            const data = await res.json();

            let parsed = data;
            if (data.body) {
                parsed = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
            }

            const items = parsed.Items || [];
            const onlyVolunteers = items.filter(user => user.role === 'volunteer');
            setVolunteers(onlyVolunteers);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch volunteers:", err);
            toast.error("Failed to load volunteers");
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingVolunteer(user.username);
        setEditedData({ contact: user.contact || '', role: user.role || 'volunteer' });
    };

    const handleSave = async (username) => {
        toast.loading("Updating volunteer...", { id: "update" });
        try {
            const res = await fetch(API, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, ...editedData })
            });
            const result = await res.json();

            if (res.ok) {
                toast.success("Volunteer updated", { id: "update" });
                setEditingVolunteer(null);
                fetchVolunteers();
            } else {
                toast.error(result.error || "Update failed", { id: "update" });
            }
        } catch (error) {
            toast.error("Error updating volunteer", { id: "update" });
        }
    };

    const handleDelete = async (username) => {
        if (!window.confirm("Are you sure you want to delete this volunteer?")) return;

        toast.loading("Deleting volunteer...", { id: "delete" });
        try {
            const res = await fetch(`${API}?username=${username}`, { method: "DELETE" });
            const result = await res.json();

            if (res.ok) {
                toast.success("Volunteer deleted", { id: "delete" });
                fetchVolunteers();
            } else {
                toast.error(result.error || "Delete failed", { id: "delete" });
            }
        } catch (error) {
            toast.error("Error deleting volunteer", { id: "delete" });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <div className="flex">
                <Toaster />
                <AdminSidebar />
                <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">All Volunteers</h1>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <table className="min-w-full table-fixed border-collapse bg-white rounded-xl shadow text-sm border border-gray-300">
                            <thead className="bg-red-200 text-red-800">
                                <tr className="text-left uppercase text-xs tracking-wider border-b border-gray-300">
                                    <th className="p-3 border-r border-gray-300">Username</th>
                                    <th className="p-3 border-r border-gray-300">Contact</th>
                                    <th className="p-3 border-r border-gray-300">Role</th>
                                    <th className="p-3 border-r border-gray-300">Last Updated</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {volunteers.map(user => {
                                    const lastUpdated = user.lastUpdated
                                        ? new Date(user.lastUpdated).toLocaleString()
                                        : '—';

                                    return (
                                        <tr
                                            key={user.username}
                                            className="border-b border-gray-300 hover:bg-red-50 transition"
                                        >
                                            <td className="p-3 border-r border-gray-200 font-medium text-gray-800">
                                                {user.username}
                                            </td>

                                            <td className="p-3 border-r border-gray-200 text-gray-700">
                                                {editingVolunteer === user.username ? (
                                                    <input
                                                        type="text"
                                                        name="contact"
                                                        value={editedData.contact}
                                                        onChange={handleChange}
                                                        className="border px-2 py-1 rounded w-full"
                                                    />
                                                ) : user.contact || '—'}
                                            </td>

                                            <td className="p-3 border-r border-gray-200 text-gray-700">
                                                {editingVolunteer === user.username ? (
                                                    <select
                                                        name="role"
                                                        value={editedData.role}
                                                        onChange={handleChange}
                                                        className="border px-2 py-1 rounded w-full"
                                                    >
                                                        <option value="volunteer">Volunteer</option>
                                                        <option value="user">User</option>
                                                        <option value="ngo">NGO</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                ) : (
                                                    <span className="capitalize">{user.role}</span>
                                                )}
                                            </td>

                                            <td className="p-3 border-r border-gray-200 text-gray-500">{lastUpdated}</td>

                                            <td className="p-3 space-x-2">
                                                {editingVolunteer === user.username ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSave(user.username)}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingVolunteer(null)}
                                                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.username)}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminVolunteers;