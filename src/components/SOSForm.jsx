import React, { useState } from 'react';

const SOSForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        location: '',
        urgency: 'medium',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted SOS:', formData);
        alert("SOS alert sent! Help is on the way.");
        // TODO: Integrate with AWS Lambda + API Gateway to actually send the alert.
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-5">
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder='Enter your full name'
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        name="Phone"
                        placeholder='Enter your phone number'
                        required
                        value={formData.contact}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Your Location</label>
                    <input
                        type="text"
                        name="location"
                        placeholder='Enter your location'
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1 text-gray-700">Urgency Level</label>
                    <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
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
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                        placeholder="Briefly describe your situation..."
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                >
                    Send SOS
                </button>
            </form>
        </>
    );
};

export default SOSForm;
