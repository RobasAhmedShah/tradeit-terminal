import React, { createContext, useCallback, useContext, useState } from 'react';
import { AppMenuSheet } from '../components/navigation/AppMenuSheet';

interface AppMenuContextType {
  openMenu: () => void;
  closeMenu: () => void;
}

const AppMenuContext = createContext<AppMenuContextType>({
  openMenu: () => {},
  closeMenu: () => {},
});

export const AppMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = useCallback(() => setVisible(true), []);
  const closeMenu = useCallback(() => setVisible(false), []);

  return (
    <AppMenuContext.Provider value={{ openMenu, closeMenu }}>
      {children}
      <AppMenuSheet visible={visible} onClose={closeMenu} />
    </AppMenuContext.Provider>
  );
};

export const useAppMenu = () => useContext(AppMenuContext);
