// BlockedUsersContext.js
import React, { createContext, useState, useCallback } from "react";
import Swal from "sweetalert2";

// Create a Context
const BlockedUsersContext = createContext();

// Create a Provider component
export const BlockedUsersProvider = ({ children }) => {
  const [blocked, setBlocked] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch blocked users
  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch(`${backendUrl}/fetch_blocked`, {
        method: "GET",
      });
      if (response.ok) {
        const responseData = await response.json();
        setBlocked(responseData.users);
      } else {
        const errorResponse = await response.json();
        Swal.fire("Error", errorResponse.error, "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred, please try again later", "error");
    }
  };

  // Handle blocking a user
  const blockUser = async (user) => {
    const { value: blockReason } = await Swal.fire({
      title: "Block User",
      input: "text",
      inputLabel: "Reason for blocking",
      inputPlaceholder: "Enter reason...",
      showCancelButton: true,
      confirmButtonText: "Block",
    });

    if (blockReason) {
      try {
        const data = {
          user_id: user.id,
          reason: blockReason,
        };

        const response = await fetch(`${backendUrl}/block_user`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          Swal.fire("Success", "User has been blocked", "success");
          fetchBlockedUsers(); // Refresh blocked users list
        } else {
          const errorMessage = await response.json();
          Swal.fire("Error", errorMessage.error, "error");
        }
      } catch (error) {
        Swal.fire("Error", "An unexpected error occurred", "error");
      }
    }
  };

  // Handle unblocking a user
  const unblockUser = async (user) => {
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
        fetchBlockedUsers(); // Refresh blocked users list
      } else {
        const errorMessage = await response.json();
        Swal.fire("Error", errorMessage.error, "error");
      }
    } catch (error) {
      Swal.fire("Error", "An unexpected error occurred", "error");
    }
  };

  // Close blocked users list
  const handleBlockedClose = () => {
    setBlocked([]);
  };

  const handleBlockedProviderClick = useCallback((bUser) => {
    if (bUser) {
      Swal.fire({
        title: "Blocked User",
        text: `Reason: ${bUser.reason}`,
        icon: "info",
        confirmButtonText: "Close",
      });
    }
  }, []);

  return (
    <BlockedUsersContext.Provider
      value={{
        blocked,
        fetchBlockedUsers,
        blockUser,
        unblockUser,
        onClose: handleBlockedClose,
        click: handleBlockedProviderClick,
      }}
    >
      {children}
    </BlockedUsersContext.Provider>
  );
};

export default BlockedUsersContext;
