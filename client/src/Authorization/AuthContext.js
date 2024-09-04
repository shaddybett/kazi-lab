// // src/Authorization/AuthContext.js

// import React, { createContext, useState } from 'react';

// // Create the context
// const AuthContext = createContext({
//   blocked: [],
//   setBlocked: () => {},
//   handleBlockedClose: () => {},
//   onBlockedUserClick: () => {},
// });

// // Create the provider component
// export const AuthProvider = ({ children }) => {
//   const [blocked, setBlocked] = useState([]);

//   const handleBlockedClose = () => {
//     setBlocked([]);
//   };

//   const onBlockedUserClick = (user) => {
//     console.log('Blocked user clicked:', user);
//     // Custom logic when a blocked user is clicked
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         blocked,
//         setBlocked,
//         handleBlockedClose,
//         onBlockedUserClick,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;



// src/Authorization/AuthContext.js

import React, { createContext, useState } from 'react';

// Create the context
const AuthContext = createContext({
  blocked: [],
  setBlocked: () => {},
  handleBlockedClose: () => {},
  onBlockedUserClick: () => {},
});

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [blocked, setBlocked] = useState([]);

  const handleBlockedClose = () => {
    setBlocked([]);
  };

  const onBlockedUserClick = (user) => {
    console.log('Blocked user clicked:', user);
    // Custom logic when a blocked user is clicked
  };

  return (
    <AuthContext.Provider
      value={{
        blocked,
        setBlocked,
        handleBlockedClose,
        onBlockedUserClick,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
