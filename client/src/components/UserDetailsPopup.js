import React, { useRef, useState, useEffect } from "react";
import { Avatar, Button, Modal, TextInput, Label } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faIdCard,
  faHeartBroken,
  faHeart,
  faBriefcase,
  faCamera,
  faVideo,
  faInbox,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import "./UserDetails.css";
import NewChatBox from "../Pages/Chat/NewChatBox";

function UserDetailsPopup({ user, onClose, minimized, details }) {
  const [jobsDone, setJobsDone] = useState(user.jobs || 0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false); // Track if thumbs-up was clicked
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUserId = localStorage.getItem("id");
  const [messageContent, setMessageContent] = useState("");
  const [success, setSuccess] = useState(null);
  const [chatUser, setChatUser] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const likeKey = `liked_${user.id}`;

  const handleChatClick = () => {
    setChatUser(true);
  };

  const handleClose = () => {
    setChatUser(false);
  };

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
    const storedLiked = localStorage.getItem(likeKey);
    if (storedLiked === "true") {
      setLiked(true);
    }
  }, [backendUrl, user.id]);

  const assignJob = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found!");
  
      const response = await fetch(`${backendUrl}/assign_job/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Fixed template literal
        },
      });
  
      // Check if the response is not OK
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      // Set data and update localStorage
      setJobsDone(data.jobs_done);
      localStorage.setItem("name", user.first_name); // Fixed typo: "namme" -> "name"
      localStorage.setItem("idid", user.id);
  
    } catch (error) {
      // Handle any error in the process
      setError("Error assigning job");
      console.error("Error assigning job:", error.message); // Logging the actual error message
    } finally {
      // Always turn off loading at the end
      setLoading(false);
    }
  };

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
  const admins = [1];

  const handleSendMessage = async () => {
    if (messageContent === "") {
      setError("Input field can't be empty");
      console.log("Message is empty, not sending");
      return;
    }

    try {
      console.log("Sending message from user:", currentUserId);
      console.log("Message content:", messageContent);

      const sendMessages = admins.map(async (adminId) => {
        const response = await fetch(`${backendUrl}/send_message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: currentUserId,
            receiver_id: adminId,
            content: messageContent,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Network response was not ok: ${response.statusText} - ${errorData.error}`
          );
        }

        console.log(
          `Message sent to admin ${adminId} with response:`,
          response
        );
      });

      await Promise.all(sendMessages);
      setSuccess("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      setError(`Error sending message: ${error.message}`);
    } finally {
      setMessageContent("");
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
                      <p className="phone-items">
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="icon"
                          onClick={assignJob}
                          href={`tel:${user.phone_number}`}
                        />{" "}
                        <strong>Number:</strong> {user.phone_number}
                      </p>
                    )}
                    {user.county && (
                      <p className="detail-items">
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
                      <p className="detail-items">
                        <FontAwesomeIcon icon={faBriefcase} className="icon" />{" "}
                        <strong>Jobs:</strong> {jobsDone}
                      </p>
                    )}
                    <p className="chat-item " onClick={handleChatClick} >
                      <FontAwesomeIcon
                        icon={faCommentDots} // or use faCommentDots
                        className=" chat-i cursor-pointer"
                        onClick={handleChatClick}
                        disabled={loading}
                      />
                      <strong>Message</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Grid */}
            <div className="image-grid">
              {user.photos.length > 0 && (
                <div>
                  <h4 className="image-heading">
                    <FontAwesomeIcon icon={faCamera} /> Uploaded Photos
                  </h4>

                  <div className="grid-container">
                    {user.photos.map((photo, index) => (
                      <div key={index} className="admin-grid-item-container">
                        <img
                          src={photo}
                          alt={`User's uploads ${index + 1}`}
                          className="image-grid-item"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Grid */}
              {user.videos.length > 0 && (
                <>
                  <h4 className="vid-heading">
                    <FontAwesomeIcon icon={faVideo} /> Uploaded Videos
                  </h4>

                  <div className="admin-grid-containers">
                    {user.videos.map((video, index) => (
                      <div key={index} className="admin-grid-item-container">
                        <video
                          src={video}
                          controls
                          className="admin-grid-items"
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
            <div className="message-input-section">
              <Label
                htmlFor="input-gray"
                color="gray"
                className="text-2lg"
                value={`Any message for the admin regarding ${user.first_name}?`}
              />
              <TextInput
                id="input-gray"
                placeholder="Your text here..."
                required
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
              <Button
                gradientDuoTone="purpleToBlue"
                className="mt-4 w-full "
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {chatUser && (
        <NewChatBox
          senderId={currentUserId}
          receiver={user}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default UserDetailsPopup;
