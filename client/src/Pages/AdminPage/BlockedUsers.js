// import React from 'react';

// function BlockedUsers({ blocked, onClose, click }) {
//   return (
//     <div>
//       <button onClick={onClose}>Close</button>
//       {blocked.length > 0 ? (
//         blocked.map((bUser) => (
//           <div key={bUser.id} onClick={()=> click(bUser)} >
//             {bUser.first_name} {bUser.last_name} - {bUser.reason}
//           </div>
//         ))
//       ) : (
//         <p>No blocked users to display</p>
//       )}
//     </div>
//   );
// }

// export default BlockedUsers;



// src/Authorization/AuthContext.js
// src/Pages/AdminPage/BlockedUsers.js

import React, { useContext } from 'react';
import AuthContext from '../../Authorization/AuthContext';

function BlockedUsers({ onClose }) {
  const { blocked } = useContext(AuthContext); // Access blocked users from context
  const { click } = useContext(AuthContext); 

  return (
    <div>
      <button onClick={onClose}>Close</button>
      {blocked.length > 0 ? (
        blocked.map((bUser) => (
          <div key={bUser.id} onClick={() => click(bUser)}>
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
