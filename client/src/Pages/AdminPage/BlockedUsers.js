import React from 'react';

function BlockedUsers({ blocked, onClose, click }) {
  return (
    <div>
      <button onClick={onClose}>Close</button>
      {blocked.length > 0 ? (
        blocked.map((bUser) => (
          <div key={bUser.id} onClick={()=> click(bUser)} >
            {bUser.first_name} {bUser.last_name} - {bUser.reason}
          </div>
        ))
      ) : (
        <p>No blocked users to display</p>
      )}
    </div>
  );
}

export default BlockedUsers;
