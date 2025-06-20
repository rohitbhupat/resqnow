import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/api";
import { signUp } from "../services/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    role: "user",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Min 6 characters required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      console.log("Signup Data:", formData);
      await signUp(formData.username, formData.password, formData.phone);
      await saveUserData({
        username: formData.username,
        phone: formData.phone,
        role: formData.role,
        type: "signup",
        loginMethod: "cognito"
      });
      if (formData.role === "ngo") navigate("/ngo-dashboard");
      else if (formData.role === "volunteer") navigate("/volunteer-dashboard");
      else navigate("/sos");
    } catch (err) {
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-red-300 flex items-center justify-center px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-red-700 mb-4">ResQNow Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Remember Me */}
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

          {/* Role */}
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
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
          >
            Sign Up
          </button>
        </form>

        {/* Redirect to Login */}
        <div className="mt-6 text-center text-sm">
          <span>Already a user? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-red-700 font-medium hover:underline"
          >
            Login to ResQNow
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;