import React, { useCallback, useEffect, useState } from "react";
import { Sidebar, Avatar } from "flowbite-react";
import {
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiArrowSmLeft,
} from "react-icons/hi";
import ServiceProviderChatBox from "../Chatbox/ServiceProviderChatbox";
import BlockedUsers from "./BlockedUsers";
import AdminPage from "./AdminPage";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";

function AdminMain({ blocked, onclose, click }) {
  const currentUserId = localStorage.getItem("id");
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const renderComponent = () => {
    switch (activeComponent) {
      case "dasboard":
        return <div>Dashboard content</div>;
      case "users":
        return <AdminPage />;
      case "blocked":
        return (
          <BlockedUsers blocked={blocked} onclose={onclose} click={click} />
        );
      case "chat":
        return <ServiceProviderChatBox providerId={currentUserId} />;
      default:
        return <AdminPage />;
    }
  };
  const handleUser = useCallback(async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setUser(responseData);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred, please try again later");
    }
  }, []);
  useEffect(() => {
    handleUser();
  }, [handleUser]);
  const handleProfile = () => {
    navigate("/profile");
  };
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    });
    if (result.isConfirmed) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className=" sidebar flex h-screen bg-gray-800 text-white ">
      <Sidebar  >
        <div className="ml-16 mb-2 " >
          <img
            className="admipic "
            src={user.image}
            alt={Avatar}
            onClick={handleProfile}
          />
          <span className="block text-sm text-black ml-4 ">
            {user.first_name} {user.last_name}
          </span>
          <span className="block truncate text-sm font-medium ">
            {user.email}
          </span>
        </div>
        <Sidebar.Items className="ml-4" >
          <Sidebar.ItemGroup>
            <Sidebar.Item
              onClick={() => setActiveComponent("dashboard")}
              icon={HiChartPie}
            >
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              onClick={() => setActiveComponent("chat")}
              icon={HiInbox}
            >
              Inbox
            </Sidebar.Item>
            <Sidebar.Item
              onClick={() => setActiveComponent("blocked")}
              icon={HiShoppingBag}
            >
              Blocked
            </Sidebar.Item>
            <Sidebar.Item onClick={handleLogout} icon={HiArrowSmLeft}>
              Logout
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <div className="flex-grow p-4">{renderComponent()}</div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default AdminMain;
