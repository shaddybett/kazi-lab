import React, { useRef, useState, useEffect } from "react";
import { Avatar, Button, Modal } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faIdCard,
  faHeartBroken,
  faHeart,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import "./UserDetails.css";

function UserDetailsPopup({ user, onClose, minimized, details }) {
  const popupRef = useRef();
  const [jobsDone, setJobsDone] = useState(user.jobs || 0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false); // Track if thumbs-up was clicked
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
        setLikes(data.likes); // Set the total likes from the backend
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();

    // Check if the client has already liked this service provider
    const storedLiked = localStorage.getItem(likeKey);
    if (storedLiked === "true") {
      setLiked(true); // Restore liked state from localStorage if it's true
    }
  }, [backendUrl, user.id]);

  // Like or Unlike Job function
  const likeJob = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${backendUrl}/${liked ? "unlike_job" : "like_job"}/${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setLiked(!liked); // Toggle the liked state
      setLikes(data.likes); // Update the likes count from the backend response
      localStorage.setItem(likeKey, !liked ? "true" : "false"); // Store the liked state in localStorage
    } catch (error) {
      setError("Error processing like/unlike");
      console.error("Error processing like/unlike:", error);
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
              {(user.phone_number ||
                user.county ||
                user.likes ||
                user.jobs) && (
                <div className="details-2">
                  <div className="details-2-dt">
                    {user.phone_number && (
                      <p className="detail-item">
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="icon"
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
                          }`} // Conditional styling
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


















// const assignJob = async () => {
//   setLoading(true);
//   setError(null);
//   try {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${backendUrl}/assign_job/${user.id}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Network response was not ok: ${response.statusText}`);
//     }

//     const data = await response.json();
//     setJobsDone(data.jobs_done);
//     localStorage.setItem("namme", user.first_name);
//     localStorage.setItem("idid", user.id);
//     setShowPhonePopup(true);
//   } catch (error) {
//     setError("Error assigning job");
//     console.error("Error assigning job:", error);
//   } finally {
//     setLoading(false);
//   }
// };