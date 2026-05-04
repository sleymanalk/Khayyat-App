import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Role = 'customer' | 'tailor' | null;

const KEY = 'khayyat.role.v1';

const RoleContext = createContext<{
  role: Role;
  setRole: (r: Role) => void;
  ready: boolean;
}>({ role: null, setRole: () => {}, ready: false });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await AsyncStorage.getItem(KEY);
        if (r === 'customer' || r === 'tailor') setRoleState(r);
      } catch {}
      setReady(true);
    })();
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    if (r) AsyncStorage.setItem(KEY, r).catch(() => {});
    else AsyncStorage.removeItem(KEY).catch(() => {});
  };

  return (
    <RoleContext.Provider value={{ role, setRole, ready }}>{children}</RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
