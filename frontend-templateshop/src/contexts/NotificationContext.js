import React, { createContext, useState, useContext, useCallback } from 'react';
import NotificationModal from '../components/ui/NotificationModal';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });
  }, []);

  const hideNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationModal
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);