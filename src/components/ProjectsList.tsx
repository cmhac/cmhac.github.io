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

  const uniqueTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.technologies.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
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
