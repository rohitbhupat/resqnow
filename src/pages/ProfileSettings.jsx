import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import PhoneInput from 'react-phone-input-2';
import toast, { Toaster } from 'react-hot-toast';
import 'react-phone-input-2/lib/style.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import usePageTitle from "../pages/usePageTitle";

const ProfileSettings = () => {
    usePageTitle("Profile | ResQNow");

    const [profileData, setProfileData] = useState({
        username: '',
        contact: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('resq_user'));
        if (stored) {
            setProfileData(prev => ({
                ...prev,
                username: stored.username || '',
                contact: stored.contact || '',
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        if (profileData.password && profileData.password !== profileData.confirmPassword) {
            toast.error("❌ Passwords do not match");
            return;
        }

        const updated = {
            username: profileData.username,
            contact: profileData.contact,
            password: profileData.password
        };

        localStorage.setItem('resq_user', JSON.stringify(updated));
        window.dispatchEvent(new Event("resq_user_update"));
        toast.success("✅ Profile settings updated");
    };

    return (
        <>
            <Navbar />
            <Toaster position="top-right" />
            <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-4 text-red-600">Profile Settings</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={profileData.username}
                            className="w-full px-3 py-2 border rounded bg-white-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <PhoneInput
                            country={'in'}
                            value={profileData.contact}
                            onChange={(phone) => setProfileData(prev => ({ ...prev, contact: `+${phone}` }))}
                            inputStyle={{ width: '100%' }}
                            inputProps={{
                                name: 'contact',
                                required: true,
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={profileData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Leave blank to keep current"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={profileData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Re-enter new password"
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </>
    );
};

export default ProfileSettings;