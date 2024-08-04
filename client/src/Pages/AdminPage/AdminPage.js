import React, { useState, useEffect } from "react";
import { Table, Dropdown, TableCell } from "flowbite-react";
import "./AdminPage.css";
import AdminUsersPopup from "./AdminUsersPopup";
import ChatBox from "../Chatbox/ChatBox";

function AdminPage() {
  const [providers, setProviders] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUser, setChatUser] = useState(null); // For chat
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const currentUserId = localStorage.getItem("id")
  const handleUsers = async () => {
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
  };

  const handleProviderClick = async (user) => {
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
  }, []);

  return (
    <div>
      <h3 className="title">All users</h3>
      {error && <p>{error}</p>}
      <div className="table">
        <div className="table-1">
          <h3 className="table-1-title">Service Providers</h3>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>User id</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {providers.map((user, index) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <div onClick={() => handleProviderClick(user)}>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 text-black">
                      {user.first_name} {user.last_name}
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                  </div>
                  <TableCell>
                    <Dropdown arrowIcon={false} inline label="Edit">
                      <Dropdown.Item onClick={() => handleChatClick(user)}>Chat</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item className="text-red-500">
                        Block
                      </Dropdown.Item>
                    </Dropdown>
                  </TableCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="table-2">
          <h2 className="table-2-title">Clients</h2>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>User id</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {clients.map((user, index) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <div onClick={() => handleProviderClick(user)}>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {user.first_name} {user.last_name}
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.id}</Table.Cell>
                  </div>
                  <Table.Cell>
                    <Dropdown arrowIcon={false} inline label="Edit">
                      <Dropdown.Item onClick={() => handleChatClick(user)}>Chat</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item className="text-red-500">Block</Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      {selectedUser && (
        <AdminUsersPopup user={selectedUser} onClose={closePopup} />
      )}
      {chatUser && (
        <ChatBox senderId={currentUserId} receiver={chatUser} onClose={closeChat} />
      )}
    </div>
  );
}

export default AdminPage;
