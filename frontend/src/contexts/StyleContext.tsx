import React, { createContext, useContext } from 'react';
import { useTheme } from '@mui/material/styles';

const StyleContext = createContext(null);

export function StyleProvider({ children }) {
  const theme = useTheme();

  return (
    <StyleContext.Provider value={{ theme }} >
      {children}
    </StyleContext.Provider>
  );

}

export function useStyleContext() {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error('useStyleContext must be used within a StyleProvider');
  }
  return context;
}