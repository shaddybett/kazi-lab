// import React, { useEffect, useRef } from "react";
// import { Card, Avatar } from "flowbite-react";

// function UserDetailsPopup({ user, onClose }) {
//   const popupRef = useRef();

//   const handleClickOutside = (event) => {
//     if (popupRef.current && !popupRef.current.contains(event.target)) {
//       onClose();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   if (!user) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div ref={popupRef} className="bg-white rounded-lg p-6">
//         <Card className="max-w-lg">
//           <div className="flex items-center gap-5 mt-10 ml-5">
//             <Avatar className="mb-10" img={user.image} size="xl" />
//             <div>
//               <p className="mb-3">
//                 <strong>Name:</strong> {user.first_name} {user.middle_name} {user.last_name}
//               </p>
//               <p className="mb-3">
//                 <strong>Email:</strong> {user.email}
//               </p>
//               <p>
//                 <strong>Phone Number:</strong> {user.phone_number}
//               </p>
//               <button className="mt-10 ml-10" onClick={onClose}>Close</button>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default UserDetailsPopup;




import React, { useEffect, useRef } from "react";
import { Card, Avatar } from "flowbite-react";

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
                <strong>Name:</strong> {user.first_name} {user.middle_name} {user.last_name}
              </p>
              <p className="mb-3">
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {user.phone_number}
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}

export default UserDetailsPopup;
