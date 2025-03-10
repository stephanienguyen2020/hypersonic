import { useRef } from "react";
import { useScrambleEffect } from "../hooks/useScrambleEffect";

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  holdDuration?: number;
  scrambleOnHover?: boolean;
  characterSet?: "alphanumeric" | "symbols" | "all";
  maxIterations?: number;
}

export function ScrambleText({
  text,
  className = "",
  scrambleSpeed = 50,
  holdDuration = 3000,
  scrambleOnHover = false,
  characterSet = "all",
  maxIterations = 12,
}: ScrambleTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  const { displayText, triggerScramble } = useScrambleEffect({
    text,
    scrambleSpeed,
    holdDuration,
    characterSet,
    maxIterations,
    autoStart: !scrambleOnHover,
  });

  // Handle hover events
  const handleMouseEnter = () => {
    if (scrambleOnHover) {
      triggerScramble();
    }
  };

  return (
    <span
      ref={containerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </span>
  );
}
