import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import "./AdminPage.css";

function AdminPage() {
  const [providers, setProviders] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
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

        if (responseData.role_id === 2) {
          return "service provider";
        } else if (responseData.role_id === 3) {
          return "client";
        }
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
  useEffect(() => {
    handleUsers();
  }, []); // added a useeffect to make the page load on first render that is you must not necessarily click a button to run `handleUsers`
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
              {/* <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>ID Number</Table.HeadCell> */}
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
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 text-black">
                    {user.first_name} {user.last_name}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  {/* <Table.Cell>{user.role_id}</Table.Cell>
                <Table.Cell>{user.id}</Table.Cell> */}
                  <Table.Cell>
                    <a
                      href="#"
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Edit
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="table-2" >
          <h2 className="table-2-title" >Clients</h2>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              {/* <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>ID Number</Table.HeadCell> */}
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {clients.map((user, index) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {user.first_name} {user.last_name}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  {/* <Table.Cell>{user.role_id}</Table.Cell>
                <Table.Cell>{user.id}</Table.Cell> */}
                  <Table.Cell>
                    <a
                      href="#"
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Edit
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
