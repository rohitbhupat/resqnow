import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import usePageTitle from "../../pages/usePageTitle";

const AdminUsers = () => {
    usePageTitle("Users List | ResQNow Admin");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [editedData, setEditedData] = useState({});
    const navigate = useNavigate();

    const API = import.meta.env.VITE_ADMIN_USER

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API}?scan=true`);
            const data = await res.json();

            let parsed = data;
            if (data.body) {
                parsed = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
            }

            const items = parsed.Items || [];
            setUsers(items);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            toast.error("Failed to load users");
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user.username);
        setEditedData({ contact: user.contact || '', role: user.role || 'user' });
    };

    const handleSave = async (username) => {
        toast.loading("Updating user...", { id: "update" });
        try {
            const res = await fetch(API, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, ...editedData })
            });
            const result = await res.json();

            if (res.ok) {
                toast.success("User updated", { id: "update" });
                setEditingUser(null);
                fetchUsers();
            } else {
                toast.error(result.error || "Update failed", { id: "update" });
            }
        } catch (error) {
            toast.error("Error updating user", { id: "update" });
        }
    };

    const handleDelete = async (username) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        toast.loading("Deleting user...", { id: "delete" });
        try {
            const res = await fetch(`${API}?username=${username}`, { method: "DELETE" });
            const result = await res.json();

            if (res.ok) {
                toast.success("User deleted", { id: "delete" });
                fetchUsers();
            } else {
                toast.error(result.error || "Delete failed", { id: "delete" });
            }
        } catch (error) {
            toast.error("Error deleting user", { id: "delete" });
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
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
                        >
                            Home
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">All Users</h1>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className='overflow-x-auto'>
                            <table className="min-w-full bg-white rounded-xl shadow text-sm border border-gray-300">
                                <thead className="bg-red-200 border-b border-gray-300 text-red-800">
                                    <tr className="text-left text-gray-700 uppercase text-xs tracking-wider">
                                        <th className="p-3">Username</th>
                                        <th className="p-3">Contact</th>
                                        <th className="p-3">Role</th>
                                        <th className="p-3">Last Updated</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => {
                                        const lastUpdated = user.lastUpdated
                                            ? new Date(user.lastUpdated).toLocaleString()
                                            : '—';

                                        return (
                                            <tr
                                                key={user.username}
                                                className="border-b border-gray-200 hover:bg-red-50 transition"
                                            >
                                                <td className="p-3 font-medium text-gray-800">{user.username}</td>

                                                <td className="p-3 text-gray-700 border-r border-gray-100">
                                                    {editingUser === user.username ? (
                                                        <input
                                                            type="text"
                                                            name="contact"
                                                            value={editedData.contact}
                                                            onChange={handleChange}
                                                            className="border px-2 py-1 rounded w-full"
                                                        />
                                                    ) : user.contact || '—'}
                                                </td>

                                                <td className="p-3 text-gray-700 border-r border-gray-100">
                                                    {editingUser === user.username ? (
                                                        <select
                                                            name="role"
                                                            value={editedData.role}
                                                            onChange={handleChange}
                                                            className="border px-2 py-1 rounded w-full"
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="ngo">NGO</option>
                                                            <option value="volunteer">Volunteer</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    ) : (
                                                        <span className="capitalize">{user.role || 'user'}</span>
                                                    )}
                                                </td>

                                                <td className="p-3 text-gray-500 border-r border-gray-100">{lastUpdated}</td>

                                                <td className="p-3 space-x-2 border-r border-gray-100">
                                                    {editingUser === user.username ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleSave(user.username)}
                                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingUser(null)}
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
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminUsers;