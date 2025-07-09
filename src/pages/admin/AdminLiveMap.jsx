import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const AdminLiveMap = () => {
    return (
        <>
            <div className="flex">
                <AdminSidebar />
                <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">Live Map Here</h1>
                    {/* Add user table here */}
                </div>
            </div>
        </>
    );
};

export default AdminLiveMap;
