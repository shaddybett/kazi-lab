import React, { useState, useEffect, useCallback, useRef } from "react";
import { Table, Dropdown } from "flowbite-react";
import "./AdminPage.css";
import AdminUsersPopup from "./AdminUsersPopup";
import ChatBox from "../Chatbox/ChatBox";
import ServiceProviderChatBox from "../Chatbox/ServiceProviderChatbox";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { HiDotsHorizontal } from "react-icons/hi";
import NewChatBox from "../Chat/NewChatBox";

function AdminPage({ minimize }) {
  const [providers, setProviders] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [message, setMessage] = useState([]);
  const [chaty, setChaty] = useState(null);
  const popupRef = useRef(null);

  const currentUserId = localStorage.getItem("id");
  const navigate = useNavigate();

  const handleUsers = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${backendUrl}/all_users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const fetchedProviders = responseData.filter(
          (user) => user.role_id === 2
        );
        const fetchedClients = responseData.filter(
          (user) => user.role_id === 3
        );
        setProviders(fetchedProviders);
        setClients(fetchedClients);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  }, [backendUrl]);

  useEffect(() => {
    handleUsers();
  }, [handleUsers]);

  const handleProviderClick = async (user) => {
    if (user.is_blocked) {
      Swal.fire({
        title: "Blocked User",
        text: `Reason: ${user.block_reason}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Unblock User",
      }).then((result) => {
        if (result.isConfirmed) {
          handleUnblock(user);
        }
      });
    } else {
      try {
        const response = await fetch(
          `${backendUrl}/user-details?email=${user.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const userDetails = await response.json();
          setSelectedUser(userDetails);
        } else {
          throw new Error("Failed to load user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  const handleChatClick = (user) => {
    setChatUser(user);
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  const closeChat = () => {
    setChatUser(null);
  };

  useEffect(() => {
    handleUsers();
  }, [backendUrl, handleUsers]);

  const handleChat = () => {
    setChaty(currentUserId);
  };

  const closeChatty = () => {
    setChaty(null);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setChaty(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const handleBlock = async (user) => {
    const { value: blockDetails } = await Swal.fire({
      title: "Are you sure you want to block this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Block User!",
      input: "text",
      inputLabel: "Reason for blocking",
      inputPlaceholder: "Enter the reason for blocking this user...",
    });

    if (blockDetails) {
      const data = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_id: user.id,
        reason: blockDetails,
      };

      try {
        const response = await fetch(`${backendUrl}/block_user`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          Swal.fire("Success", "User has been blocked", "success");
          handleUsers();
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error);
        }
      } catch (error) {
        console.error("Error blocking user:", error);
        setError("An unexpected error occurred");
      }
    }
  };
  const handleUnblock = async (user) => {
    try {
      const response = await fetch(`${backendUrl}/unblock_user`, {
        method: "POST",
        body: JSON.stringify({ user_id: user.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        Swal.fire("Success", "User has been unblocked", "success");
        handleUsers();
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      setError("An unexpected error occurred");
    }
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>
      <h3 className="title">All users</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
      <div className="table ">
        <div className="table-1 ">
          <h3 className="table-1-title">Service Providers</h3>
          <Table>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {providers.map((user, index) => (
                <Table.Row
                  key={index}
                  className={`table-row ${
                    user.is_blocked ? "blocked-row" : "hover:bg-gray-200"
                  }`}
                >
                  <Table.Cell data-label="Name">
                    {user.first_name} {user.last_name}
                  </Table.Cell>
                  <Table.Cell data-label="Email">{user.email}</Table.Cell>
                  <Table.Cell data-label="Actions">
                    <Dropdown
                      arrowIcon={false}
                      inline
                      label={<HiDotsHorizontal />}
                    >
                      {!user.is_blocked && (
                        <Dropdown.Item onClick={() => handleChatClick(user)}>
                          Chat
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item onClick={() => handleProviderClick(user)}>
                        Details
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      {user.is_blocked ? (
                        <Dropdown.Item
                          className="text-green-500"
                          onClick={() => handleUnblock(user)}
                        >
                          Unblock
                        </Dropdown.Item>
                      ) : (
                        <Dropdown.Item
                          className="text-red-500"
                          onClick={() => handleBlock(user)}
                        >
                          Block
                        </Dropdown.Item>
                      )}
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="table-1 ">
          <h3 className="table-1-title ">Clients</h3>
          <Table>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {clients.map((user, index) => (
                <Table.Row
                  key={index}
                  className={`dark:border-gray-700 dark:bg-gray-800 table-row ${
                    user.is_blocked
                      ? "bg-red-400 blocked-row"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <Table.Cell>
                    {user.first_name} {user.last_name}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      arrowIcon={false}
                      inline
                      label={<HiDotsHorizontal />}
                    >
                      {!user.is_blocked && (
                        <Dropdown.Item onClick={() => handleChatClick(user)}>
                          Chat
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item onClick={() => handleProviderClick(user)}>
                        Details
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      {user.is_blocked ? (
                        <Dropdown.Item
                          className="text-green-500"
                          onClick={() => handleUnblock(user)}
                        >
                          Unblock
                        </Dropdown.Item>
                      ) : (
                        <Dropdown.Item
                          className="text-red-500"
                          onClick={() => handleBlock(user)}
                        >
                          Block
                        </Dropdown.Item>
                      )}
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      {selectedUser && (
        <AdminUsersPopup
          minimize={minimize}
          user={selectedUser}
          onClose={closePopup}
        />
      )}
      {chatUser && (
        <NewChatBox
          senderId={currentUserId}
          receiver={chatUser}
          onClose={closeChat}
        />
      )}
      {chaty && (
        <div ref={popupRef}>
          <ServiceProviderChatBox
            providerId={currentUserId}
            onClose={closeChatty}
          />
        </div>
      )}
    </div>
  );
}

export default AdminPage;

// /* Ensure the container does not exceed the viewport width */
// body {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
//   font-family: 'Inter', sans-serif;
//   background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
// }
// .table {
//   width: 100%;
//   max-width: 100%; /* Ensure tables don't exceed viewport width */
//   overflow-x: auto; /* Enable horizontal scrolling if necessary */
//   padding: 10px;
// }

// .table-1, .table-2 {
//   width: 100%;
//   max-width: 600px; /* Set a max-width for better centering */
//   margin: 0 auto 20px; /* Center the tables horizontally */
//   box-sizing: border-box;
// }

// /* Table Title Styling */
// .table-1-title, .table-2-title {
//   font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
//   font-weight: 500;
//   font-size: 1.5rem;
//   text-align: center;
//   margin-bottom: 10px;
// }

// /* Table Styling */
// table {
//   width: 100%;
//   border-collapse: collapse; /* No extra spacing between cells */
//   table-layout: fixed; /* Fix column widths based on header */
// }

// /* Header Styling */
// th, td {
//   padding: 12px;
//   text-align: left;
//   border-bottom: 1px solid #ddd;
// }

// /* Adjust header widths to ensure alignment */
// th:nth-child(1), td:nth-child(1) {
//   width: 40%; /* Adjust width for the Name column */
// }

// th:nth-child(2), td:nth-child(2) {
//   width: 40%; /* Adjust width for the Email column */
// }

// th:nth-child(3), td:nth-child(3) {
//   width: 20%; /* Adjust width for the Edit column */
// }

// /* Ensure table rows align properly */
// .table-row {
//   text-align: left; /* Ensure all content is left-aligned */
//   background-color: #cdd6d5;
// }

// @media (min-width: 768px) {
//   .table-row {
//     text-align: left; /* For large screens, ensure left alignment */
//     background-color: #cdd6d5;

//   }
// }

// /* Hover effect for table rows */
// /* General hover effect for unblocked rows */
// .table-row:hover {
//   background-color: #b5b8bb; /* Gray hover background for unblocked rows */
// }
// .blocked-row{
//   background-color: #f05050;
// }

// /* Disable hover effect for blocked rows */
// .blocked-row:hover {
//   background-color: #f87171 !important; /* Red background persists on hover */
// }

// /* Navbar styling */
// .navbar {
//   padding: 10px 20px;
// }
// .avatar {
//   width: 100px;
//   height: 100px;
//   border-radius: 50%;
//   margin: 20px auto; /* Center avatar */
// }

// /* Avatar styling */
// .admipic {
//   width: 100px;
//   height: 100px;
//   object-fit: cover;
//   border-radius: 50%;
//   margin-bottom: 10px; /* Add spacing under the avatar */
// }
// .avat{
//   width: 100px;
//   height: 100px;
//   /* object-fit: cover; */
//   border-radius: 50%;
//   margin-bottom: 10px;
//   background-color: #3776aa;

// }
// @media (max-width: 768px) {
//   /* Sidebar minimized automatically on small screens */
//   .Sidebar {
//     width: 80px;
//     min-width: 80px;
//   }
// }

// /* Sidebar */
// .general-sidebar {
//   /* margin-left: 250px;  */
//   /* padding: 20px; */
//   transition: margin-left 0.3s ease;
//   background-color: rgb(22, 47, 85);
// }
// .general-sidebar.expanded {
//   margin-left: 250px;
// }
// .title {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 1.8rem;
//   font-weight: 500;
//   font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
// }
// .email{
//   color: antiquewhite;
// }
// .email-i{
//   color: rgb(55, 68, 80);
// }

// .media-gallery{
//   background-color: aqua;
// }
// .admin-grid-container {
//   display: flex;
//   grid-template-columns: no-repeat(2, 1fr);
//   gap: 40px;
// }
// .admin-grid-item-container {
//   position: relative;
// }

// .admin-grid-item {
//   width: 300px;
//   height: 100%;
//   cursor: pointer;
//   border-radius: 10px;
//   margin-bottom: 20px;
// }
// .delete-button {
//   position: absolute;
//   top: 5px;
//   right: 5px;
//   background-color: rgba(255, 255, 255, 0.7);
//   border: none;
//   cursor: pointer;
//   padding: 5px;
//   border-radius: 50%;
// }
// /* Center modal and make it responsive */
// .modal-content {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   max-height: 90vh; /* Adjust for viewport height */
//   max-width: 90vw;  /* Adjust for viewport width */
//   overflow: auto;
// }

// .modal-image {
//   max-width: 100%;
//   max-height: 100%;
//   object-fit: contain; /* Maintain aspect ratio */
// }

// .modal-video-container {
//   max-width: 100%;
//   max-height: 100%;
// }

// .modal-video {
//   width: 100%;
//   height: auto;
// }

// /* Flex grid for media */
// .admin-grid-container, .admin-grid-containers {
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 20px;
//   margin-top: 10px;
// }

// .admin-grid-item {
//   width: 300px;
//   height: 100%;
//   cursor: pointer;
//   border-radius: 10px;
//   transition: transform 0.3s ease-in-out;
// }
// .admin-grid-items{
//   width: 100%;
//   height: 100%;
//   cursor: pointer;
//   border-radius: 10px;
//   transition: transform 0.3s ease-in-out;
// }

// .admin-grid-item:hover, .admin-grid-items:hover {
//   transform: scale(1.05); /* Slight zoom on hover */
// }

// /* Overlay customization */
// .overlay {
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.75);
//   z-index: 9999;
// }

// /* Ensure modal scales properly */
// .modal {
//   position: fixed;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   width: auto;
//   max-width: 90vw;
//   max-height: 90vh;
//   overflow: hidden;
//   padding: 0;
//   background: transparent;
//   border-radius: 10px;
// }

// /* Default user-details container */
// .user-detail {
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-start;
//   padding: 20px;
//   background-color: #f9f9f9; /* Light background for the details section */
//   border-radius: 10px;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
//   margin-top: 20px;
//   gap: 160px;
// }
// .mini-user-detail {
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-start;
//   padding: 20px;
//   background-color: #f9f9f9; /* Light background for the details section */
//   border-radius: 10px;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
//   margin-top: 20px;
//   gap: 20px;
// }

// /* Center the profile image and email if optional fields are missing */
// .user-details.centered {
//   justify-content: center;
//   flex-direction: column;
//   align-items: center;
// }

// .details-1 {
//   text-align: center;
//   /* margin-right: 80px; */
// }

// .details-1-name {
//   margin-top: 10px;
//   font-family: 'Arial', sans-serif;
//   font-weight: 600;
// }

// .details-1-email {
//   color: #494646;
//   font-size: 0.9rem;
// }
// .image-dt {
//   border-radius: 50%;
//   width: 100px;
//   height: 100px;
//   object-fit: cover;
//   background-color: #93a3b1;
// }

// /* Detail items for additional information */
// .details-2-dt {
//   display: flex;
//   flex-direction: column;
//   gap: 15px;
// }

// .detail-item {
//   font-size: 1rem;
//   color: #333;
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   background: white;
//   padding: 10px;
//   border-radius: 8px;
//   transition: background-color 0.3s ease-in-out;
// }

// .detail-item i {
//   color: #3776aa;
//   font-size: 1.2rem;
// }

// .detail-item strong {
//   font-weight: 600;
// }

// /* Hover effect on detail items */
// .detail-item:hover {
//   background-color: #f0f0f0;
// }

// /* Icon library styling */
// @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");

// .image-section-heading {
//   font-size: 1.5rem; /* Increase font size for emphasis */
//   font-weight: 600; /* Make it bold */
//   color: #3776aa; /* A nice blue color for the heading */
//   display: flex;
//   align-items: center; /* Align icon and text */
//   gap: 10px; /* Space between the icon and text */
//   padding-bottom: 10px; /* Space between heading and content below */
//   position: relative; /* For the underline effect */
//   margin-top: 30px;
//   background: linear-gradient(90deg, rgba(55, 118, 170, 0.15), rgba(55, 118, 170, 0)); /* Light gradient */
//   padding: 15px; /* Padding to make the heading block more visible */
//   border-radius: 8px; /* Rounded corners */
// }

// .image-section-heading i {
//   color: #3776aa; /* Icon color */
//   font-size: 1.5rem; /* Increase icon size */
// }

// .image-section-heading::after {
//   content: "";
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   width: 50px; /* Length of the underline */
//   height: 4px; /* Thickness of the underline */
//   background-color: #3776aa; /* Blue underline */
//   border-radius: 4px; /* Slightly rounded ends */
//   transition: width 0.3s ease; /* Smooth underline animation */
// }

// .image-section-heading:hover::after {
//   width: 100%; /* Expand underline on hover */
// }
// .admin-video-heading {
//   font-size: 1.5rem; /* Similar to photos heading */
//   font-weight: 600; /* Bold */
//   color: #37aa6f; /* Softer green for better readability */
//   display: flex;
//   align-items: center; /* Align icon and text */
//   gap: 10px; /* Space between icon and text */
//   padding-bottom: 10px;
//   position: relative; /* For the underline effect */
//   margin-top: 30px;
//   background: linear-gradient(90deg, rgba(22, 95, 57, 0.15), rgba(4, 99, 50, 0)); /* Softer green gradient */
//   padding: 15px;
//   border-radius: 8px;
//   box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.05); /* Subtle shadow for depth */
// }

// .admin-video-heading i {
//   color: #32a852; /* Slightly darker green for the icon */
//   font-size: 1.5rem;
// }

// .admin-video-heading::after {
//   content: "";
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   width: 50px; /* Length of the underline */
//   height: 4px;
//   background-color: #32a852; /* Green underline, matching icon */
//   border-radius: 4px;
//   transition: width 0.3s ease; /* Smooth hover */
// }

// .admin-video-heading:hover::after {
//   width: 100%; /* Expand underline on hover */
// }

// .admin-video-heading:hover {
//   background: linear-gradient(90deg, rgba(55, 170, 111, 0.25), rgba(55, 170, 111, 0.05)); /* Slightly more prominent background on hover */
// }

// .modal-header {
//   font-size: 1.75rem; /* Slightly bigger for prominence */
//   font-weight: 700; /* Bold for emphasis */
//   color: #333; /* Dark color for strong contrast */
//   display: flex;
//   align-items: center; /* Align icon and text */
//   gap: 10px; /* Space between icon and text */
//   padding: 15px 20px; /* Padding for better spacing */
//   background-color: #f0f0f0; /* Light gray background to make it stand out */
//   border-bottom: 3px solid #3776aa; /* Blue underline */
//   border-radius: 8px 8px 0 0; /* Round the top corners */
// }

// .modal-header i {
//   color: #3776aa; /* Blue user icon */
//   font-size: 2rem; /* Bigger icon for emphasis */
// }
// .Sidebar {
//   background-color: #ccd4d6;
//   width: 250px;
//   min-width: 250px;
//   height: 100vh;
//   position: fixed; /* Keep sidebar fixed */
//   left: 0;
//   top: 0;
//   overflow: hidden; /* Hide overflow content */
//   transition: width 0.3s ease-in-out;
// }
// .Sidebar.minimized {
//   width: 80px;
//   min-width: 80px;
// }
// .sidebar-toggle {
//   position: absolute;
//   top: 10px;
//   right: -25px;
//   background-color: rgb(55, 68, 80);
//   padding: 5px;
//   border-radius: 50%;
//   cursor: pointer;
// }
// .admin-name {
//   text-align: center;
//   font-weight: 500;
//   font-size: 1rem;
// }

// .admin-email {
//   text-align: center;
//   font-size: 0.9rem;
//   color: #494646;
// }
// .Sidebar .board {
//   background-color: #7c93a5;
//   border-radius: 5px;
//   width: 100%;
//   padding: 10px;
//   margin-top: 10px;
//   transition: background-color 0.3s ease-in-out;
// }
// .Sidebar .board:hover {
//   background-color: #5b7c99;
// }
// .board-item {
//   padding: 10px;
//   font-size: 16px;
//   color: #fff;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   transition: background-color 0.3s ease-in-out;
// }
// .board-item:hover {
//   background-color: #566e8a;
// }
// .tooltip {
//   opacity: 0;
//   position: absolute;
//   left: 100%;
//   margin-left: 10px;
//   background-color: #333;
//   color: #fff;
//   padding: 5px;
//   border-radius: 4px;
//   transition: opacity 0.3s ease;
// }
// .board-item:hover .tooltip {
//   opacity: 1;
// }

// .tooltip-container:hover .tooltip {
//   opacity: 1; /* Visible when hovering */
// }
// video {
//   width: 100%;
//   height: auto;
//   object-fit: contain;
// }

// video:fullscreen {
//   width: 100vw;
//   height: 100vh;
//   object-fit: cover;
//   background-color: black;
// }
// video:-webkit-full-screen {
//   width: 100%;
//   height: auto;
// }

// video:-moz-full-screen {
//   width: 100%;
//   height: auto;
// }

// video:fullscreen {
//   width: 100%;
//   height: auto;
// }
