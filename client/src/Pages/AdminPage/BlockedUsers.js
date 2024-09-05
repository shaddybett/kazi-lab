import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function BlockedUsers() {
  const [blocked, setBlocked] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleBlockedUsers = async () => {
    try {
      const response = await fetch(`${backendUrl}/fetch_blocked`, {
        method: "GET",
      });
      if (response.ok) {
        const responseData = await response.json();
        setBlocked(responseData.users);
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.error);
      }
    } catch (error) {
      setError("An error occurred, please try again later");
    }
  };

  const handleClick = (bUser) => {
    setClicked(true);
    handleBlockedProviderClick(bUser);
  };

  const handleBlockedProviderClick = async (bUser) => {
    if (bUser) {
      Swal.fire({
        title: "Blocked User",
        text: `Reason: ${bUser.reason}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Unblock User",
      }).then((result) => {
        if (result.isConfirmed) {
          handleUnblock(bUser);
        }
      });
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
        handleBlockedUsers(); // Refresh the list
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
    handleBlockedUsers(); // Fetch blocked users when the component mounts
  }, []);

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
      {blocked.length > 0 ? (
        blocked.map((bUser) => (
          <div key={bUser.id} onClick={() => handleClick(bUser)}>
            {bUser.first_name} {bUser.last_name} - {bUser.reason}
          </div>
        ))
      ) : (
        <p className="text-red-600" >No blocked users to display</p>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default BlockedUsers;
