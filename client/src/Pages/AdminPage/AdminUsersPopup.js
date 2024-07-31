import React, { useState } from 'react';
import { Card, Modal, Button } from 'flowbite-react';

function AdminUsersPopup({ user, onClose }) {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  if (!user) return null;

  return (
    <div className="admin-user-popup">
      <Modal show={true} onClose={onClose}>
        <Modal.Header>{`${user.first_name} ${user.last_name}`}</Modal.Header>
        <Modal.Body>
          <Card>
            <div className="flex flex-col items-center">
              <img src={user.image} alt={`${user.first_name} ${user.last_name}`} className="mb-4" />
              <h3 className="text-xl font-semibold">{`${user.first_name} ${user.last_name}`}</h3>
              <p>{user.email}</p>
              <p>Phone Number: {user.phone_number}</p>
              <p>National ID: {user.national_id}</p>
              <p>Likes: {user.likes}</p>
              <p>Jobs: {user.jobs}</p>
              <div className="media-gallery">
                <h4 className="text-lg font-semibold">Photos</h4>
                <div className="photos">
                  {user.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Photo ${index}`}
                      className="photo"
                      onClick={() => openModal(photo, 'photo')}
                    />
                  ))}
                </div>
                <h4 className="text-lg font-semibold mt-4">Videos</h4>
                <div className="videos">
                  {user.videos.map((video, index) => (
                    <div
                      key={index}
                      className="video-thumbnail"
                      onClick={() => openModal(video, 'video')}
                    >
                      <video src={video} controls className="video" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
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

export default AdminUsersPopup;
