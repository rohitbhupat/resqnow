import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/api";
import { login } from "../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("password");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    role: "user",
    otp: "",
    rememberMe: false,
  });

  const [otpCooldown, setOtpCooldown] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleLoginTypeChange = (e) => {
    setLoginType(e.target.value);
  };

  const handleGenerateOtp = () => {
    if (otpCooldown === 0) {
      console.log("OTP generated and sent.");
      setOtpCooldown(60);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) newErrors.identifier = "Username or Phone is required.";
    if (loginType === "password") {
      if (!formData.password.trim()) newErrors.password = "Password is required.";
      else if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters.";
    } else {
      if (!formData.otp.trim()) newErrors.otp = "OTP is required.";
      else if (!/^\d{6}$/.test(formData.otp)) newErrors.otp = "OTP must be 6 digits.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log("Login Data:", formData, "Method:", loginType);

      // ✅ Save login event to DynamoDB via backend
      try {
        const { token } = await login(formData.identifier, formData.password); // Cognito auth
        await saveUserData({
          username: formData.identifier,
          role: formData.role,
          type: "login",
          loginMethod: loginType,
        }, token); // pass token!
      } catch (error) {
        console.error("Login error:", error);
        return;
      }


      // ✅ Navigate after login
      if (formData.role === "ngo") {
        navigate("/ngodashboard");
      } else if (formData.role === "volunteer") {
        navigate("/volunteerdashboard");
      } else {
        navigate("/sos");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-700 mb-4">ResQNow Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username or Phone</label>
            <input
              type="text"
              name="identifier"
              placeholder="Enter username or Phone number"
              required
              value={formData.identifier}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
            />
            {errors.identifier && <p className="text-sm text-red-600 mt-1">{errors.identifier}</p>}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-700">
            <label className="flex items-center">
              <input
                type="radio"
                value="password"
                checked={loginType === "password"}
                onChange={handleLoginTypeChange}
                className="mr-1"
              />
              Password
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="otp"
                checked={loginType === "otp"}
                onChange={handleLoginTypeChange}
                className="mr-1"
              />
              OTP
            </label>
          </div>

          {loginType === "password" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter your OTP"
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                />
                {errors.otp && <p className="text-sm text-red-600 mt-1">{errors.otp}</p>}
                <button
                  type="button"
                  onClick={handleGenerateOtp}
                  disabled={otpCooldown > 0}
                  className={`px-4 py-2 rounded-md text-white text-sm sm:text-base ${otpCooldown > 0 ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"
                    }`}
                >
                  {otpCooldown > 0 ? `Wait ${otpCooldown}s` : "Generate OTP"}
                </button>
              </div>
            </div>
          )}

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
            >
              <option value="user">User</option>
              <option value="ngo">NGO</option>
              <option value="volunteer">Volunteer</option>
            </select>
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