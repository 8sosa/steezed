import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children, navigate }) => {
  const [previousLocation, setPreviousLocation] = useState(null);

  return (
    <LocationContext.Provider value={{ previousLocation, setPreviousLocation, navigate }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
