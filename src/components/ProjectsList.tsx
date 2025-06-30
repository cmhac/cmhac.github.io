"use client";

import { useState, useMemo } from "react";
import type { Project } from "@/utils/projects";
import ProjectCard from "./ProjectCard";
import TechnologyFilter from "./TechnologyFilter";

interface ProjectsListProps {
  projects: Project[];
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { uniqueTechnologies, technologyCounts } = useMemo(() => {
    // Count frequency of each technology
    const techCount = new Map<string, number>();
    projects.forEach((project) => {
      project.technologies.forEach((tech) => {
        techCount.set(tech, (techCount.get(tech) || 0) + 1);
      });
    });

    // Convert to array and sort by frequency (descending) then alphabetically
    const sortedTechs = Array.from(techCount.entries())
      .sort(([techA, countA], [techB, countB]) => {
        if (countA !== countB) {
          return countB - countA; // Sort by frequency first
        }
        return techA.localeCompare(techB); // Then alphabetically
      })
      .map(([tech]) => tech);

    // Convert Map to plain object for easier access in TechnologyFilter
    const countsObject = Object.fromEntries(techCount.entries());

    return {
      uniqueTechnologies: sortedTechs,
      technologyCounts: countsObject,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((project) => {
        const searchableContent = [
          project.title,
          project.description,
          ...project.technologies,
        ]
          .join(" ")
          .toLowerCase();
        return searchableContent.includes(query);
      });
    }

    // Apply technology filter
    if (selectedTechnology) {
      filtered = filtered.filter((project) =>
        project.technologies.includes(selectedTechnology),
      );
    }

    return filtered;
  }, [projects, selectedTechnology, searchQuery]);

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-terminal-selection/30 border border-terminal-selection rounded-lg text-terminal-text font-mono text-sm focus:outline-none focus:border-terminal-purple focus:bg-terminal-selection/50 transition-colors"
        />
      </div>
      <TechnologyFilter
        technologies={uniqueTechnologies}
        technologyCounts={technologyCounts}
        selectedTechnology={selectedTechnology}
        onTechnologySelect={setSelectedTechnology}
      />
      <div className="flex flex-col space-y-8" data-testid="projects-list">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
