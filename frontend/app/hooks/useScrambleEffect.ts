import { useState, useEffect, useRef, useCallback } from "react";

interface ScrambleOptions {
  text: string;
  scrambleSpeed?: number;
  holdDuration?: number;
  maxIterations?: number;
  characterSet?: "alphanumeric" | "symbols" | "all";
  autoStart?: boolean;
}

export function useScrambleEffect({
  text,
  scrambleSpeed = 50,
  holdDuration = 3000,
  maxIterations = 12,
  characterSet = "all",
  autoStart = true,
}: ScrambleOptions) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrambling = useRef(false);

  // Define character sets
  const alphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const symbolChars = "!@#$%^&*()_+{}:\"<>?|~`-=[]\\;',./";

  // Select the appropriate character set
  const getCharacterSet = useCallback(() => {
    switch (characterSet) {
      case "alphanumeric":
        return alphanumericChars;
      case "symbols":
        return symbolChars;
      case "all":
      default:
        return alphanumericChars + symbolChars;
    }
  }, [characterSet]);

  // Function to get a random character
  const getRandomChar = useCallback(() => {
    const chars = getCharacterSet();
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }, [getCharacterSet]);

  // Start the scramble effect
  const startScramble = useCallback(() => {
    if (isScrambling.current) return;
    isScrambling.current = true;

    let iteration = 0;

    // Clear any existing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((current) => {
        // As iterations increase, more characters will be correct
        return text
          .split("")
          .map((originalChar, index) => {
            // Chance of showing the correct character increases with iterations
            if (
              originalChar === " " ||
              Math.random() < iteration / maxIterations
            ) {
              return originalChar;
            }
            // Otherwise show a random character
            return getRandomChar();
          })
          .join("");
      });

      iteration++;

      // When we reach max iterations, stop scrambling and show the original text
      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        isScrambling.current = false;

        // Set timeout to start scrambling again after hold duration
        if (autoStart) {
          holdTimeoutRef.current = setTimeout(() => {
            startScramble();
          }, holdDuration);
        }
      }
    }, scrambleSpeed);
  }, [
    text,
    scrambleSpeed,
    holdDuration,
    maxIterations,
    getRandomChar,
    autoStart,
  ]);

  // Force a scramble effect
  const triggerScramble = useCallback(() => {
    // Clear any existing timeouts
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    startScramble();
  }, [startScramble]);

  useEffect(() => {
    // Start the effect if autoStart is true
    if (autoStart) {
      startScramble();
    }

    // Clean up on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    };
  }, [text, autoStart, startScramble]);

  return {
    displayText,
    triggerScramble,
    isScrambling: isScrambling.current,
  };
}
