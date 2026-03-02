"use client";

import React, { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_PROJECTS: Project[] = [
  { id: "all", name: "Todos los proyectos", color: "#a78bfa" },
  { id: "proj-1", name: "Nexus Platform", color: "#a78bfa" },
  { id: "proj-2", name: "Website Redesign", color: "#60a5fa" },
];

export default function ProjectSelector() {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nexus_selected_project");
    if (saved) {
      setSelectedProject(saved);
    }

    const savedProjects = localStorage.getItem("nexus_projects");
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        setProjects([DEFAULT_PROJECTS[0], ...parsed]);
      } catch {
        setProjects(DEFAULT_PROJECTS);
      }
    }
  }, []);

  const handleSelect = (projectId: string) => {
    setSelectedProject(projectId);
    localStorage.setItem("nexus_selected_project", projectId);
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("projectChanged", { detail: projectId }));
  };

  const selectedProjectData = projects.find((p) => p.id === selectedProject) || projects[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] transition-colors text-sm"
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: selectedProjectData.color }}
        />
        <span className="max-w-[120px] truncate">{selectedProjectData.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-56 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] shadow-lg z-50 py-1">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleSelect(project.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--bg-primary)] transition-colors ${
                  selectedProject === project.id ? "bg-[var(--bg-primary)]" : ""
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span className="truncate">{project.name}</span>
                {selectedProject === project.id && (
                  <svg className="w-4 h-4 ml-auto text-[var(--accent-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
