import React, {useContext} from 'react';
import AuthContext from '../../Authorization/AuthProvider';

function BlockedUsers() {
  const { blocked, onClose, onBlockedUserClick } = useContext(AuthContext);
  return (
    <div>
      <button onClick={onClose}>Close</button>
      {blocked.length > 0 ? (
        blocked.map((bUser) => (
          <div key={bUser.id} onClick={()=> onBlockedUserClick(bUser)} >
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
