import { createContext, useContext, useState } from 'react';
import { Box } from '@mui/material';
import Popup from '../components/Popup/Popup';

const PopupContext = createContext(null);

export function usePopupContext() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('PopupContext not in scope');
  }
  return context;
}

export function PopupProvider({ children }) {
  const [popupContent, setPopupContent] = useState<React.ReactNode | null>(null);

  const showPopup = (content: React.ReactNode) => {
    setPopupContent(content);
  }

  const hidePopup = () => {
    setPopupContent(null);
  }

  return (
    <PopupContext.Provider
      value={{
        showPopup,
        hidePopup,
      }}
    >
      <Box
        sx={{
          display: popupContent ? 'none' : 'inherit',
        }}
      >
        {children}
      </Box>
      {popupContent && (
        <Popup onClose={hidePopup}>
          {popupContent}
        </Popup>
      )}
    </PopupContext.Provider>
  )
}