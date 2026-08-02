"use client";

import { createContext, useContext, useState, useCallback } from "react";

type NavTone = {
  inverted: boolean;
  setInverted: (v: boolean) => void;
};

const NavToneContext = createContext<NavTone>({
  inverted: false,
  setInverted: () => {},
});

export function NavToneProvider({ children }: { children: React.ReactNode }) {
  const [inverted, setInvertedState] = useState(false);
  const setInverted = useCallback((v: boolean) => setInvertedState(v), []);
  return (
    <NavToneContext.Provider value={{ inverted, setInverted }}>
      {children}
    </NavToneContext.Provider>
  );
}

export function useNavTone() {
  return useContext(NavToneContext);
}
