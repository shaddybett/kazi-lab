import React from "react";
import "./App.css"
import { Routes, Route } from "react-router-dom";
import Landing from "./Pages/LandingPage/Landing";
import Login from "./Pages/LoginPage/Login";
import Signup from "./Pages/SignupPage/Signup";
import Dashboard from "./components/Dashboard";
import ClientDashboard from "./components/ClientDashboard";
import ProviderDashboard from "./components/ProviderDashboard";
import Profile from "./components/Profile";
import ProviderDetails from "./Pages/ProviderDetails/ProviderDetails";
import ServiceProviders from "./components/ServiceProviders";
import Providers from "./components/Providers";

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
      <Route path="/providers" element={<ServiceProviders />} />
      <Route path="/primes" element={<Providers />} />
    </Routes>
  );
}

export default App;
