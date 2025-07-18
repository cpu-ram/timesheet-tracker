import { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

interface StyleContextType {
  theme: Theme;
}

const StyleContext = createContext<StyleContextType | null>(null);

export function StyleProvider({ children }: { children: ReactNode }) {
  const theme: Theme = useTheme();

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
