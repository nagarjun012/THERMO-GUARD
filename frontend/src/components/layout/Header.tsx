import React, { useEffect } from 'react';
import { detectRealtimeLocation } from '../../services/locationService';

export const Header: React.FC = () => {
  // Automatically detect real-time GPS location on every page load
  useEffect(() => {
    detectRealtimeLocation(false);
  }, []);

  // Header search bar hidden for production
  return null;
};
