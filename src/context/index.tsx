'use client';
import { createContext, useContext, useEffect, useState } from 'react';
/* import { Admin, AdminOnlineStatus } from '@prisma/client'; */
// import useSound from 'use-sound';

type ModalsType =
  | 'faqCreate'
  | 'faqEdit'
  | 'faqCategoryCreate'
  | 'faqCategoryEdit';

interface UserContextProps {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  activeModal: ModalsType | null;
  setActiveModal: React.Dispatch<React.SetStateAction<ModalsType | null>>;
  viewMode: 'grid' | 'list';
  setViewMode: React.Dispatch<React.SetStateAction<'grid' | 'list'>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAdmin must be used within a UserProvider');
  }
  return context;
};
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ModalsType | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  /* const [onlineStatus, setOnlineStatus] = useState<AdminOnlineStatus>(
    AdminOnlineStatus.OFFLINE,
  ); */

  useEffect(() => {
    let lastInteraction = Date.now();
    const handleInteraction = () => {
      lastInteraction = Date.now();
      /* setOnlineStatus(AdminOnlineStatus.ONLINE); */
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        /* setOnlineStatus(AdminOnlineStatus.AWAY); */
      } else {
        /* setOnlineStatus(AdminOnlineStatus.ONLINE); */
      }
    };

    const checkIdleTime = () => {
      const now = Date.now();
      const diff = now - lastInteraction;

      if (diff > 5 * 60 * 1000) {
        // 5 dakika geçtiyse
        /*  setOnlineStatus(AdminOnlineStatus.OFFLINE); */
      }
    };

    const checkCookieStatus = () => {
      const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('admin.online='))
        ?.split('=')[1];

      /* if (
        cookieValue === AdminOnlineStatus.BUSY ||
        cookieValue === AdminOnlineStatus.INVISIBLE
      ) {
        setOnlineStatus(cookieValue as AdminOnlineStatus);
      } */
    };

    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('visibilitychange', handleVisibilityChange);

    const idleInterval = setInterval(() => {
      checkIdleTime();
      checkCookieStatus();
    }, 30 * 1000); // Her 30 saniyede bir kontrol et

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(idleInterval);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        /*  admin, */
        loggedIn,
        setLoggedIn,
        activeModal,
        setActiveModal,
        viewMode,
        setViewMode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default useAdmin;
