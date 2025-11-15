"use client";
// fade in/out to black transition for next app router.
import { ReactNode, useEffect, useState, createContext, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./PageTransition.module.css";

interface PageTransitionProps {
  children: ReactNode;
  duration?: number;
}

interface TransitionContextType {
  navigateTo: (url: string) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export { TransitionContext };

export default function PageTransition({ children, duration = 500 }: PageTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousPathname = useRef(pathname);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeInTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const pathnameChanged = previousPathname.current !== pathname;

    if (pathnameChanged && isTransitioning && pendingUrlRef.current) {
      previousPathname.current = pathname;

      if (fadeInTimeoutRef.current) {
        clearTimeout(fadeInTimeoutRef.current);
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fadeInTimeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            setIsTransitioning(false);
            pendingUrlRef.current = null;
          }, 150);
        });
      });
    } else if (pathnameChanged) {
      previousPathname.current = pathname;
    }
  }, [pathname, isTransitioning]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (fadeInTimeoutRef.current) {
        clearTimeout(fadeInTimeoutRef.current);
      }
    };
  }, []);

  const navigateTo = useCallback(
    (url: string) => {
      if (isTransitioning) {
        return;
      }

      if (url === pathname) {
        return;
      }

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (fadeInTimeoutRef.current) {
        clearTimeout(fadeInTimeoutRef.current);
      }

      pendingUrlRef.current = url;

      setIsTransitioning(true);
      setIsVisible(false);

      transitionTimeoutRef.current = setTimeout(() => {
        router.push(url);
      }, duration);
    },
    [duration, router, pathname, isTransitioning]
  );

  const contentStyles: React.CSSProperties = {
    transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  };

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      <div className={styles.wrapper}>
        <div
          className={`${styles.content} ${isVisible ? styles.contentVisible : styles.contentHidden} ${isTransitioning ? styles.contentWillChange : ""}`}
          style={contentStyles}
        >
          {children}
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
