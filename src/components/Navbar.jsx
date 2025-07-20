import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('resq_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // 🚀 Redirect admin to admin dashboard if current path is root or login
      if (
        parsedUser.role === 'admin' &&
        (location.pathname === '/' || location.pathname === '/login')
      ) {
        navigate('/admin/dashboard');
      }
    } else {
      setUser(null);
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('resq_user');
    localStorage.removeItem('resqnowSession');
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="text-red-600 text-2xl font-bold tracking-wide">
          ResQNow
        </NavLink>

        <div className="space-x-4 text-sm sm:text-base flex items-center relative">
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

          {user && (
            <NavLink
              to={`/${user.role === 'admin' ? 'admin' : user.role}-dashboard`}
              className={({ isActive }) =>
                isActive ? 'text-red-600 font-semibold' : 'text-gray-700 hover:text-red-600'
              }
            >
              Dashboard
            </NavLink>
          )}

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
            <div className="relative">
              <button onClick={toggleDropdown} className="text-gray-800 hover:text-red-600">
                <FaUserCircle className="text-2xl" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg z-20"
                  onMouseLeave={closeDropdown}
                >
                  <div className="px-4 py-3 border-b text-sm text-gray-700">
                    Welcome, <span className="font-semibold">{user.username}</span>
                    <br />
                    <span className="text-xs text-gray-500 capitalize">
                      {user.role === 'admin' ? 'Admin' : user.role}
                    </span>
                  </div>

                  <NavLink
                    to="/profile"
                    onClick={closeDropdown}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;