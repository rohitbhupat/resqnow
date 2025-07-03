import React, { useEffect, useState } from 'react';

const SOSForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        location: '',
        urgency: 'medium',
        message: '',
    });

    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('resq_user'));
        if (storedUser) {
            setFormData(prev => ({ ...prev, name: storedUser.username, contact: storedUser.contact }));
        }
        fetchLocation();
    }, []);

    const fetchLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                console.log("GPS Accuracy (in meters):", accuracy);
                const coords = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
                setFormData(prev => ({ ...prev, location: coords }));
                setIsLocating(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your live location.");
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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const storedUser = JSON.parse(localStorage.getItem('resq_user'));
            const payload = {
                ...formData,
                username: storedUser?.username || '',  // ✅ include username
            };

            const res = await fetch('https://x21bqp0ggg.execute-api.ap-south-1.amazonaws.com/sosAlert/submitSOSAlert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("SOS alert sent! Help is on the way.");
                setFormData({
                    name: '',
                    contact: '',
                    location: '',
                    urgency: 'medium',
                    message: '',
                });
            } else {
                alert("Failed to send SOS. Try again.");
            }
        } catch (err) {
            console.error("Error sending SOS:", err);
            alert("Network error. Try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-5">
            <div>
                <label className="block font-medium mb-1 text-gray-700">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
                <label className="block font-medium mb-1 text-gray-700">Phone Number</label>
                <input type="tel" name="contact" required value={formData.contact} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
                <label className="block font-medium mb-1 text-gray-700">Live Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full border p-2 rounded" />
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
                <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full border p-2 rounded">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
            </div>
            <div>
                <label className="block font-medium mb-1 text-gray-700">Message</label>
                <textarea name="message" rows="4" required value={formData.message} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
                Send SOS
            </button>
        </form>
    );
};

export default SOSForm;