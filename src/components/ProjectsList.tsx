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
    if (!selectedTechnology) return projects;
    return projects.filter((project) =>
      project.technologies.includes(selectedTechnology),
    );
  }, [projects, selectedTechnology]);

  return (
    <div>
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
