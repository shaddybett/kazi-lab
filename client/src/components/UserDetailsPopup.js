import React from "react";
import { Card, Avatar } from "flowbite-react";

function UserDetailsPopup({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="popup">
      <Card className="max-w-sm ml-10">
        <div className="popup-content">
          <h2>User Details</h2>
          <p>
            <Avatar img={user.image} size="xl" />
          </p>
          <p>
            <strong>First Name:</strong> {user.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {user.last_name}
          </p>
          <p>
            <strong>Middle Name:</strong> {user.middle_name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role ID:</strong> {user.role_id}
          </p>
          <p>
            <strong>Phone Number:</strong> {user.phone_number}
          </p>
          <p>
            <strong>National ID:</strong> {user.national_id}
          </p>
          <button onClick={onClose}>Close</button>
        </div>
      </Card>
    </div>
  );
}

export default UserDetailsPopup;
