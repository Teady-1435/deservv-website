"use client";

import { createContext, useContext, useRef, useCallback } from "react";

type HomeReelBus = {
  replay: () => void;
  registerReplay: (fn: () => void) => void;
};

const HomeReelContext = createContext<HomeReelBus | null>(null);

export function HomeReelProvider({ children }: { children: React.ReactNode }) {
  const fnRef = useRef<(() => void) | null>(null);

  const registerReplay = useCallback((fn: () => void) => {
    fnRef.current = fn;
  }, []);

  const replay = useCallback(() => {
    fnRef.current?.();
  }, []);

  return (
    <HomeReelContext.Provider value={{ replay, registerReplay }}>
      {children}
    </HomeReelContext.Provider>
  );
}

export function useHomeReel() {
  const ctx = useContext(HomeReelContext);
  if (!ctx) {
    return { replay: () => {}, registerReplay: () => {} };
  }
  return ctx;
}
