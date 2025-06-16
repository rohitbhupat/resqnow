import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <NavLink
          to="/"
          className="text-red-600 text-2xl font-bold font-sans tracking-wide"
        >
          ResQNow
        </NavLink>

        <div className="space-x-4 text-sm sm:text-base">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-red-600 font-semibold'
                : 'text-gray-700 hover:text-red-600 font-medium'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/sos"
            className={({ isActive }) =>
              isActive
                ? 'text-red-600 font-semibold'
                : 'text-gray-700 hover:text-red-600 font-medium'
            }
          >
            SOS
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? 'text-red-600 font-semibold'
                : 'text-gray-700 hover:text-red-600 font-medium'
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? 'text-red-600 font-semibold'
                : 'text-gray-700 hover:text-red-600 font-medium'
            }
          >
            Dashboard
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
