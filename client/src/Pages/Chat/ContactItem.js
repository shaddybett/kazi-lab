import React,{useState} from "react";
import { Avatar } from "flowbite-react";

const ContactItem = ({ contact, setActiveUser, receiver }) => {
  const [activeOne, setActiveOne] = useState(null);
  return (
    <>
      {contact !== "" ? (
        <div
        className={`flex items-center p-2 rounded-sm cursor-pointer hover:bg-gray-500 hover:text-white transition-colors ${
          activeOne === contact ? "bg-red-600 text-white" : "text-white"
        }`} 
          onClick={() => setActiveUser(contact)}
        >
          <Avatar
            img={contact.image }
            rounded
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
