import React, { useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import AdminSidebar from '../../components/AdminSidebar';
import MapDisplay from '../../components/MapDisplay';
import { LIST_SOS_ALERTS } from '../../graphql/queries';
import { ON_CREATE_SOS_ALERT, ON_UPDATE_SOS_STATUS } from '../../graphql/subscriptions';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import usePageTitle from "../../pages/usePageTitle";

const AdminLiveMap = () => {
    usePageTitle("SOS LiveMap | ResQNow Admin");
    const [alerts, setAlerts] = useState([]);
    const [filter, setFilter] = useState('total');
    const navigate = useNavigate();

    const { loading, error, data } = useQuery(LIST_SOS_ALERTS);

    useSubscription(ON_CREATE_SOS_ALERT, {
        onData: ({ data }) => {
            const newAlert = data?.data?.onCreateResQNowGraphQLAPI;
            if (newAlert) {
                setAlerts(prev => [...prev, newAlert]);
                toast.success("New SOS alert received");
            }
        }
    });

    useSubscription(ON_UPDATE_SOS_STATUS, {
        onData: ({ data }) => {
            const updatedAlert = data?.data?.onUpdateResQNowGraphQLAPI;
            if (updatedAlert) {
                setAlerts(prev =>
                    prev.map(alert =>
                        alert.sos_id === updatedAlert.sos_id
                            ? { ...alert, status: updatedAlert.status }
                            : alert
                    )
                );
                toast.success("SOS alert updated");
            }
        }
    });

    useEffect(() => {
        if (data?.listResQNowGraphQLAPIS?.items) {
            console.log("Fetched SOS alerts:", data.listResQNowGraphQLAPIS.items);
            setAlerts(data.listResQNowGraphQLAPIS.items);
        }
    }, [data]);

    const total = alerts.length;
    const resolved = alerts.filter(a => a.status?.toLowerCase() === 'resolved').length;
    const active = total - resolved;

    const filteredAlerts = alerts.filter(alert => {
        if (filter === 'active') return alert.status?.toLowerCase() !== 'resolved';
        if (filter === 'resolved') return alert.status?.toLowerCase() === 'resolved';
        return true;
    });

    if (loading) return <p>Loading map...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;

    return (
        <div className="flex">
            <Toaster />
            <AdminSidebar />
            <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
                    >
                        Home
                    </button>
                </div>
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Live SOS Map</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                        { label: "Total Alerts", count: total, color: "blue", filterKey: "total" },
                        { label: "Active Alerts", count: active, color: "red", filterKey: "active" },
                        { label: "Resolved Alerts", count: resolved, color: "green", filterKey: "resolved" }
                    ].map(({ label, count, color, filterKey }) => (
                        <div
                            key={filterKey}
                            className={`cursor-pointer bg-white p-4 rounded shadow border-l-4 ${filter === filterKey ? `border-${color}-700` : `border-${color}-400`
                                }`}
                            onClick={() => setFilter(filterKey)}
                        >
                            <h2 className="text-lg font-semibold text-gray-700">{label}</h2>
                            <p className={`text-2xl font-bold text-${color}-600`}>{count}</p>
                        </div>
                    ))}
                </div>

                <MapDisplay alerts={filteredAlerts} />
            </div>
        </div>
    );
};

export default AdminLiveMap;