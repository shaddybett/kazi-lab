// import React, { useRef, useState } from "react";
// import { Avatar, Button, Card, Spinner,Modal } from "flowbite-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
// import PhoneNumberPopup from "./PhoneNumberPopup";
// import './UserDetails.css'

// function UserDetailsPopup({ user, onClose, minimized, details }) {
//   const popupRef = useRef();  
//   const [jobsDone, setJobsDone] = useState(user.jobs || 0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPhonePopup, setShowPhonePopup] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedMedia, setSelectedMedia] = useState(null);
//   const [mediaType, setMediaType] = useState(null);
//   const [isVideoLoading, setIsVideoLoading] = useState(false);

//   const backendUrl = process.env.REACT_APP_BACKEND_URL;

//   const assignJob = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${backendUrl}/assign_job/${user.id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setJobsDone(data.jobs_done);
//       localStorage.setItem("namme", user.first_name);
//       localStorage.setItem("idid", user.id);
//       setShowPhonePopup(true);
//     } catch (error) {
//       setError("Error assigning job");
//       console.error("Error assigning job:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const likeJob = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${backendUrl}/like_job/${user.id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.statusText}`);
//       }
//       else {
//         details();
//       }

//     } catch (error) {
//       setError("Error liking job");
//       console.error("Error liking job:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return null;

//   return (
//     <div  className="admin-user-popup">
//       <Modal show={true} onClose={onClose}>
//         <Modal.Header className="modal-header">
//           <i className="fas fa-user-circle"></i>{" "}
//           <span className="ml-2">{`${user.first_name} ${user.last_name}`}</span>
//         </Modal.Header>

//         <Modal.Body>
//           <div className="flex flex-col items-center items2 ">
//             <div
//               className={` ${minimized ? "mini-user-detail" : "user-detai"}${
//                 !user.phone_number && !user.county && !user.likes && !user.jobs
//                   ? "centered"
//                   : ""
//               }`}
//             >
//               <div className={`${minimized ? "mini-details-1" : "details-1" }`}>
//                 <img
//                   src={user.image}
//                   alt={Avatar}
//                   className="image-dt"
//                   rounded
//                 />
//                 <h3 className="details-1-name">{`${user.first_name} ${user.last_name}`}</h3>
//                 <p className="text-black details-1-email">{user.email}</p>
//               </div>

//               {/* Only show the details-2 section if any of the optional fields are present */}
//               {(user.phone_number ||
//                 user.county ||
//                 user.likes ||
//                 user.jobs) && (
//                 <div className="details-2">
//                   <div className="details-2-dt">
//                     {user.phone_number && (
//                       <p className="detail-item">
//                         <i className="fas fa-phone  phone-icone " onClick={assignJob} ></i>
//                         <strong>Phone Number:</strong> {user.phone_number}
//                       </p>
//                     )}
//                     {user.county && (
//                       <p className="detail-item">
//                         <i className="fas fa-id-card"></i>
//                         <strong>County:</strong> {user.county}
//                       </p>
//                     )}
//                     {user.likes !== undefined && (
//                       <p className="detail-item">
//                         <i className="fas fa-thumbs-up"  onClick={likeJob} ></i>
//                         <strong>Likes:</strong> {user.likes || 0}
//                       </p>
//                     )}
//                     {user.jobs !== undefined && (
//                       <p className="detail-item">
//                         <i className="fas fa-briefcase"></i>
//                         <strong>Jobs:</strong> {user.jobs || 0}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="image-grid">
//               {user.photos.length > 0 && (
//                 <>
//                   <h4 className="section-heading">
//                     <i className="fas fa-camera"></i> Uploaded Photos
//                   </h4>

//                   <div className="grid-container">
//                     {user.photos.map((photo, index) => (
//                       <div key={index} className="grid-item-container">
//                         <img
//                           src={photo}
//                           alt={`User's uploads ${index + 1}`}
//                           className="grid-item"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}

//               {user.videos.length > 0 && (
//                 <>
//                   <h4 className="video-heading">
//                     <i className="fas fa-video"></i> Uploaded Videos
//                   </h4>

//                   <div className="grid-containers">
//                     {user.videos.map((video, index) => (
//                       <div key={index} className="grid-item-container">
//                         <video
//                           src={video}
//                           controls
//                           className="grid-items"
//                           preload="metadata"
//                         >
//                           <source src={video} type="video/mp4" />
//                           Your browser does not support the video tag.
//                         </video>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
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

// export default UserDetailsPopup;

// import React, { useRef, useState } from "react";
// import { Avatar, Button, Card, Spinner } from "flowbite-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
// import PhoneNumberPopup from "./PhoneNumberPopup";
// import Modal from "react-modal";
// import "./ProviderDashboard.css";

// function UserDetailsPopup({ user, onClose }) {
//   const popupRef = useRef();
//   const [jobsDone, setJobsDone] = useState(user.jobs || 0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPhonePopup, setShowPhonePopup] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedMedia, setSelectedMedia] = useState(null);
//   const [mediaType, setMediaType] = useState(null);
//   const [isVideoLoading, setIsVideoLoading] = useState(false);

//   const backendUrl = process.env.REACT_APP_BACKEND_URL;

//   const assignJob = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${backendUrl}/assign_job/${user.id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setJobsDone(data.jobs_done);
//       localStorage.setItem("namme", user.first_name);
//       localStorage.setItem("idid", user.id);
//       setShowPhonePopup(true);
//     } catch (error) {
//       setError("Error assigning job");
//       console.error("Error assigning job:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return null;

//   const openModal = (media, type) => {
//     setSelectedMedia(media);
//     setMediaType(type);
//     if (type === "video") {
//       setIsVideoLoading(true);
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedMedia(null);
//     setMediaType(null);
//     setIsVideoLoading(false);
//   };

//   return (
//     <div className="cardss">
//       <Card ref={popupRef} className="max-w-xl">
//         <div className="flex flex-col items-center gap-2 mt-10">
//           <Avatar className="mb-10" img={user.image} size="xl" />
//           <div className="text-center md:text-left">
//             <p className="mb-3 text-black">
//               <strong>Name:</strong> {user.first_name} {user.middle_name} {user.last_name}
//             </p>
//             <div className="flex items-center mb-3">
//               <strong>Email:</strong>
//               <span className="ml-2">{user.email}</span>
//               <a href={`mailto:${user.email}`} className="ml-2 text-blue-500">
//                 <FontAwesomeIcon icon={faEnvelope} className="ml-10" />
//               </a>
//             </div>
//             <p className="mb-3 text-black">
//               Jobs assigned:
//               <strong className="text-green-700 ml-2">{jobsDone || 0}</strong>
//             </p>
//             <p className="mb-3 text-black">
//               Likes:
//               <strong className="text-green-700 ml-2">{user.likes || 0}</strong>
//             </p>
//             <div className="image-grid">
//               {user.photos && user.photos.length > 0 && (
//                 <div>
//                   <h3>Uploaded Photos:</h3>
//                   <div className="grid-container">
//                     {user.photos.map((photo, index) => (
//                       <div key={index} className="grid-item-container">
//                         <img
//                           src={photo}
//                           alt={`Uploaded ${index + 1}`}
//                           className="grid-item"
//                           onClick={() => openModal(photo, "image")}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               {user.videos && user.videos.length > 0 && (
//                 <div>
//                   <h3>Uploaded Videos:</h3>
//                   <div className="grid-containers">
//                     {user.videos.map((video, index) => (
//                       <div key={index} className="grid-item-container">
//                         <video
//                           controls
//                           className="grid-items"
//                           preload="metadata"
//                           onClick={() => openModal(video, "video")}
//                         >
//                           <source src={video} type="video/mp4" />
//                           Your browser does not support the video tag.
//                         </video>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//             <p className="text-black">Click the button below to get {user.first_name}'s phone number</p>
//             <Button onClick={assignJob} disabled={loading} gradientDuoTone="purpleToBlue" className="ml-20">
//               {loading ? "Assigning..." : "Assign"}
//             </Button>
//             {error && <p className="text-red-500 mt-2">{error}</p>}
//           </div>
//           <Button onClick={onClose} className="mt-8 mr-8" outline gradientDuoTone="purpleToBlue">
//             Close
//           </Button>
//         </div>
//       </Card>
//       <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
//         {selectedMedia && (
//           <>
//             {mediaType === "video" ? (
//               <>
//                 {isVideoLoading && <Spinner aria-label="Loading" size="lg" />}
//                 <video
//                   controls
//                   className="modal-media"
//                   onLoadedData={() => setIsVideoLoading(false)}
//                   preload="metadata"
//                 >
//                   <source src={selectedMedia} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               </>
//             ) : (
//               <img src={selectedMedia} alt="Enlarged" className="modal-media" />
//             )}
//           </>
//         )}
//       </Modal>
//     </div>
//   );
// }

// export default UserDetailsPopup;





import React, { useRef, useState, useEffect } from "react";
import { Avatar, Button, Spinner, Modal } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faThumbsUp, faBriefcase, faPhone, faIdCard, faHeartBroken, faHeart } from "@fortawesome/free-solid-svg-icons";
import PhoneNumberPopup from "./PhoneNumberPopup";
import './UserDetails.css';

function UserDetailsPopup({ user, onClose, minimized, details }) {
  const popupRef = useRef();
  const [jobsDone, setJobsDone] = useState(user.jobs || 0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);  // Track if thumbs-up was clicked
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPhonePopup, setShowPhonePopup] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const likeKey = `liked_${user.id}`;

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`${backendUrl}/get_likes/${user.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch likes: ${response.statusText}`);
        }
        const data = await response.json();
        setLikes(data.likes);  // Set the total likes from the backend
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();

    // Check if the client has already liked this service provider
    const storedLiked = localStorage.getItem(likeKey);
    if (storedLiked) {
      setLiked(JSON.parse(storedLiked));  // Restore liked state from localStorage
    }
  }, [backendUrl, user.id]);

  // Assign job function
  const assignJob = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/assign_job/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setJobsDone(data.jobs_done);
      localStorage.setItem("namme", user.first_name);
      localStorage.setItem("idid", user.id);
      setShowPhonePopup(true);
    } catch (error) {
      setError("Error assigning job");
      console.error("Error assigning job:", error);
    } finally {
      setLoading(false);
    }
  };

  // Like job function
      const likeJob = async () => {
        if (liked) return;  

        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${backendUrl}/like_job/${user.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          const data = await response.json();
          setLiked(true);  // Toggle to liked
          setLikes(data.likes);  // Update the likes count from the backend response
          localStorage.setItem(likeKey, true);  // Store the liked state in localStorage
    
        } catch (error) {
          setError("Error liking job");
          console.error("Error liking job:", error);
        } finally {
          setLoading(false);
        }
      };

  if (!user) return null;

  return (
    <div className="admin-user-popup">
      <Modal show={true} onClose={onClose}>
        <Modal.Header className="modal-header">
          <i className="fas fa-user-circle"></i>{" "}
          <span className="ml-2">{`${user.first_name} ${user.last_name}`}</span>
        </Modal.Header>

        <Modal.Body>
          <div className="flex flex-col items-center">
            <div
              className={` ${minimized ? "mini-user-detail" : "user-detail"} ${
                !user.phone_number && !user.county && !user.likes && !user.jobs
                  ? "centered"
                  : ""
              }`}
            >
              <div className={`${minimized ? "mini-details-1" : "details-1"}`}>
                <img
                  src={user.image}
                  alt={Avatar}
                  className="image-dt"
                  rounded
                />
                <h3 className="details-1-name">{`${user.first_name} ${user.last_name}`}</h3>
                <p className="text-black details-1-email">{user.email}</p>
              </div>

              {/* Optional Fields */}
              {(user.phone_number || user.county || user.likes || user.jobs) && (
                <div className="details-2">
                  <div className="details-2-dt">
                    {user.phone_number && (
                      <p className="detail-item">
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="icon"
                          onClick={assignJob}
                          href={`tel:${user.phone_number}`}
                        />{" "}
                        <strong>Phone Number:</strong> {user.phone_number}
                      </p>
                    )}
                    {user.county && (
                      <p className="detail-item">
                        <FontAwesomeIcon icon={faIdCard} className="icon" />{" "}
                        <strong>County:</strong> {user.county}
                      </p>
                    )}
                    {user.likes !== undefined && (
                      <p className="detail-item">
                        <FontAwesomeIcon
                          icon={liked ? faHeart : faHeartBroken}
                          className={`like-button-icon ${
                            liked ? "liked animate-pulse " : "  "
                          }`}  // Conditional styling
                          onClick={likeJob}
                          disabled={loading}
                        />{" "}
                        <strong>Likes:</strong> {likes}
                      </p>
                    )}
                    {user.jobs !== undefined && (
                      <p className="detail-item">
                        <FontAwesomeIcon icon={faBriefcase} className="icon" />{" "}
                        <strong>Jobs:</strong> {jobsDone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="image-grid">
              {user.photos.length > 0 && (
                <>
                  <h4 className="section-heading">
                    <FontAwesomeIcon icon="camera" /> Uploaded Photos
                  </h4>

                  <div className="grid-container">
                    {user.photos.map((photo, index) => (
                      <div key={index} className="grid-item-container">
                        <img
                          src={photo}
                          alt={`User's uploads ${index + 1}`}
                          className="grid-item"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {user.videos.length > 0 && (
                <>
                  <h4 className="video-heading">
                    <FontAwesomeIcon icon="video" /> Uploaded Videos
                  </h4>

                  <div className="grid-containers">
                    {user.videos.map((video, index) => (
                      <div key={index} className="grid-item-container">
                        <video
                          src={video}
                          controls
                          className="grid-items"
                          preload="metadata"
                        >
                          <source src={video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserDetailsPopup;
