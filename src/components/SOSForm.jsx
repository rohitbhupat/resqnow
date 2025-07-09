import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const SOSForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        contact: '',
        location: '',
        urgency: 'medium',
        message: '',
        resources_required: [],
    });

    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('resq_user'));
        if (storedUser) {
            setFormData(prev => ({
                ...prev,
                username: storedUser.username || '',
                contact: storedUser.contact || '',
            }));
        }
        fetchLocation();
    }, []);

    const fetchLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const coords = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
                setFormData(prev => ({ ...prev, location: coords }));
                setIsLocating(false);
            },
            (error) => {
                console.error("Location error:", error);
                toast.error("Failed to fetch location");
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResourceChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            let updated = [...prev.resources_required];
            if (checked) updated.push(value);
            else updated = updated.filter(res => res !== value);
            return { ...prev, resources_required: updated };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://x21bqp0ggg.execute-api.ap-south-1.amazonaws.com/sosAlert/submitSOSAlert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("🚨 SOS alert sent!");
                setFormData({
                    username: formData.username,
                    contact: formData.contact,
                    location: '',
                    urgency: 'medium',
                    message: '',
                    resources_required: [],
                });
            } else {
                toast.error("Failed to send SOS");
            }
        } catch (err) {
            console.error("Error sending SOS:", err);
            toast.error("Network error");
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-5">
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        readOnly
                        className="w-full border p-2 rounded bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Phone Number</label>
                    <PhoneInput
                        country={'in'}
                        value={formData.contact}
                        onChange={(phone) => setFormData(prev => ({ ...prev, contact: `+${phone}` }))}
                        inputStyle={{ width: '100%' }}
                        inputProps={{
                            name: 'contact',
                            required: true,
                        }}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Live Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                    <button
                        type="button"
                        onClick={fetchLocation}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                        disabled={isLocating}
                    >
                        {isLocating ? 'Locating...' : 'Get Live Location'}
                    </button>
                </div>
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Urgency Level</label>
                    <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Message</label>
                    <textarea
                        name="message"
                        rows="4"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Resources Required</label>
                    <div className="flex flex-wrap gap-3 mt-2">
                        {["Food", "Water", "Shelter", "Medical", "Rescue", "Clothing", "Other"].map((res) => (
                            <label key={res} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={res}
                                    name='resources_required'
                                    checked={formData.resources_required.includes(res)}
                                    onChange={handleResourceChange}
                                />
                                <span>{res}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
                    Send SOS
                </button>
            </form>
        </>
    );
};

export default SOSForm;