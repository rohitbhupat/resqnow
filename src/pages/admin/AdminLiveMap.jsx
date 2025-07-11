import React, { useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import AdminSidebar from '../../components/AdminSidebar';
import MapDisplay from '../../components/MapDisplay';
import { LIST_SOS_ALERTS } from '../../graphql/queries';
import { ON_CREATE_SOS_ALERT, ON_UPDATE_SOS_STATUS } from '../../graphql/subscriptions';
import { toast, Toaster } from 'react-hot-toast';

const AdminLiveMap = () => {
    const [alerts, setAlerts] = useState([]);
    const [filter, setFilter] = useState('total'); // 'total' | 'active' | 'resolved'

    const { loading, error, data } = useQuery(LIST_SOS_ALERTS);

    useSubscription(ON_CREATE_SOS_ALERT, {
        onData: ({ data: { data } }) => {
            if (data?.onCreateResQNowGraphQLAPI) {
                setAlerts(prev => [...prev, data.onCreateResQNowGraphQLAPI]);
                toast.success("New SOS alert received");
            }
        }
    });

    useSubscription(ON_UPDATE_SOS_STATUS, {
        onData: ({ data: { data } }) => {
            if (data?.onUpdateResQNowGraphQLAPI) {
                setAlerts(prev =>
                    prev.map(alert =>
                        alert.sos_id === data.onUpdateResQNowGraphQLAPI.sos_id
                            ? { ...alert, status: data.onUpdateResQNowGraphQLAPI.status }
                            : alert
                    )
                );
                toast.success("SOS alert updated");
            }
        }
    });

    useEffect(() => {
        if (data?.listResQNowGraphQLAPIS?.items) {
            setAlerts(data.listResQNowGraphQLAPIS.items);
        }
    }, [data]);

    const total = alerts.length;
    const resolved = alerts.filter(a => a.status?.toLowerCase() === 'resolved').length;
    const active = total - resolved;

    const filteredAlerts = alerts.filter(alert => {
        if (filter === 'active') return alert.status?.toLowerCase() !== 'resolved';
        if (filter === 'resolved') return alert.status?.toLowerCase() === 'resolved';
        return true; // total
    });

    const firstLocation = filteredAlerts.find(a => a.location && a.location.includes(','));
    const [lat, lng] = firstLocation ? firstLocation.location.split(',').map(parseFloat) : [28.6139, 77.2090];

    if (loading) return <p>Loading map...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;

    return (
        <div className="flex">
            <Toaster />
            <AdminSidebar />
            <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Live SOS Map</h1>

                {/* Summary Cards with click filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div
                        className={`cursor-pointer bg-white p-4 rounded shadow border-l-4 ${filter === 'total' ? 'border-blue-700' : 'border-blue-400'}`}
                        onClick={() => setFilter('total')}
                    >
                        <h2 className="text-lg font-semibold text-gray-700">Total Alerts</h2>
                        <p className="text-2xl font-bold text-blue-600">{total}</p>
                    </div>
                    <div
                        className={`cursor-pointer bg-white p-4 rounded shadow border-l-4 ${filter === 'active' ? 'border-red-700' : 'border-red-400'}`}
                        onClick={() => setFilter('active')}
                    >
                        <h2 className="text-lg font-semibold text-gray-700">Active Alerts</h2>
                        <p className="text-2xl font-bold text-red-600">{active}</p>
                    </div>
                    <div
                        className={`cursor-pointer bg-white p-4 rounded shadow border-l-4 ${filter === 'resolved' ? 'border-green-700' : 'border-green-400'}`}
                        onClick={() => setFilter('resolved')}
                    >
                        <h2 className="text-lg font-semibold text-gray-700">Resolved Alerts</h2>
                        <p className="text-2xl font-bold text-green-600">{resolved}</p>
                    </div>
                </div>

                {/* Map */}
                <MapDisplay alerts={filteredAlerts} focusLat={lat} focusLng={lng} />
            </div>
        </div>
    );
};

export default AdminLiveMap;