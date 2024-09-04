import React, { createContext, useState } from 'react';

const AuthContext = createContext({
  blocked: [],
  setBlocked: () => {},
  handleBlockedClose: () => {},
});

export const AuthProvider = ({ children, blocked, onClose, click }) => {
  const [localBlocked, setLocalBlocked] = useState(blocked);

  return (
    <AuthContext.Provider
      value={{ blocked: localBlocked, setBlocked: setLocalBlocked, onClose,click }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;