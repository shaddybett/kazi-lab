import React, { useEffect, useRef } from "react";
import { Avatar } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";

function UserDetailsPopup({ user, onClose }) {
  const popupRef = useRef();

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={popupRef}
        className="bg-white rounded-lg p-6 w-full max-w-xs md:max-w-sm mx-4 md:mx-0"
      >
        <div className="flex flex-col items-center gap-2 mt-10">
          <Avatar className="mb-10" img={user.image} size="xl" />
          <div className="text-center md:text-left">
            <p className="mb-3">
              <strong>Name:</strong> {user.first_name} {user.middle_name}{" "}
              {user.last_name}
            </p>
            <div className="flex items-center mb-3">
              <strong>Email:</strong>
              <span className="ml-2">{user.email}</span>
              <a href={`mailto:${user.email}`} className="ml-2 text-blue-500">
                <FontAwesomeIcon icon={faEnvelope} className="ml-1" />
              </a>
            </div>
            <div className="flex items-center">
              <strong>Phone Number:</strong>
              <span className="ml-2">{user.phone_number}</span>
              <a
                href={`tel:${user.phone_number}`}
                className="ml-4 text-blue-500"
              >
                <FontAwesomeIcon icon={faPhone} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsPopup;
