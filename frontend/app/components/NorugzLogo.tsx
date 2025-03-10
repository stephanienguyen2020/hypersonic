import { useEffect, useRef, useState } from "react";

// Matrix-style text scramble effect for the logo
class TextScramble {
  el: HTMLElement;
  chars: string;
  queue: Array<{
    from: string;
    to: string;
    start: number;
    end: number;
    char?: string;
  }>;
  frame: number;
  frameRequest: number;
  resolve: (value: void | PromiseLike<void>) => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#₿Ξ◎Ð₳₮";
    this.queue = [];
    this.frame = 0;
    this.frameRequest = 0;
    this.resolve = () => {};
    this.update = this.update.bind(this);
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

interface NorugzLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  color?: string;
  hoverColor?: string;
}

export function NorugzLogo({
  className = "",
  size = "lg",
  text = "NORUGZ",
  color = "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600",
  hoverColor = "text-white",
}: NorugzLogoProps) {
  const logoRef = useRef<HTMLSpanElement>(null);
  const scramblerRef = useRef<TextScramble | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Initialize text scramble effect for logo
  useEffect(() => {
    if (logoRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScramble(logoRef.current);
      setMounted(true);
    }
  }, []);

  // Apply text scramble effect on hover
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (scramblerRef.current) {
      scramblerRef.current.setText(text);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Determine text size based on size prop
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl md:text-6xl",
    xl: "text-5xl md:text-7xl",
  };

  return (
    <span
      ref={logoRef}
      className={`font-bold font-pixel ${sizeClasses[size]} ${
        isHovering ? hoverColor : color
      } ${className}`}
      style={{ textShadow: "0 0 5px rgba(74, 222, 128, 0.7)" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </span>
  );
}
