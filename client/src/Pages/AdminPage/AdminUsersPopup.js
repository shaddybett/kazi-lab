import React, { useState } from "react";
import { Modal, Button, Spinner } from "flowbite-react"; // Ensure Spinner is imported
import "./AdminPage.css";

function AdminUsersPopup({ user, onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  if (!user) return null;

  const openModal = (media, type) => {
    if (type === "image") {
      setSelectedImage(media);
      setSelectedVideo(null);
    } else if (type === "video") {
      setSelectedImage(null);
      setSelectedVideo(media);
      setIsVideoLoading(true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setSelectedVideo(null);
    setIsVideoLoading(false);
  };

  return (
    <div className="admin-user-popup">
      <Modal show={true} onClose={onClose}>
        <Modal.Header>{`${user.first_name} ${user.last_name}`}</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col items-center">
            {/* User Details */}
            <div className="user-details">
              <div className="details-1">
                <img
                  src={user.image}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="image-dt"
                />
                <h3 className="details-1-name">{`${user.first_name} ${user.last_name}`}</h3>
                <p className="text-black details-1-email">{user.email}</p>
              </div>
              <div className="details-2">
                <div className="details-2-dt">
                  <p className="text-black">
                    Full Name: {user.first_name} {user.last_name}
                  </p>
                  <p className="text-black">
                    Phone Number: {user.phone_number}
                  </p>
                  <p className="text-black">National ID: {user.national_id}</p>
                  <p className="text-black">Likes: {user.likes || 0}</p>
                  <p className="text-black">Jobs: {user.jobs || 0}</p>
                </div>
              </div>
            </div>

            {/* Uploaded Media */}
            <div className="image-grid">
              {/* Photos Section */}
              {user.photos.length > 0 && (
                <>
                  <h4 className="text-lg font-semibold">Uploaded Photos</h4>
                  <div className="grid-container">
                    {user.photos.map((photo, index) => (
                      <div key={index} className="grid-item-container">
                        <img
                          src={photo}
                          alt={`User's photo ${index + 1}`}
                          className="grid-item"
                          onClick={() => openModal(photo, "image")}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Videos Section */}
              {user.videos.length > 0 && (
                <>
                  <h4 className="text-lg font-semibold mt-4">
                    Uploaded Videos
                  </h4>
                  <div className="grid-containers">
                    {user.videos.map((video, index) => (
                      <div key={index} className="grid-item-container">
                        <video
                          src={video}
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
      {isModalOpen && (
        <Modal
          show={isModalOpen}
          onRequestClose={closeModal}
          className="modal"
          overlayClassName="overlay"
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Enlarged content"
              className="modal-image"
            />
          )}
          {selectedVideo && (
            <div className="modal-video-container">
              {isVideoLoading && (
                <Spinner aria-label="Loading video" size="lg" />
              )}
              <video
                controls
                className="modal-video"
                onLoadedData={() => setIsVideoLoading(false)}
                preload="metadata"
              >
                <source src={selectedVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default AdminUsersPopup;
