"use client";

import { createContext, useContext, useRef, useCallback, type RefObject } from "react";

type HomeReelBus = {
  replay: () => void;
  registerReplay: (fn: () => void) => void;
  navLogoRef: RefObject<HTMLButtonElement | null>;
  navLinksRef: RefObject<HTMLDivElement | null>;
};

const HomeReelContext = createContext<HomeReelBus | null>(null);

export function HomeReelProvider({ children }: { children: React.ReactNode }) {
  const fnRef = useRef<(() => void) | null>(null);
  const navLogoRef = useRef<HTMLButtonElement | null>(null);
  const navLinksRef = useRef<HTMLDivElement | null>(null);

  const registerReplay = useCallback((fn: () => void) => {
    fnRef.current = fn;
  }, []);

  const replay = useCallback(() => {
    fnRef.current?.();
  }, []);

  return (
    <HomeReelContext.Provider value={{ replay, registerReplay, navLogoRef, navLinksRef }}>
      {children}
    </HomeReelContext.Provider>
  );
}

export function useHomeReel() {
  const ctx = useContext(HomeReelContext);
  if (!ctx) {
    throw new Error("useHomeReel must be used within HomeReelProvider");
  }
  return ctx;
}
