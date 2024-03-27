import React from "react";
import { useEffect, useState } from "react";

function ClientDashboard() {
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const handleEntry = async () => {
      const token = localStorage.getItem("token");
      try {
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await fetch("/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData);
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred.Please try again later!");
      }
    };
    handleEntry();
  }, []);
  return (
    <div >
      {data && (
        <p>
          Hello {data.first_name} {data.last_name}, welcome
        </p>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default ClientDashboard;
