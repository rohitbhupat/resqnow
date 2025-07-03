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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/ngo-dashboard" element={<NGODashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;