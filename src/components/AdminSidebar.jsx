import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, AlertCircle, MapPin, Shield, Activity, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem('admin_sidebar_collapsed') === 'true');
    const navigate = useNavigate();

    const menu = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <Home size={18} /> },
        { name: 'SOS Alerts', path: '/admin/alerts', icon: <AlertCircle size={18} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={18} /> },
        { name: 'Volunteers', path: '/admin/volunteers', icon: <Shield size={18} /> },
        { name: 'NGOs', path: '/admin/ngos', icon: <Activity size={18} /> },
        { name: 'Live Map', path: '/admin/map', icon: <MapPin size={18} /> },
    ];
    const toggleSidebar = () => {
        setCollapsed(prev => {
            localStorage.setItem('admin_sidebar_collapsed', !prev);
            return !prev;
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("resq_admin");
        navigate("/login");
    };

    return (
        <div className={`min-h-screen ${collapsed ? 'w-20' : 'w-64'} bg-[#991b1b] text-white flex flex-col justify-between transition-all duration-300`}>
            <div>
                <div className="flex items-center justify-between p-4">
                    {!collapsed && <h2 className="text-xl font-bold">ResQNow Admin</h2>}
                    <button onClick={toggleSidebar} className="text-white">
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>

                </div>

                <nav className="flex flex-col space-y-1 px-2">
                    {menu.map(item => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-red-700 transition text-sm ${isActive ? 'bg-red-700' : ''
                                }`
                            }
                        >
                            {item.icon}
                            {!collapsed && <span>{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 m-2 bg-red-800 hover:bg-red-700 rounded-md text-sm font-medium"
            >
                <LogOut size={18} />
                {!collapsed && <span>Logout</span>}
            </button>
        </div>
    );
};

export default AdminSidebar;