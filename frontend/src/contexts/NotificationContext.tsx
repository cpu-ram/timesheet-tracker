import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {

  const [notification, setNotification] = useState<React.ReactNode | null>(null);

  const defaultNotificationPeriod = 9000;
  const displayNotification = ({
    content,
    period = defaultNotificationPeriod | null,
  }: {
    content: React.ReactNode,
    period?: number | null,
  }
  ) => {
    setNotification(content);
    if (period) {
      setTimeout(() => {
        setNotification(null);
      }, period);
    }
  }

  return (
    <NotificationContext.Provider value={{
      notification,
      displayNotification,
    }} >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}