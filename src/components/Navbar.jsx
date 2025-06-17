import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // { username: 'abc', role: 'user' | 'ngo' | 'volunteer' }

  useEffect(() => {
    // Simulated login user from localStorage (replace with Cognito Auth check)
    const loggedInUser = JSON.parse(localStorage.getItem('resq_user'));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const handleLogout = () => {
    // Replace with Cognito logout if using AWS Amplify/Auth
    localStorage.removeItem('resq_user');
    setUser(null);
    navigate('/');
  };

  const renderProfileDropdown = () => (
    <div className="relative group cursor-pointer">
      <FaUserCircle size={24} className="text-gray-700 hover:text-red-600" />
      <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        <p className="px-4 py-2 text-sm text-gray-800 font-semibold">
          {user.username} <br />
          <span className="text-xs text-gray-500 capitalize">{user.role}</span>
        </p>
        <hr className="my-1" />

        <NavLink
          to={`/${user.role}/profile`}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Edit Profile
        </NavLink>

        <NavLink
          to={`/${user.role}/dashboard`}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {user.role === 'ngo' ? 'NGO Dashboard' :
            user.role === 'volunteer' ? 'Volunteer Dashboard' : 'My Dashboard'}
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink
          to="/"
          className="text-red-600 text-2xl font-bold tracking-wide"
        >
          ResQNow
        </NavLink>

        <div className="space-x-4 text-sm sm:text-base flex items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-red-600 font-semibold' : 'text-gray-700 hover:text-red-600'
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/sos"
            className={({ isActive }) =>
              isActive ? 'text-red-600 font-semibold' : 'text-gray-700 hover:text-red-600'
            }
          >
            SOS
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'text-red-600 font-semibold' : 'text-gray-700 hover:text-red-600'
            }
          >
            Dashboard
          </NavLink>

          {!user ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'text-red-600 font-semibold' : 'text-gray-700 hover:text-red-600'
              }
            >
              Login
            </NavLink>
          ) : (
            renderProfileDropdown()
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;