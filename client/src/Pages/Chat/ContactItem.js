import React from "react";

const ContactItem = ({ contact, setActiveUser, receiver }) => {
  return (
    <>
      {contact !== "" ? (
        <div
          className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => setActiveUser(contact)}
        >
          <img
            src={contact.image }
            alt={contact.name}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <p className="text-white">{contact.name}</p>
            <p className="text-gray-400 text-sm">{contact.message}</p>
          </div>
        </div>
      ) : (
        <div>
          {receiver.first_name} {receiver.last_name}
        </div>
      )}
    </>
  );
};

export default ContactItem;
