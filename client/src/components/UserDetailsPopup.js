import React from "react";
import { Card, Avatar } from "flowbite-react";

function UserDetailsPopup({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-4xl mt-20">
        <Card className="max-w-l">
          <div className="flex items-center gap-5 mt-10 ml-5">
            <Avatar className="mb-10" img={user.image} size="xl" />
            <div>
              <p className="mb-3" >
                <strong>Name:</strong> {user.first_name} {user.middle_name} {user.last_name}
              </p>
              <p className="mb-3">
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {user.phone_number}
              </p>
              <button className="mt-10 ml-10" onClick={onClose}>Close</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default UserDetailsPopup;
