"use client";

import { useState, useEffect, useCallback } from "react";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.nexus.thinkmonic.com/v1";

// Types
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// Generic fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      code: "UNKNOWN_ERROR",
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
    message: response.statusText,
  };
}

// Hook for fetching data with loading and error states
export function useApi<T>(
  endpoint: string | null,
  options?: RequestInit
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<T>(endpoint, options);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for mutations (POST, PUT, DELETE)
export function useApiMutation<T, P = unknown>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" | "PATCH" = "POST"
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (payload?: P) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<T>(endpoint, {
        method,
        body: payload ? JSON.stringify(payload) : undefined,
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, method]);

  return { mutate, data, loading, error };
}

// Specific API functions for common operations
export const api = {
  // Tasks
  getTasks: () => apiFetch<Task[]>("/tasks"),
  getTask: (id: string) => apiFetch<Task>(`/tasks/${id}`),
  createTask: (task: Partial<Task>) => 
    apiFetch<Task>("/tasks", { method: "POST", body: JSON.stringify(task) }),
  updateTask: (id: string, task: Partial<Task>) =>
    apiFetch<Task>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(task) }),
  deleteTask: (id: string) =>
    apiFetch<void>(`/tasks/${id}`, { method: "DELETE" }),
  
  // Projects
  getProjects: () => apiFetch<Project[]>("/projects"),
  getProject: (id: string) => apiFetch<Project>(`/projects/${id}`),
  
  // Agents
  getAgents: () => apiFetch<Agent[]>("/agents"),
  getAgent: (id: string) => apiFetch<Agent>(`/agents/${id}`),
  
  // Statistics
  getStats: () => apiFetch<DashboardStats>("/stats"),
  
  // Health check
  health: () => apiFetch<{ status: string }>("/health"),
};

// Types (extended from existing types)
interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "done";
  priority: "low" | "medium" | "high";
  tags: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  assignee?: string;
  project?: string;
  dependencies?: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed" | "archived";
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface Agent {
  id: string;
  name: string;
  role: "researcher" | "developer" | "designer" | "writer" | "analyzer" | "coordinator";
  status: "active" | "inactive" | "busy" | "maintenance";
  capabilities: string[];
  projects: string[];
}

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalProjects: number;
  activeAgents: number;
}

export { API_BASE_URL };
export type { ApiResponse, ApiError, Task, Project, Agent, DashboardStats };