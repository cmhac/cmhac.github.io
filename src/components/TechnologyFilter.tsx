"use client";

import { useState } from "react";

interface TechnologyFilterProps {
  technologies: string[];
  selectedTechnology: string | null;
  onTechnologySelect: (technology: string | null) => void;
}

export default function TechnologyFilter({
  technologies,
  selectedTechnology,
  onTechnologySelect,
}: TechnologyFilterProps) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-mono text-terminal-comment mb-3">
        filter by tool or technique
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTechnologySelect(null)}
          className={`px-3 py-1 rounded-full text-sm font-mono transition-colors ${
            selectedTechnology === null
              ? "bg-terminal-purple text-terminal-text"
              : "bg-terminal-selection/50 text-terminal-text/80 hover:bg-terminal-selection hover:text-terminal-text"
          }`}
        >
          all
        </button>
        {technologies.map((tech) => (
          <button
            key={tech}
            onClick={() => onTechnologySelect(tech)}
            className={`px-3 py-1 rounded-full text-sm font-mono transition-colors ${
              selectedTechnology === tech
                ? "bg-terminal-purple text-terminal-text"
                : "bg-terminal-selection/50 text-terminal-text/80 hover:bg-terminal-selection hover:text-terminal-text"
            }`}
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  );
}
