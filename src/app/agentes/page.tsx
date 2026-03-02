"use client";

import React, { useState } from "react";

interface Agent {
  id: string;
  name: string;
  role: "researcher" | "developer" | "designer" | "writer" | "analyzer" | "coordinator";
  status: "active" | "inactive" | "busy" | "maintenance";
  description: string;
  capabilities: string[];
  projects: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AGENT_ROLES = [
  { value: "researcher", label: "Investigador", color: "#60a5fa" },
  { value: "developer", label: "Desarrollador", color: "#34d399" },
  { value: "designer", label: "Diseñador", color: "#f472b6" },
  { value: "writer", label: "Escritor", color: "#fbbf24" },
  { value: "analyzer", label: "Analista", color: "#a78bfa" },
  { value: "coordinator", label: "Coordinador", color: "#f87171" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Activo", color: "#22c55e" },
  { value: "inactive", label: "Inactivo", color: "#6b7280" },
  { value: "busy", label: "Ocupado", color: "#f59e0b" },
  { value: "maintenance", label: "Mantenimiento", color: "#ef4444" },
];

const CAPABILITIES = [
  "Investigación",
  "Desarrollo de código",
  "Diseño UI/UX",
  "Redacción",
  "Análisis de datos",
  "Coordinación",
  "Testing",
  "Documentación",
  "Revisión de código",
  "Brainstorming",
];

const INITIAL_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Horizon",
    role: "researcher",
    status: "active",
    description: "Especialista en investigación y diseño UI/UX",
    capabilities: ["Investigación", "Diseño UI/UX", "Brainstorming"],
    projects: ["proj-1"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "agent-2",
    name: "Prism",
    role: "designer",
    status: "busy",
    description: "Diseñador UI/UX y desarrollador frontend",
    capabilities: ["Diseño UI/UX", "Desarrollo de código", "Testing"],
    projects: ["proj-1", "proj-2"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("");

  const [formData, setFormData] = useState<Partial<Agent>>({
    name: "",
    role: "researcher",
    status: "active",
    description: "",
    capabilities: [],
    projects: [],
  });

  const filteredAgents = agents.filter((a) => {
    if (filterStatus && a.status !== filterStatus) return false;
    if (filterRole && a.role !== filterRole) return false;
    return true;
  });

  const handleCreateAgent = () => {
    if (!formData.name) return;

    const newAgent: Agent = {
      id: "agent-" + Date.now(),
      name: formData.name || "",
      role: (formData.role as Agent["role"]) || "researcher",
      status: (formData.status as Agent["status"]) || "active",
      description: formData.description || "",
      capabilities: formData.capabilities || [],
      projects: formData.projects || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAgents([...agents, newAgent]);
    resetForm();
    setIsModalOpen(false);
  };

  const handleUpdateAgent = () => {
    if (!editingAgent || !formData.name) return;

    setAgents(
      agents.map((a) =>
        a.id === editingAgent.id
          ? {
              ...a,
              name: formData.name || a.name,
              role: (formData.role as Agent["role"]) || a.role,
              status: (formData.status as Agent["status"]) || a.status,
              description: formData.description || a.description,
              capabilities: formData.capabilities || a.capabilities,
              projects: formData.projects || a.projects,
              updatedAt: new Date(),
            }
          : a
      )
    );
    closeModal();
  };

  const handleDeleteAgent = (agentId: string) => {
    if (confirm("¿Estás seguro de eliminar este agente?")) {
      setAgents(agents.filter((a) => a.id !== agentId));
    }
  };

  const toggleCapability = (cap: string) => {
    const current = formData.capabilities || [];
    if (current.includes(cap)) {
      setFormData({ ...formData, capabilities: current.filter((c) => c !== cap) });
    } else {
      setFormData({ ...formData, capabilities: [...current, cap] });
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingAgent(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (agent: Agent) => {
    setIsEditMode(true);
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      role: agent.role,
      status: agent.status,
      description: agent.description,
      capabilities: agent.capabilities,
      projects: agent.projects,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAgent(null);
    setIsEditMode(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "researcher",
      status: "active",
      description: "",
      capabilities: [],
      projects: [],
    });
  };

  const getRoleConfig = (role: Agent["role"]) => {
    return AGENT_ROLES.find((r) => r.value === role) || AGENT_ROLES[0];
  };

  const getStatusConfig = (status: Agent["status"]) => {
    return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  };

  const getStatusBadge = (status: Agent["status"]) => {
    const config = {
      active: { label: "Activo", className: "bg-green-500/20 text-green-400" },
      inactive: { label: "Inactivo", className: "bg-gray-500/20 text-gray-400" },
      busy: { label: "Ocupado", className: "bg-yellow-500/20 text-yellow-400" },
      maintenance: { label: "Mantenimiento", className: "bg-red-500/20 text-red-400" },
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
          <h1 className="text-3xl font-bold mb-2">Gestión de Agentes</h1>
          <p className="text-[var(--text-muted)]">
            Administra los agentes de IA que colaboran en tus proyectos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-[var(--text-muted)]">Total Agentes</p>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
            <div className="text-2xl font-bold">
              {agents.filter((a) => a.status === "active").length}
            </div>
            <p className="text-xs text-[var(--text-muted)]">Activos</p>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
            <div className="text-2xl font-bold">
              {agents.filter((a) => a.status === "busy").length}
            </div>
            <p className="text-xs text-[var(--text-muted)]">Ocupados</p>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4">
            <div className="text-2xl font-bold">
              {agents.filter((a) => a.status === "inactive").length}
            </div>
            <p className="text-xs text-[var(--text-muted)]">Inactivos</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-lg font-medium bg-[var(--accent-purple)] text-white hover:opacity-90 transition-all"
          >
            + Nuevo Agente
          </button>
          <div className="flex gap-2">
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
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
            >
              <option value="">Todos los roles</option>
              {AGENT_ROLES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {isEditMode ? "Editar Agente" : "Crear Nuevo Agente"}
                </h2>
                <button onClick={closeModal} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del Agente</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Horizon"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rol</label>
                    <select
                      value={formData.role || "researcher"}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as Agent["role"] })}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      {AGENT_ROLES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <select
                      value={formData.status || "active"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Agent["status"] })}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe las funciones del agente..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Capacidades</label>
                  <div className="flex flex-wrap gap-2">
                    {CAPABILITIES.map((cap) => (
                      <button
                        key={cap}
                        onClick={() => toggleCapability(cap)}
                        className={`px-3 py-1 rounded-full text-sm border transition-all ${
                          (formData.capabilities || []).includes(cap)
                            ? "bg-[var(--accent-purple)] text-white border-[var(--accent-purple)]"
                            : "border-[var(--border-default)] hover:bg-[var(--bg-primary)]"
                        }`}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[var(--border-default)]">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg font-medium border border-[var(--border-default)] hover:bg-[var(--bg-secondary)]"
                >
                  Cancelar
                </button>
                <button
                  onClick={isEditMode ? handleUpdateAgent : handleCreateAgent}
                  className="px-4 py-2 rounded-lg font-medium bg-[var(--accent-purple)] text-white hover:opacity-90"
                >
                  {isEditMode ? "Guardar Cambios" : "Crear Agente"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[var(--text-muted)]">
              <p>No hay agentes que coincidan con los filtros</p>
            </div>
          ) : (
            filteredAgents.map((agent) => {
              const roleConfig = getRoleConfig(agent.role);
              return (
                <div
                  key={agent.id}
                  className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: roleConfig.color }}
                      >
                        {agent.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                        <p className="text-xs text-[var(--text-muted)]">{roleConfig.label}</p>
                      </div>
                    </div>
                    {getStatusBadge(agent.status)}
                  </div>

                  <p className="text-sm text-[var(--text-muted)] mb-3 line-clamp-2">
                    {agent.description || "Sin descripción"}
                  </p>

                  <div className="mb-3">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Capacidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.slice(0, 3).map((cap) => (
                        <span
                          key={cap}
                          className="px-2 py-0.5 rounded text-xs bg-[var(--bg-primary)] text-[var(--text-secondary)]"
                        >
                          {cap}
                        </span>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <span className="px-2 py-0.5 rounded text-xs text-[var(--text-muted)]">
                          +{agent.capabilities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-3">
                    <span>Proyectos: {agent.projects.length}</span>
                    <span>{new Date(agent.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(agent)}
                      className="flex-1 px-4 py-2 rounded-lg font-medium border border-[var(--border-default)] hover:bg-[var(--bg-primary)]"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteAgent(agent.id)}
                      className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-[var(--border-default)] mt-8 pt-6">
          <p className="text-center text-sm text-[var(--text-muted)]">
            Gestiona tus agentes de IA para optimizar la colaboración en proyectos.
          </p>
        </div>
      </div>
    </div>
  );
}
