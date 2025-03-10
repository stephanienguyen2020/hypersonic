import { useState, useEffect, useRef } from "react";
import { ScrambleText } from "./ScrambleText";

interface ColorChangeScrambleTextProps {
  text: string;
  scrambleSpeed?: number;
  holdDuration?: number;
  characterSet?: "alphanumeric" | "symbols" | "all";
  maxIterations?: number;
  normalClassName?: string;
  scramblingClassName?: string;
}

export function ColorChangeScrambleText({
  text,
  scrambleSpeed = 100,
  holdDuration = 3000,
  characterSet = "all",
  maxIterations = 20,
  normalClassName = "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600",
  scramblingClassName = "text-white",
}: ColorChangeScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const [className, setClassName] = useState(normalClassName);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define character sets
  const alphanumericChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const symbolChars = "!@#$%^&*()_+{}:\"<>?|~`-=[]\\;',./";

  // Get character set based on option
  const getCharSet = () => {
    switch (characterSet) {
      case "alphanumeric":
        return alphanumericChars;
      case "symbols":
        return symbolChars;
      case "all":
      default:
        return alphanumericChars + symbolChars;
    }
  };

  // Get a random character
  const getRandomChar = () => {
    const chars = getCharSet();
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  // Start the subtle scramble effect
  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    setClassName(scramblingClassName);

    let iteration = 0;
    let stableCount = 0;

    // Clear any existing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((current) => {
        // Convert text to array for manipulation
        const textArray = text.split("");
        const currentArray = current.split("");

        // Determine how many characters to scramble (1-2 characters)
        // More likely to scramble 1 character than 2
        const charsToScramble = Math.random() < 0.7 ? 1 : 2;

        // Randomly select positions to scramble
        for (let i = 0; i < charsToScramble; i++) {
          const position = Math.floor(Math.random() * text.length);
          // Only scramble if the character isn't already correct
          if (currentArray[position] === textArray[position]) {
            currentArray[position] = getRandomChar();
          }
        }

        // Count how many characters are correct
        stableCount = 0;
        for (let i = 0; i < text.length; i++) {
          if (currentArray[i] === textArray[i]) {
            stableCount++;
          }
        }

        return currentArray.join("");
      });

      iteration++;

      // When all characters are correct or we've reached max iterations, stop scrambling
      if (stableCount === text.length || iteration >= maxIterations * 5) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
        setClassName(normalClassName);
      }
    }, scrambleSpeed);
  };

  // Trigger scramble on hover
  const handleMouseEnter = () => {
    // Clear any existing timeouts
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    startScramble();
  };

  // Handle mouse leave - stop scrambling and reset to original text
  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setDisplayText(text);
    setIsScrambling(false);
    setClassName(normalClassName);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    };
  }, []);

  return (
    <span
      className={`${className} transition-colors duration-300`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </span>
  );
}
