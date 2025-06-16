import React from 'react';
import SOSForm from '../components/SOSForm';

const SOS = () => {
    return (
        <>
            <div className="min-h-screen bg-red-50 py-12 px-4 sm:px-10">
                <h1 className="text-3xl font-bold text-red-700 text-center mb-6">Send an SOS Alert</h1>
                <p className="text-center text-gray-700 mb-10 max-w-xl mx-auto">
                    Fill out the form below to send a real-time alert. Our volunteers and NGOs will be notified instantly to assist you.
                </p>
                <div className="max-w-2xl mx-auto">
                    <SOSForm />
                </div>
            </div>
        </>
    );
};

export default SOS;
