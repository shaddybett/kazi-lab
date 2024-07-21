import React, { useRef, useState } from "react";
import { Avatar, Button, Card, Spinner } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import PhoneNumberPopup from "./PhoneNumberPopup";
import Modal from "react-modal";
import "./ProviderDashboard.css";

function UserDetailsPopup({ user, onClose }) {
  const popupRef = useRef();
  const [jobsDone, setJobsDone] = useState(user.jobs || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null); // Add mediaType state
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const assignJob = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${backendUrl}/assign_job/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      localStorage.setItem("namme", user.first_name);
      localStorage.setItem("idid", user.id);

      const data = await response.json();
      setJobsDone(data.jobs_done);
      setShowPhonePopup(true);
    } catch (error) {
      setError("Error assigning job");
      console.error("Error assigning job:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const openModal = (media, type) => {
    setSelectedMedia(media);
    setMediaType(type); // Set mediaType
    if (type === "video") {
      setIsVideoLoading(true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
    setMediaType(null); // Reset mediaType
    setIsVideoLoading(false);
  };

  return (
    <div className="cardss">
      <Card ref={popupRef} className="max-w-xl">
        <div className="flex flex-col items-center gap-2 mt-10">
          <Avatar className="mb-10" img={user.image} size="xl" />
          <div className="text-center md:text-left">
            <p className="mb-3 text-black">
              <strong>Name:</strong> {user.first_name} {user.middle_name}{" "}
              {user.last_name}
            </p>
            <div className="flex items-center mb-3">
              <strong>Email:</strong>
              <span className="ml-2">{user.email}</span>
              <a href={`mailto:${user.email}`} className="ml-2 text-blue-500">
                <FontAwesomeIcon icon={faEnvelope} className="ml-10" />
              </a>
            </div>
            <p className="mb-3 text-black">
              Jobs assigned:
              <strong className="text-green-700 ml-2">{jobsDone || 0}</strong>
            </p>
            <p className="mb-3 text-black">
              Likes:
              <strong className="text-green-700 ml-2">{user.likes || 0}</strong>
            </p>
            <div className="image-grid">
              {user.photos && user.photos.length > 0 && (
                <div>
                  <h3>Uploaded Photos:</h3>
                  <div className="grid-container">
                    {user.photos.map((photo, index) => (
                      <div key={index} className="grid-item-container">
                        <img
                          src={photo}
                          alt={`Uploaded ${index + 1}`}
                          className="grid-item"
                          onClick={() => openModal(photo, "image")}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {user.videos && user.videos.length > 0 && (
                <div>
                  <h3>Uploaded Videos:</h3>
                  <div className="grid-containers">
                    {user.videos.map((video, index) => (
                      <div key={index} className="grid-item-container">
                        <video
                          controls
                          className="grid-items"
                          preload="metadata"
                          onClick={() => openModal(video, "video")}
                        >
                          <source src={video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <p className="text-black">
              Click the button below to get {user.first_name}'s phone number{" "}
            </p>
            <Button
              onClick={assignJob}
              disabled={loading}
              gradientDuoTone="purpleToBlue"
              className="ml-20"
            >
              {loading ? "Assigning..." : "Assign"}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
          </div>
          <Button
            onClick={onClose}
            className="mt-8 mr-8 "
            outline
            gradientDuoTone="purpleToBlue"
          >
            Close
          </Button>
        </div>
      </Card>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="overlay"
      >
        {selectedMedia && (
          <>
            {mediaType === "video" ? ( // Check mediaType instead
              <>
                {isVideoLoading && <Spinner aria-label="Loading" size="lg" />}
                <video
                  controls
                  className="modal-media"
                  onLoadedData={() => setIsVideoLoading(false)}
                  preload="metadata"
                >
                  <source src={selectedMedia} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </>
            ) : (
              <img src={selectedMedia} alt="Enlarged" className="modal-media" />
            )}
          </>
        )}
      </Modal>
      {showPhonePopup && (
        <PhoneNumberPopup
          phoneNumber={user.phone_number}
          onClose={() => setShowPhonePopup(false)}
        />
      )}
    </div>
  );
}

export default UserDetailsPopup;
