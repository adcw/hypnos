import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useGameLeave = (
  onGameLeave: () => void,
  allowedLocations: string[]
) => {
  const location = useLocation();

  useEffect(() => {
    // console.log(location.pathname);
    if (!allowedLocations.includes(location.pathname.slice(1))) {
      onGameLeave();
    }
  }, [location]);
};
