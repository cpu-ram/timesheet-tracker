import React from 'react';

import { createContext, useContext, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Popup from '../components/Popup/Popup';

type PopupContextType = {
  showPopup: (content: React.ReactNode, invokerTitle?: string) => void;
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
  const [invokerTitle, setInvokerTitle] = useState<string>('');

  useEffect(() => {
    if (popupStack.length === 0) {
      setInvokerTitle('');
    }
  }, [popupStack.length]);

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

  const getParentTitle = () => {
    if (popupStack.length < 2) return invokerTitle || null;
    else return getPreviousPopupTitle();
  }

  const showPopup = (content: React.ReactNode, invokerTitle?: string) => {
    setPopupStack(prevStack => [...prevStack, { content, title: '' }]);
    setInvokerTitle((prevInvokerTitle) => invokerTitle ? invokerTitle : prevInvokerTitle);
  };

  const hidePopup = () => {
    setPopupStack(prevStack => prevStack.length > 0 ? prevStack.slice(0, -1) : prevStack);
  };

  const value: PopupContextType = {
    showPopup,
    hidePopup,
    setPopupTitle,
  };


  return (
    <PopupContext.Provider
      value={value}
    >
      <Box
        sx={{
          display: popupStack.length > 0 ? 'none' : 'inherit',
        }}
      >
        {children}
      </Box>
      {popupStack.length > 0 &&
        <Popup title={getPopupTitle()} parentTitle={getParentTitle()} onClose={hidePopup}>
          {
            popupStack.map((popup, index) => (
              <Box key={index} sx={{ display: index === popupStack.length - 1 ? 'block' : 'none' }}>
                {popup.content}
              </Box>
            ))
          }
        </Popup>
      }
    </PopupContext.Provider>
  );
}
