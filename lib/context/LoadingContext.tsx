"use client";

import React, { createContext, useContext, useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Separate component to listen to navigation changes inside a Suspense boundary
function NavigationListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams, setIsLoading]);

  return null;
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  // Global click listener to catch navigations early
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Handle links
      const anchor = target.closest("a");
      if (anchor && 
          anchor.href && 
          anchor.href.startsWith(window.location.origin) && 
          !anchor.href.includes("#") &&
          anchor.target !== "_blank") {
        setIsLoading(true);
      }

      // Handle buttons (especially submit buttons)
      const button = target.closest("button");
      if (button && (button.type === "submit" || button.classList.contains("btn-primary"))) {
        setIsLoading(true);
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <Suspense fallback={null}>
        <NavigationListener />
      </Suspense>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
