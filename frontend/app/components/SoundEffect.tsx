"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

const SoundEffect = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for background ambience
    const backgroundAudio = new Audio("/sounds/retro-ambience.mp3");
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.2;
    setAudio(backgroundAudio);

    // Cleanup
    return () => {
      if (backgroundAudio) {
        backgroundAudio.pause();
        backgroundAudio.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!audio) return;

    if (isMuted) {
      audio.pause();
    } else {
      // Play with user interaction to comply with browser autoplay policies
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Audio playback prevented by browser:", error);
        });
      }
    }
  }, [isMuted, audio]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-4 right-4 z-50 p-2 bg-gray-900 rounded-full border border-retro-green/30 hover:bg-gray-800 transition-colors"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-retro-green" />
      ) : (
        <Volume2 className="w-5 h-5 text-retro-green" />
      )}
    </button>
  );
};

export default SoundEffect;
