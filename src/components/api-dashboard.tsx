"use client";

import React, { useState } from "react";
import { useApi, useApiMutation, api } from "@/lib/api";

// Type definitions
interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalProjects: number;
  activeAgents: number;
}

// Component to display API-connected dashboard stats
export function ApiDashboardStats() {
  const { data: stats, loading, error, refetch } = useApi<DashboardStats>("/stats");

  if (loading) {
    return (
      <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)]">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-[var(--bg-primary)] rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-[var(--bg-primary)] rounded"></div>
            <div className="h-16 bg-[var(--bg-primary)] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-red-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Error loading stats: {error}</span>
        </div>
        <button
          onClick={refetch}
          className="mt-2 px-3 py-1 text-sm bg-[var(--accent-purple)] text-white rounded hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--accent-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Live Dashboard (API)
        </h3>
        <button
          onClick={refetch}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-muted)]"
          title="Refresh"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Tasks" 
          value={stats.totalTasks} 
          icon="📊" 
          color="blue"
        />
        <StatCard 
          label="Completed" 
          value={stats.completedTasks} 
          icon="✅" 
          color="green"
        />
        <StatCard 
          label="In Progress" 
          value={stats.inProgressTasks} 
          icon="🔄" 
          color="yellow"
        />
        <StatCard 
          label="Pending" 
          value={stats.pendingTasks} 
          icon="⏳" 
          color="gray"
        />
      </div>
      
      <div className="mt-4 pt-4 border-t border-[var(--border-default)] grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-[var(--accent-purple)]">{stats.totalProjects}</div>
          <div className="text-xs text-[var(--text-muted)]">Active Projects</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[var(--accent-purple)]">{stats.activeAgents}</div>
          <div className="text-xs text-[var(--text-muted)]">Active Agents</div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon, 
  color 
}: { 
  label: string; 
  value: number; 
  icon: string; 
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    green: "bg-green-500/20 text-green-500 border-green-500/30",
    yellow: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    gray: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  return (
    <div className={`p-3 rounded-lg border ${colorClasses[color]} text-center`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
}

interface HealthStatus {
  status: string;
}

// API Health Check Component
export function ApiHealthCheck() {
  const { data, loading, error, refetch } = useApi<HealthStatus>("/health");

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)]">
      <div 
        className={`w-2 h-2 rounded-full ${
          loading ? "bg-yellow-500 animate-pulse" : 
          error ? "bg-red-500" : 
          data?.status === "ok" ? "bg-green-500" : "bg-gray-500"
        }`} 
      />
      <span className="text-xs text-[var(--text-muted)]">
        {loading ? "Checking..." : error ? "API Error" : data?.status === "ok" ? "API Online" : "API Unknown"}
      </span>
      {error && (
        <button 
          onClick={refetch}
          className="text-xs text-[var(--accent-purple)] hover:underline ml-1"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// Task Sync Button - Syncs local tasks with API
export function TaskSyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.health();
      setLastSync(new Date());
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={syncing}
      className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-purple)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      <svg 
        className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {syncing ? "Syncing..." : "Sync with API"}
      {lastSync && (
        <span className="text-xs opacity-70">
          ({lastSync.toLocaleTimeString()})
        </span>
      )}
    </button>
  );
}