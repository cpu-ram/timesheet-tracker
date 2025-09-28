import React from 'react';

import { createContext, useContext, useState } from 'react';
import { Box } from '@mui/material';
import Popup from '../components/Popup/Popup';

type PopupContextType = {
  showPopup: (content: React.ReactNode) => void;
  hidePopup: () => void;
  setPopupTitle: (title: string) => void;
};

const PopupContext = createContext<PopupContextType | null>(null);

export function usePopupContext() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('PopupContext not in scope');
  }
  return context;
}

type PopupEntry = {
  content: React.ReactNode;
  title: string;
};

export function PopupProvider({ children }: { children: React.ReactNode }) {

  const [popupStack, setPopupStack] = useState<PopupEntry[]>([]);

  const setPopupTitle = (title: string) => {
    setPopupStack(prevStack => {
      if (prevStack.length === 0) return prevStack;
      const newStack = [...prevStack];
      newStack[newStack.length - 1] = {
        ...newStack[newStack.length - 1],
        title,
      };
      return newStack;
    }
    );
  };

  const getPopupTitle = () => {
    return popupStack.length > 0 ? popupStack[popupStack.length - 1].title : '';
  }

  const getPreviousPopupTitle = () => {
    return popupStack.length > 1 ? popupStack[popupStack.length - 2].title : '';
  }

  const showPopup = (content: React.ReactNode) => {
    setPopupStack(prevStack => [...prevStack, { content, title: '' }]);
  };

  const hidePopup = () => {
    if (popupStack.length === 0) return;
    setPopupStack(prevStack => prevStack.slice(0, -1));
  };

  const currentPopupContent = popupStack.length > 0 ? popupStack[popupStack.length - 1].content : null;

  return (
    <PopupContext.Provider
      value={{
        showPopup,
        hidePopup,
        setPopupTitle,
      }}
    >
      <Box
        sx={{
          display: popupStack.length > 0 ? 'none' : 'inherit',
        }}
      >
        {children}
      </Box>
      {popupStack.length > 0 &&
        <Popup title={getPopupTitle()} parentPopupTitle={getPreviousPopupTitle()} onClose={hidePopup}>
          {
            currentPopupContent
          }
        </Popup>
      }
    </PopupContext.Provider>
  );
}
