"use client";

import React, { useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed" | "archived";
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const PROJECT_COLORS = [
  { value: "#a78bfa", label: "Púrpura" },
  { value: "#60a5fa", label: "Azul" },
  { value: "#34d399", label: "Verde" },
  { value: "#fbbf24", label: "Ámbar" },
  { value: "#f87171", label: "Rojo" },
  { value: "#a1a1aa", label: "Gris" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Activo" },
  { value: "paused", label: "Pausado" },
  { value: "completed", label: "Completado" },
  { value: "archived", label: "Archivado" },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Nexus Platform",
    description: "Plataforma de colaboración para equipos distribuidos",
    status: "active",
    color: "#a78bfa",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    description: "",
    status: "active",
    color: "#a78bfa",
  });

  const filteredProjects = filterStatus
    ? projects.filter((p) => p.status === filterStatus)
    : projects;

  const handleCreateProject = () => {
    if (!formData.name) return;

    const newProject: Project = {
      id: "proj-" + Date.now(),
      name: formData.name || "",
      description: formData.description || "",
      status: (formData.status as Project["status"]) || "active",
      color: formData.color || "#a78bfa",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects([...projects, newProject]);
    resetForm();
    setIsModalOpen(false);
  };

  const handleUpdateProject = () => {
    if (!editingProject || !formData.name) return;

    setProjects(
      projects.map((p) =>
        p.id === editingProject.id
          ? {
              ...p,
              name: formData.name || p.name,
              description: formData.description || p.description,
              status: (formData.status as Project["status"]) || p.status,
              color: formData.color || p.color,
              updatedAt: new Date(),
            }
          : p
      )
    );
    closeModal();
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("¿Estás seguro de eliminar este proyecto?")) {
      setProjects(projects.filter((p) => p.id !== projectId));
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingProject(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setIsEditMode(true);
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      color: project.color,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setIsEditMode(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "active",
      color: "#a78bfa",
    });
  };

  const getStatusBadge = (status: Project["status"]) => {
    const config = {
      active: { label: "Activo", className: "bg-green-500/20 text-green-400" },
      paused: { label: "Pausado", className: "bg-yellow-500/20 text-yellow-400" },
      completed: { label: "Completado", className: "bg-blue-500/20 text-blue-400" },
      archived: { label: "Archivado", className: "bg-gray-500/20 text-gray-400" },
    };
    const { label, className } = config[status];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Proyectos</h1>
          <p className="text-[var(--text-muted)]">
            Gestiona tus proyectos y organiza el trabajo de tu equipo
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-[var(--text-muted)]">Total Proyectos</p>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === "active").length}
            </div>
            <p className="text-xs text-[var(--text-muted)]">Activos</p>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === "completed").length}
            </div>
            <p className="text-xs text-[var(--text-muted)]">Completados</p>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === "archived").length}
            </div>
            <p className="text-xs text-[var(--text-muted)]">Archivados</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-lg font-medium bg-[var(--accent-purple)] text-white hover:opacity-90 transition-all"
          >
            + Nuevo Proyecto
          </button>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
          >
            <option value="">Todos los estados</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {isEditMode ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
                </h2>
                <button onClick={closeModal} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del Proyecto</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Nexus Platform"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el proyecto..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select
                      value={formData.status || "active"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Project["status"] })}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {PROJECT_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setFormData({ ...formData, color: color.value })}
                          className={`w-8 h-8 rounded-full border-2 ${
                            formData.color === color.value ? "border-white" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg font-medium border border-[var(--border-default)] hover:bg-[var(--bg-secondary)]"
                >
                  Cancelar
                </button>
                <button
                  onClick={isEditMode ? handleUpdateProject : handleCreateProject}
                  className="px-4 py-2 rounded-lg font-medium bg-[var(--accent-purple)] text-white hover:opacity-90"
                >
                  {isEditMode ? "Guardar Cambios" : "Crear Proyecto"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[var(--text-muted)]">
              <p>No hay proyectos que coincidan con el filtro</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>Creado: {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEditModal(project)}
                    className="px-4 py-2 rounded-lg font-medium border border-[var(--border-default)] hover:bg-[var(--bg-primary)]"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-[var(--border-default)] mt-8 pt-6">
          <p className="text-center text-sm text-[var(--text-muted)]">
            Gestiona tus proyectos de forma eficiente. Cada proyecto puede contener múltiples tareas.
          </p>
        </div>
      </div>
    </div>
  );
}
