import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, AlertCircle, MapPin, Shield, Activity, LogOut } from 'lucide-react';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const menu = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <Home size={18} /> },
        { name: 'SOS Alerts', path: '/admin/alerts', icon: <AlertCircle size={18} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={18} /> },
        { name: 'Volunteers', path: '/admin/volunteers', icon: <Shield size={18} /> },
        { name: 'NGOs', path: '/admin/ngos', icon: <Activity size={18} /> },
        { name: 'Live Map', path: '/admin/map', icon: <MapPin size={18} /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem("resq_admin"); // Adjust key if different
        navigate("/login");
    };

    return (
        <>
            <div className="w-64 min-h-screen bg-[#991b1b] text-white p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">ResQNow Admin</h2>
                    <nav className="flex flex-col space-y-2">
                        {menu.map(item => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-red-700 transition ${isActive ? 'bg-red-700' : ''}`
                                }
                            >
                                {item.icon}
                                <span className="text-sm font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 rounded-md text-sm font-medium"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </>
    );
};

export default AdminSidebar;