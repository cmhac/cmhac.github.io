"use client";

import { useState } from "react";

interface TechnologyFilterProps {
  technologies: string[];
  technologyCounts: Record<string, number>;
  selectedTechnology: string | null;
  onTechnologySelect: (technology: string | null) => void;
}

export default function TechnologyFilter({
  technologies,
  technologyCounts,
  selectedTechnology,
  onTechnologySelect,
}: TechnologyFilterProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedTechnologies =
    showAll || technologies.length <= 10
      ? technologies
      : technologies.slice(0, 10);

  const shouldShowToggle = technologies.length > 10;
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
        {displayedTechnologies.map((tech) => (
          <button
            key={tech}
            onClick={() => onTechnologySelect(tech)}
            className={`px-3 py-1 rounded-full text-sm font-mono transition-colors ${
              selectedTechnology === tech
                ? "bg-terminal-purple text-terminal-text"
                : "bg-terminal-selection/50 text-terminal-text/80 hover:bg-terminal-selection hover:text-terminal-text"
            }`}
          >
            {tech} ({technologyCounts[tech]})
          </button>
        ))}
        {shouldShowToggle && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-3 py-1 rounded-full text-sm font-mono transition-colors bg-terminal-selection/30 text-terminal-comment hover:bg-terminal-selection/50 hover:text-terminal-text border border-terminal-selection/50"
          >
            {showAll ? "show less" : "show more"}
          </button>
        )}
      </div>
    </div>
  );
}
