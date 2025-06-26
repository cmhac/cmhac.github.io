"use client";

import { useEffect, useState } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function KonamiCode() {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      setKeys((prevKeys) => {
        const updatedKeys = [...prevKeys, key];

        // Keep only the last N keys where N is the length of the Konami code
        if (updatedKeys.length > KONAMI_CODE.length) {
          updatedKeys.shift();
        }

        // Check if the sequence matches
        const match = KONAMI_CODE.every(
          (code, index) => code.toLowerCase() === updatedKeys[index],
        );

        if (match) {
          window.open(
            "https://portfolio-site-cms.vercel.app/cmhac/cmhac.github.io/main/collection/projects",
            "_blank",
          );
        }

        return updatedKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // This component doesn't render anything visible
  return null;
}
