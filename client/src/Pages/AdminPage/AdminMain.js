import React, { useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
// import AdminPage from "./AdminPage";
import ServiceProviderChatBox from "../Chatbox/ServiceProviderChatbox";
import BlockedUsers from "./BlockedUsers";
import AdminPage from "./AdminPage";

function AdminMain({blocked,onclose,click}) {
  const currentUserId = localStorage.getItem("id");
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "dasboard":
        return <div>Dashboard content</div>;
      case "users":
            return <AdminPage/>;
      case "blocked":
        return <BlockedUsers blocked={blocked} onclose={onclose} click={click} />
      case "chat":
        return <ServiceProviderChatBox providerId={currentUserId} />;
      default:
        return <AdminPage/>
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar aria-label="Sidebar with logo branding example">
        <Sidebar.Logo href="#" img="/favicon.svg" imgAlt="kq">
          KaziQonnect
        </Sidebar.Logo>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              onClick={() => setActiveComponent("dashboard")}
              icon={HiChartPie}
            >
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              onClick={() => setActiveComponent("kanban")}
              icon={HiViewBoards}
            >
              Kanban
            </Sidebar.Item>
            <Sidebar.Item
              onClick={() => setActiveComponent("inbox")}
              icon={HiInbox}
            >
              Inbox
            </Sidebar.Item>
            <Sidebar.Item
              onClick={() => setActiveComponent("users")}
              icon={HiUser}
            >
              Users
            </Sidebar.Item>
            <Sidebar.Item
              onClick={() => setActiveComponent("blocked")}
              icon={HiShoppingBag}
            >
              Blocked
            </Sidebar.Item>
            <Sidebar.Item
              onClick={() => setActiveComponent("chat")}
              icon={HiArrowSmRight}
            >
              Chat
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <div className="flex-grow p-4">{renderComponent()}</div>
    </div>
  );
}

export default AdminMain;
