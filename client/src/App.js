import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./Pages/LandingPage/Landing";
import Login from "./Pages/LoginPage/Login";
import Signup from "./Pages/SignupPage/Signup";
import Dashboard from "./components/Dashboard";
import ClientDashboard from "./components/ClientDashboard";
import ProviderDashboard from "./components/ProviderDashboard";
import Profile from "./components/Profile";
import ProviderDetails from "./components/ProviderDetails";
import ServiceProviders from "./components/ServiceProviders";
import Providers from "./components/Providers";
import AdminPage from "./Pages/AdminPage/AdminPage";
import ChatBox from "./Pages/Chatbox/ChatBox";
import AdminMain from "./Pages/AdminPage/AdminMain";
import Sidebar from "./Pages/Chat/SideBar";
import Uploads from "./components/Uploads";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/clientPage" element={<ClientDashboard />} />
      <Route path="/adminPage" element={<AdminPage/>} />
      <Route path="/providerPage" element={<ProviderDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/provider-details" element={<ProviderDetails />} />
      <Route path="/providers" element={<ServiceProviders />} />
      <Route path="/primes" element={<Providers />} />
      <Route path="/chat/:userId" element={<ChatBox />} />
      <Route path="/adminMain" element={<AdminMain/>} />
      <Route path="/sidebar" element={<Sidebar/>} />
      <Route path="/uploads" element={<Uploads/>} />
    </Routes>
  );
}
export default App;
