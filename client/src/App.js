import React from "react";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ClientDashboard from "./components/ClientDashboard";
import ProviderDashboard from "./components/ProviderDashboard";
import Profile from "./components/Profile";
import ProviderDetails from "./components/ProviderDetails";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/clientPage" element={<ClientDashboard />} />
      <Route path="/providerPage" element={<ProviderDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/provider-details" element={<ProviderDetails />} />
      <Route path="/providers" element={<ServiceProviders/>} />
    </Routes>
  );
}

export default App;
