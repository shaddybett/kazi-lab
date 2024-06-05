import React from 'react';

function UserDetailsPopup({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>User Details</h2>
        <p><strong>First Name:</strong> {user.first_name}</p>
        <p><strong>Last Name:</strong> {user.last_name}</p>
        <p><strong>Middle Name:</strong> {user.middle_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role ID:</strong> {user.role_id}</p>
        <p><strong>Phone Number:</strong> {user.phone_number}</p>
        <p><strong>National ID:</strong> {user.national_id}</p>
        <p><strong>Image:</strong> {user.image}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default UserDetailsPopup;
