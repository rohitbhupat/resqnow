import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import SOS from './pages/SOS';
import ProfileSettings from './pages/ProfileSettings';
import NGODashboard from './pages/NGODashboard';
import UserDashboard from './pages/UserDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import MapDisplay from "./components/MapDisplay";

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSOSAlerts from './pages/admin/AdminSOSAlerts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminNGOs from './pages/admin/AdminNGOs';
import AdminLiveMap from './pages/admin/AdminLiveMap';

import 'mapbox-gl/dist/mapbox-gl.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public/User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/ngo-dashboard" element={<NGODashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/mapdisplay" element={<MapDisplay />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/alerts" element={<AdminSOSAlerts />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/volunteers" element={<AdminVolunteers />} />
        <Route path="/admin/ngos" element={<AdminNGOs />} />
        <Route path="/admin/map" element={<AdminLiveMap />} />
      </Routes>
    </Router>
  );
};

export default App;