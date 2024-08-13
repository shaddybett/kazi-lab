import React, { useEffect, useState } from "react";
import { Card, Dropdown } from "flowbite-react";

function ProviderUpdates({ senderId, assigned, likes }) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [providerIds, setProviderIds] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [chatUser,setChatUser] = useState(null)

  const fetchAssignedIds = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/assigned_resource/${senderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProviderIds(data.provider_ids);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching assigned IDs:", error);
    }
  };

  const fetchCustomerDetails = async () => {
    if (providerIds.length === 0) return;

    try {
      const response = await fetch(
        `${backendUrl}/recent_clients/${providerIds.join(",")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCustomerDetails(data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  useEffect(() => {
    fetchAssignedIds();
  }, [senderId]);

  useEffect(() => {
    fetchCustomerDetails();
  }, [providerIds]);

  return (
    <div>
      <Card>
        <h4 className="text-white">Recent Customers</h4>
        {customerDetails.map((customer, index) => (
          <div key={index} className="flex items-center justify-between mb-2">
            <p>
              {customer.first_name} {customer.last_name}
            </p>
            <Dropdown inline label="Options">
              <Dropdown.Item>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Chat
                </a>
              </Dropdown.Item>
            </Dropdown>
          </div>
        ))}
        <strong className="text-green-700 ml-4">
          Jobs Assigned {assigned}
        </strong>
        <strong className="text-green-700 ml-4">Likes given {likes}</strong>
      </Card>
    </div>
  );
}

export default ProviderUpdates;
