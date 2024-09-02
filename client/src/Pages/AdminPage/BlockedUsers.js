import React from 'react';

function BlockedUsers({ blocked, onClose }) {
  return (
    <div>
      <button onClick={onClose}>Close</button>
      {blocked.length > 0 ? (
        blocked.map((user) => (
          <div key={user.id}>
            {user.first_name} {user.last_name} - {user.reason}
          </div>
        ))
      ) : (
        <p>No blocked users to display</p>
      )}
    </div>
  );
}

export default BlockedUsers;
