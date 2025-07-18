import React, { ReactNode, createContext, useContext, useState } from 'react';

interface NotificationContextType {
  notification: React.ReactNode | null;
  displayNotification: ({
    content,
    period,
  }: {
    content: React.ReactNode;
    period?: number | null;
  }) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children } : { children: ReactNode }) {

  const [notification, setNotification] = useState<React.ReactNode | null>(null);

  const defaultNotificationPeriod = 9000;
  const displayNotification = ({
    content,
    period = defaultNotificationPeriod ?? null,
  }: {
    content: React.ReactNode,
    period?: number | null,
  }
  ): void => {
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
      displayNotification
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
