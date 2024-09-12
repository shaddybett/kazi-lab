// import React, { useCallback, useEffect, useState } from "react";
// import { Avatar } from "flowbite-react";
// import {
//   HiChartPie,
//   HiInbox,
//   HiShoppingBag,
//   HiUser,
//   HiArrowSmLeft,
// } from "react-icons/hi";
// import ServiceProviderChatBox from "../Chatbox/ServiceProviderChatbox";
// import BlockedUsers from "./BlockedUsers";
// import AdminPage from "./AdminPage";
// import Profile from "../../components/Profile";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import "./AdminPage.css";

// function AdminMain({ blocked, onclose, click }) {
//   const currentUserId = localStorage.getItem("id");
//   const [activeComponent, setActiveComponent] = useState("dashboard");
//   const [user, setUser] = useState({});
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const renderComponent = () => {
//     switch (activeComponent) {
//       case "dasboard":
//         return <div>Dashboard content</div>;
//       case "users":
//         return <AdminPage />;
//       case "profile":
//         return <Profile />;
//       case "blocked":
//         return (
//           <BlockedUsers blocked={blocked} onclose={onclose} click={click} />
//         );
//       case "chat":
//         return <ServiceProviderChatBox providerId={currentUserId} />;
//       default:
//         return <AdminPage />;
//     }
//   };
//   const handleUser = useCallback(async () => {
//     try {
//       const backendUrl = process.env.REACT_APP_BACKEND_URL;
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${backendUrl}/dashboard`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const responseData = await response.json();
//         setUser(responseData);
//       } else {
//         const errorMessage = await response.json();
//         setError(errorMessage.error);
//       }
//     } catch (error) {
//       setError("An error occurred, please try again later");
//     }
//   }, []);
//   useEffect(() => {
//     handleUser();
//   }, [handleUser]);
//   const handleLogout = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Logout!",
//     });
//     if (result.isConfirmed) {
//       localStorage.removeItem("token");
//       navigate("/login");
//     }
//   };

//   return (
//     <div className="general-sidebar flex h-screen text-white">
//       {/* Sidebar */}
//       <div className="sidebar bg-gray-800 w-64 p-2 h-full flex flex-col">
//         {/* User Avatar and Info */}
//         <div className="flex flex-col items-center mb-4">
//           <Avatar
//             img={user.image}
//             size="xl"
//             rounded={true}
//             className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
//             onClick={() => setActiveComponent("profile")}
//           />
//           <span className="admin-name text-black">
//             {user.first_name} {user.last_name}
//           </span>
//           <span className="admin-email">{user.email}</span>
//         </div>

//         {/* Sidebar Navigation */}
//         <div className="board flex flex-col space-y-2 flex-grow">
//           <div
//             className={`flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-500 hover:text-white transition-colors ${
//               activeComponent === "dashboard"
//                 ? "bg-gray-600 text-white"
//                 : "text-white"
//             }`}
//             onClick={() => setActiveComponent("dashboard")}
//           >
//             <HiChartPie className="mr-3 text-xl" />
//             <span>Dashboard</span>
//           </div>

//           <div
//             className={`flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-500 hover:text-white transition-colors ${
//               activeComponent === "profile"
//                 ? "bg-gray-600 text-white"
//                 : "text-white"
//             }`}
//             onClick={() => setActiveComponent("profile")}
//           >
//             <HiUser className="mr-3 text-xl" />
//             <span>Profile</span>
//           </div>

//           <div
//             className={`flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-500 hover:text-white transition-colors ${
//               activeComponent === "chat"
//                 ? "bg-gray-600 text-white"
//                 : "text-white"
//             }`}
//             onClick={() => setActiveComponent("chat")}
//           >
//             <HiInbox className="mr-3 text-xl" />
//             <span>Inbox</span>
//           </div>

//           <div
//             className={`flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-500 hover:text-white transition-colors ${
//               activeComponent === "blocked"
//                 ? "bg-gray-600 text-white"
//                 : "text-white"
//             }`}
//             onClick={() => setActiveComponent("blocked")}
//           >
//             <HiShoppingBag className="mr-3 text-xl" />
//             <span>Blocked</span>
//           </div>

//           <div
//             className="flex items-center p-2 rounded-sm cursor-pointer hover:bg-red-800 hover:text-white text-white transition-colors bg-red-600 "
//             onClick={handleLogout}
//           >
//             <HiArrowSmLeft className="mr-3 text-2xl" />
//             <span>Logout</span>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow p-4 overflow-auto">
//         {renderComponent()}
//         {error && <p style={{ color: "red" }}>{error}</p>}
//       </div>
//     </div>
//   );
// }

// export default AdminMain;

import React, { useCallback, useEffect, useState } from "react";
import { Avatar } from "flowbite-react";
import {
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiUser,
  HiArrowSmLeft,
  HiMenu,
} from "react-icons/hi";
import ServiceProviderChatBox from "../Chatbox/ServiceProviderChatbox";
import BlockedUsers from "./BlockedUsers";
import AdminPage from "./AdminPage";
import Profile from "../../components/Profile";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";

function AdminMain({ blocked, onclose, click }) {
  const currentUserId = localStorage.getItem("id");
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false); // State for minimization
  const navigate = useNavigate();

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <AdminPage />;
      case "users":
        return <AdminPage />;
      case "profile":
        return <Profile  minimize={isSidebarMinimized} />;
      case "blocked":
        return (
          <BlockedUsers blocked={blocked} onclose={onclose} click={click} />
        );
      case "chat":
        return <ServiceProviderChatBox providerId={currentUserId} minimize={isSidebarMinimized} />;
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
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarMinimized(true); // Minimize sidebar on small screens
      } else {
        setIsSidebarMinimized(false); // Expand sidebar on larger screens
      }
    };

    // Check screen size on initial load
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="general-sidebar flex h-screen text-white">
      {/* Sidebar */}
      <div
        className={` ${isSidebarMinimized ? "w-20" : "w-64"} 
        h-full p-2 flex flex-col transition-all duration-300 ease-in-out 
        ${!isSidebarMinimized ? "bg-gray-200" : "bg-gray-800"}`}
        sidebar
      >
        {/* Sidebar Toggle Button */}
        <div className="flex justify-end ">
          <HiMenu
            className={`text-xl cursor-pointer mb-2 ${
              isSidebarMinimized ? "text-white" : "text-gray-900"
            }`}
            // className="text-gray-900 text-xl cursor-pointer mb-2"
            onClick={() => setIsSidebarMinimized(!isSidebarMinimized)} // Toggle sidebar state
          />
        </div>

        {/* User Avatar and Info */}
        <div
          className={`flex flex-col items-center mb-4 transition-all duration-300 ${
            isSidebarMinimized ? "hidden" : "block"
          }`}
        >
          <Avatar
            img={user.image}
            size="xl"
            rounded={true}
            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setActiveComponent("profile")}
          />
          <span className="admin-name text-black ">
            {user.first_name} {user.last_name}
          </span>
          <span className="admin-email">{user.email}</span>
        </div>

        {/* Sidebar Navigation (board) */}
        <div
          className={` flex flex-col space-y-2 flex-grow transition-all duration-300 bg-gray-500 rounded-sm ${
            isSidebarMinimized ? "w-20" : "w-64"
          }board `}
        >
          <div
            className={`relative group flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-600 hover:text-white transition-colors ${
              activeComponent === "dashboard"
                ? "bg-gray-600 text-white"
                : "text-white"
            }`}
            onClick={() => setActiveComponent("dashboard")}
          >
            <HiChartPie
              className={`mr-3 ${
                isSidebarMinimized ? "text-2xl ml-3 " : "text-xl"
              }`}
              //  className="mr-3 text-xl"
            />

            {/* Display name when sidebar is not minimized */}
            {!isSidebarMinimized && <span>Dashboard</span>}

            {/* Tooltip when sidebar is minimized */}
            {isSidebarMinimized && (
              <span className="absolute left-full ml-4 px-2 py-1 rounded bg-gray-700 text-white text-sm tooltip group-hover:opacity-100">
                Dashboard
              </span>
            )}
          </div>
          <div
            className={`relative group flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-600 hover:text-white transition-colors ${
              activeComponent === "profile"
                ? "bg-gray-600 text-white"
                : "text-white"
            }`}
            onClick={() => setActiveComponent("profile")}
          >
            <HiUser
              className={`mr-3 ${
                isSidebarMinimized ? "text-2xl ml-3" : "text-xl"
              } `}
            />

            {/* Display name when sidebar is not minimized */}
            {!isSidebarMinimized && <span>Profile</span>}

            {/* Tooltip when sidebar is minimized */}
            {isSidebarMinimized && (
              <span className="absolute left-full ml-4 px-2 py-1 rounded bg-gray-700 text-white text-sm tooltip group-hover:opacity-100">
                Profile
              </span>
            )}
          </div>

          <div
            className={`relative group flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-600 hover:text-white transition-colors ${
              activeComponent === "chat"
                ? "bg-gray-600 text-white"
                : "text-white"
            }`}
            onClick={() => setActiveComponent("chat")}
          >
            <HiInbox
              className={`mr-3 ${
                isSidebarMinimized ? "text-2xl ml-3 " : "text-xl"
              } `}
            />

            {/* Display name when sidebar is not minimized */}
            {!isSidebarMinimized && <span>Inbox</span>}

            {/* Tooltip when sidebar is minimized */}
            {isSidebarMinimized && (
              <span className="absolute left-full ml-4 px-2 py-1 rounded bg-gray-700 text-white text-sm tooltip group-hover:opacity-100">
                Inbox
              </span>
            )}
          </div>

          <div
            className={`relative group flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-600 hover:text-white transition-colors ${
              activeComponent === "blocked"
                ? "bg-gray-600 text-white"
                : "text-white"
            }`}
            onClick={() => setActiveComponent("blocked")}
          >
            <HiShoppingBag
              className={`mr-3 ${
                isSidebarMinimized ? "text-2xl ml-3" : "text-xl"
              }`}
            />

            {/* Display name when sidebar is not minimized */}
            {!isSidebarMinimized && <span>Blocked</span>}

            {/* Tooltip when sidebar is minimized */}
            {isSidebarMinimized && (
              <span className="absolute left-full ml-4 px-2 py-1 rounded bg-gray-700 text-white text-sm tooltip group-hover:opacity-100">
                Blocked
              </span>
            )}
          </div>

          <div
            className="flex items-center p-2 rounded-sm cursor-pointer hover:bg-red-800 hover:text-white text-white transition-colors bg-red-600"
            onClick={handleLogout}
          >
            <HiArrowSmLeft
              className={`mr-3 ${
                isSidebarMinimized ? "text-3xl ml-2 " : "text-2xl"
              }`}
            />
            {/* Display name when sidebar is not minimized */}
            {!isSidebarMinimized && <span>Logout</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 overflow-auto">
        {renderComponent()}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default AdminMain;
