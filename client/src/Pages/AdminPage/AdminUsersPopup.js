// import React, { useState } from "react";
// import { Card, Modal, Button } from "flowbite-react";
// import './AdminPage.css'

// function AdminUsersPopup({ user, onClose }) {
//   const [selectedMedia, setSelectedMedia] = useState(null);
//   const [mediaType, setMediaType] = useState(null);
//   const [isVideoLoading, setIsVideoLoading] = useState(false);

//   const openModal = (media, type) => {
//     setSelectedMedia(media);
//     setMediaType(type);
//     if (type === "video") {
//       setIsVideoLoading(true);
//     }
//   };

//   const closeModal = () => {
//     setSelectedMedia(null);
//     setMediaType(null);
//     setIsVideoLoading(false);
//   };

//   if (!user) return null;

//   return (
//     <div className="admin-user-popup">
//       <Modal show={true} onClose={onClose}>
//         <Modal.Header>{`${user.first_name} ${user.last_name}`}</Modal.Header>
//         <Modal.Body>
//             <div className="flex flex-col items-center">
//               <img
//                 src={user.image}
//                 alt={`${user.first_name} ${user.last_name}`}
//                 className="image mb-4"
//               />
//               <h3 className="text-xl font-semibold">{`${user.first_name} ${user.last_name}`}</h3>
//               <p className="text-black" >{user.email}</p>
//               <p className="text-black">Phone Number: {user.phone_number}</p>
//               <p className="text-black">National ID: {user.national_id}</p>
//               <p className="text-black">Likes: {user.likes || 0}</p>
//               <p className="text-black">Jobs: {user.jobs || 0}</p>
//               <div className="media-gallery">
//                 <h4 className="text-lg font-semibold">Photos</h4>
//                 <div className="photos">
//                   {user.photos.map((photo, index) => (
//                     <img
//                       key={index}
//                       src={photo}
//                       alt={`Photo ${index}`}
//                       className="photo"
//                       onClick={() => openModal(photo, "photo")}
//                     />
//                   ))}
//                 </div>
//                 <h4 className="text-lg font-semibold mt-4">Videos</h4>
//                 <div className="videos">
//                   {user.videos.map((video, index) => (
//                     <div
//                       key={index}
//                       className="video-thumbnail"
//                       onClick={() => openModal(video, "video")}
//                     >
//                       <video src={video} controls className="video" />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button color="gray" onClick={onClose}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default AdminUsersPopup;
