"use client";
import { usePageTransition } from "../../hooks/usePageTransition";
import { ReactNode, MouseEvent } from "react";

// Custom next <Link> component
interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TransitionLink({
  href,
  children,
  className,
}: TransitionLinkProps) {
  const { navigateTo } = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateTo(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
