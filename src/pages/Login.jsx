import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/api";
import { login } from "../services/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    role: "user",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("resqnowSession");
    if (saved) {
      const session = JSON.parse(saved);
      const now = new Date().getTime();
      if (now - session.timestamp < 12 * 60 * 60 * 1000) {
        navigate(session.redirect);
      } else {
        localStorage.removeItem("resqnowSession");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) newErrors.identifier = "Username is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const { token } = await login(formData.identifier, formData.password);

        const redirect =
          formData.role === "ngo"
            ? "/ngo-dashboard"
            : formData.role === "volunteer"
              ? "/volunteer-dashboard"
              : formData.role === "admin"
                ? "/admin-dashboard"
                : "/sos";

        // ✅ Save user info to localStorage so Navbar can read it
        localStorage.setItem(
          "resq_user",
          JSON.stringify({
            username: formData.identifier,
            role: formData.role,
          })
        );
        window.dispatchEvent(new Event("resq_user_update")); // ✅ This tells Navbar to refresh

        await saveUserData(
          {
            username: formData.identifier,
            role: formData.role,
            type: "login",
            loginMethod: "password",
          },
          token
        );

        if (formData.rememberMe) {
          localStorage.setItem(
            "resqnowSession",
            JSON.stringify({
              token,
              timestamp: new Date().getTime(),
              redirect,
            })
          );
        }

        navigate(redirect);
      } catch (error) {
        console.error("Login error:", error);
        setErrors({ password: "Invalid login credentials" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-700 mb-4">ResQNow Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
            <input
              type="text"
              name="identifier"
              placeholder="Enter Username"
              required
              value={formData.identifier}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
            />
            {errors.identifier && <p className="text-sm text-red-600 mt-1">{errors.identifier}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center text-sm">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-2 py-2 border border-gray-300 rounded-md"
            >
              <option value="user">User</option>
              <option value="ngo">NGO</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 text-sm sm:text-base"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span>New to ResQNow? </span>
          <button
            onClick={() => navigate("/signup")}
            className="text-yellow-700 font-medium hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
