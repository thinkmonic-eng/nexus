"use client";

import React, { useState, useEffect } from "react";
import { ApiDashboardStats, ApiHealthCheck, TaskSyncButton } from "@/components/api-dashboard";
import { WebhookManager } from "@/components/webhook-manager";
import { triggerWebhooksForEvent } from "@/lib/webhooks";

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "done";
  priority: "low" | "medium" | "high";
  tags: string[];
  createdAt: Date;
  dueDate?: Date;
  assignee?: string;
  project?: string;
  contract?: string;
  execution?: string;
  dependencies?: string[];
}

interface Activity {
  id: string;
  taskId: string;
  action: string;
  timestamp: Date;
  user: string;
}

// Action History for Undo/Redo - Issue #9
interface Action {
  id: string;
  type: "create" | "update" | "delete";
  task: Task;
  previousTask?: Task;
  timestamp: Date;
}

interface Column {
  id: string;
  title: string;
  status: "todo" | "inprogress" | "done";
  color: string;
}

const COLUMNS: Column[] = [
  { id: "col-1", title: "To Do", status: "todo", color: "bg-slate-500" },
  { id: "col-2", title: "In Progress", status: "inprogress", color: "bg-blue-500" },
  { id: "col-3", title: "Done", status: "done", color: "bg-green-500" },
];

const PRIORITIES = {
  low: { label: "Low", color: "bg-slate-500" },
  medium: { label: "Medium", color: "bg-yellow-500" },
  high: { label: "High", color: "bg-red-500" },
};

// Sample initial tasks
const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Design system setup",
    description: "Create design tokens and component library",
    status: "done",
    priority: "high",
    tags: ["design", "foundation"],
    createdAt: new Date(),
    assignee: "John Doe",
    project: "Nexus",
  },
  {
    id: "task-2",
    title: "Implement authentication",
    description: "Add login and signup functionality",
    status: "inprogress",
    priority: "high",
    tags: ["feature", "auth"],
    createdAt: new Date(),
    assignee: "Jane Smith",
    project: "Nexus",
  },
  {
    id: "task-3",
    title: "Create landing page",
    description: "Build hero section and features showcase",
    status: "todo",
    priority: "medium",
    tags: ["frontend", "marketing"],
    createdAt: new Date(),
    assignee: "Bob Johnson",
    project: "Website",
  },
  {
    id: "task-4",
    title: "Write documentation",
    description: "Document API endpoints and components",
    status: "todo",
    priority: "low",
    tags: ["docs"],
    createdAt: new Date(),
    project: "Nexus",
  },
];

// Simple Button Component
function Button({
  children,
  onClick,
  variant = "default",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  disabled?: boolean;
}) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-[var(--accent-purple)] text-white hover:opacity-90",
    outline: "border border-[var(--border-default)] hover:bg-[var(--bg-secondary)]",
    ghost: "hover:bg-[var(--bg-secondary)]",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

// Simple Input Component
function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)]"
    />
  );
}

// Simple Textarea Component
function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)] resize-none"
    />
  );
}

// Simple Select Component
function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-purple)]"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// Simple Card Component
function Card({
  children,
  className = "",
  draggable = false,
  onDragStart,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  draggable?: boolean;
  onDragStart?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      style={style}
      className={`rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] ${className}`}
    >
      {children}
    </div>
  );
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-4 pt-4 pb-2 ${className}`}>{children}</div>;
}

// Simple Badge Component
function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}) {
  const variants = {
    default: "bg-[var(--accent-purple)] text-white",
    secondary: "bg-[var(--bg-primary)] text-[var(--text-secondary)]",
    outline: "border border-[var(--border-default)]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Dialog Component
function Dialog({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-6 shadow-2xl">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

// Icons
function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 transition-transform ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// Undo/Redo Icons - Issue #9
function UndoIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
    </svg>
  );
}

// Cycle detection using DFS - Issue #10

function detectCycle(tasks: Task[], fromTaskId: string, toTaskId: string): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(taskId: string): boolean {
    visited.add(taskId);
    recursionStack.add(taskId);

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.dependencies) {
      for (const depId of task.dependencies) {
        if (!visited.has(depId)) {
          if (hasCycle(depId)) return true;
        } else if (recursionStack.has(depId)) {
          return true;
        }
      }
    }

    recursionStack.delete(taskId);
    return false;
  }

  // Temporarily add the dependency to check for cycle
  const tempTasks = tasks.map((t) =>
    t.id === fromTaskId
      ? { ...t, dependencies: [...(t.dependencies || []), toTaskId] }
      : t
  );

  return hasCycle(fromTaskId);
}

// Check if a task is blocked (has uncompleted dependencies)
function isTaskBlocked(task: Task, allTasks: Task[]): boolean {
  if (!task.dependencies || task.dependencies.length === 0) return false;
  
  return task.dependencies.some((depId) => {
    const depTask = allTasks.find((t) => t.id === depId);
    return depTask && depTask.status !== "done";
  });
}

// SlideOver Component for Editing Tasks
function SlideOver({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
  allTasks,
}: {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
  allTasks: Task[];
}) {
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    contract: false,
    execution: false,
    activity: false,
    dependencies: false,
  });

  useEffect(() => {
    if (task) {
      setFormData({ ...task });
      setHasChanges(false);
    }
  }, [task, isOpen]);

  const handleChange = (field: keyof Task, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (task && formData.title) {
      onSave({ ...task, ...formData } as Task);
      setHasChanges(false);
    }
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!isOpen || !task) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 w-[480px] max-w-full bg-[var(--bg-secondary)] border-l border-[var(--border-default)] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-3">
            <Select
              value={formData.status || "todo"}
              onChange={(value) => handleChange("status", value)}
              options={[
                { value: "todo", label: "To Do" },
                { value: "inprogress", label: "In Progress" },
                { value: "done", label: "Done" },
              ]}
            />
            {hasChanges && (
              <Badge variant="default" className="animate-pulse">
                Unsaved
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              <TrashIcon />
            </Button>
            <Button variant="ghost" onClick={onClose}>
              <XIcon />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Task description"
              rows={4}
            />
          </div>

          {/* Main Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <Select
                value={formData.priority || "medium"}
                onChange={(value) => handleChange("priority", value)}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Assignee</label>
              <Input
                value={formData.assignee || ""}
                onChange={(e) => handleChange("assignee", e.target.value)}
                placeholder="Assignee name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Due Date</label>
              <Input
                type="date"
                value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ""}
                onChange={(e) => handleChange("dueDate", e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Project</label>
              <Input
                value={formData.project || ""}
                onChange={(e) => handleChange("project", e.target.value)}
                placeholder="Project name"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <Input
              value={formData.tags?.join(", ") || ""}
              onChange={(e) =>
                handleChange(
                  "tags",
                  e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                )
              }
              placeholder="design, urgent, review"
            />
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-2">
            {/* Task Contract */}
            <div className="border border-[var(--border-default)] rounded-lg">
              <button
                onClick={() => toggleSection("contract")}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-primary)]/50 transition-colors"
              >
                <span className="font-medium">Task Contract</span>
                <ChevronDownIcon className={expandedSections.contract ? "rotate-180" : ""} />
              </button>
              {expandedSections.contract && (
                <div className="px-4 pb-4">
                  <Textarea
                    value={formData.contract || ""}
                    onChange={(e) => handleChange("contract", e.target.value)}
                    placeholder="Define the contract/acceptance criteria for this task..."
                    rows={4}
                  />
                </div>
              )}
            </div>

            {/* Execution */}
            <div className="border border-[var(--border-default)] rounded-lg">
              <button
                onClick={() => toggleSection("execution")}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-primary)]/50 transition-colors"
              >
                <span className="font-medium">Execution Notes</span>
                <ChevronDownIcon className={expandedSections.execution ? "rotate-180" : ""} />
              </button>
              {expandedSections.execution && (
                <div className="px-4 pb-4">
                  <Textarea
                    value={formData.execution || ""}
                    onChange={(e) => handleChange("execution", e.target.value)}
                    placeholder="Notes about execution, implementation details..."
                    rows={4}
                  />
                </div>
              )}
            </div>

            {/* Activity */}
            <div className="border border-[var(--border-default)] rounded-lg">
              <button
                onClick={() => toggleSection("activity")}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-primary)]/50 transition-colors"
              >
                <span className="font-medium">Activity Log</span>
                <ChevronDownIcon className={expandedSections.activity ? "rotate-180" : ""} />
              </button>
              {expandedSections.activity && (
                <div className="px-4 pb-4 space-y-2">
                  <div className="text-sm text-[var(--text-muted)]">
                    <p>• Task created on {task.createdAt.toLocaleDateString()}</p>
                    <p>• Last updated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Dependencies */}
            <div className="border border-[var(--border-default)] rounded-lg">
              <button
                onClick={() => toggleSection("dependencies")}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-primary)]/50 transition-colors"
              >
                <span className="font-medium flex items-center gap-2">
                  Dependencies
                  {(formData.dependencies?.length || 0) > 0 && (
                    <Badge variant="default">{formData.dependencies?.length}</Badge>
                  )}
                </span>
                <ChevronDownIcon className={expandedSections.dependencies ? "rotate-180" : ""} />
              </button>
              {expandedSections.dependencies && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-[var(--text-muted)]">
                    Select tasks that must be completed before this task can start.
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allTasks
                      .filter((t) => t.id !== task.id)
                      .map((t) => {
                        const isSelected = formData.dependencies?.includes(t.id);
                        const wouldCreateCycle = isSelected && detectCycle(allTasks, task.id, t.id);
                        return (
                          <label
                            key={t.id}
                            className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                              isSelected
                                ? wouldCreateCycle
                                  ? "border-red-500 bg-red-500/10"
                                  : "border-[var(--accent-purple)] bg-[var(--accent-purple)]/10"
                                : "border-[var(--border-default)] hover:bg-[var(--bg-primary)]/50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const currentDeps = formData.dependencies || [];
                                if (e.target.checked) {
                                  // Check for cycle before adding
                                  if (detectCycle(allTasks, task.id, t.id)) {
                                    alert(`Cannot add "${t.title}" as a dependency - it would create a circular dependency!`);
                                    return;
                                  }
                                  handleChange("dependencies", [...currentDeps, t.id]);
                                } else {
                                  handleChange(
                                    "dependencies",
                                    currentDeps.filter((id) => id !== t.id)
                                  );
                                }
                              }}
                              className="rounded border-[var(--border-default)]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{t.title}</p>
                              <p className="text-xs text-[var(--text-muted)]">
                                {t.status === "done" ? "✅ Completed" : t.status === "inprogress" ? "🔄 In Progress" : "⏳ To Do"}
                              </p>
                            </div>
                            {wouldCreateCycle && (
                              <span className="text-xs text-red-500">⚠️ Cycle</span>
                            )}
                          </label>
                        );
                      })}
                  </div>
                  {formData.dependencies && formData.dependencies.length > 0 && (
                    <div className="pt-2 border-t border-[var(--border-default)]">
                      <p className="text-sm font-medium mb-2">Selected dependencies:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.dependencies.map((depId) => {
                          const depTask = allTasks.find((t) => t.id === depId);
                          return depTask ? (
                            <Badge key={depId} variant="secondary" className="flex items-center gap-1">
                              {depTask.title}
                              <button
                                onClick={() => {
                                  handleChange(
                                    "dependencies",
                                    formData.dependencies?.filter((id) => id !== depId) || []
                                  );
                                }}
                                className="ml-1 hover:text-red-500"
                              >
                                ×
                              </button>
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border-default)] px-6 py-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            {hasChanges ? "Save Changes" : "Saved"}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Task?</h3>
            <p className="text-[var(--text-muted)] mb-4">
              Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string>("");
  
  // Action History for Undo/Redo - Issue #9
  const [actionHistory, setActionHistory] = useState<Action[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const MAX_HISTORY = 50;

  // Form state
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    tags: [],
  });

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter(
      (task) =>
        task.status === status &&
        (filterTag === "" || task.tags.includes(filterTag))
    );
  };

  const handleCreateTask = () => {
    if (!formData.title) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: formData.title || "",
      description: formData.description || "",
      status: formData.status || "todo",
      priority: formData.priority || "medium",
      tags: formData.tags || [],
      createdAt: new Date(),
    };

    // Add to action history for undo - Issue #9
    const action: Action = {
      id: `action-${Date.now()}`,
      type: "create",
      task: newTask,
      timestamp: new Date(),
    };

    const newHistory = actionHistory.slice(0, historyIndex + 1);
    newHistory.push(action);
    
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
      setHistoryIndex(newHistory.length - 1);
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    
    setActionHistory(newHistory);
    setTasks([...tasks, newTask]);
    
    // Trigger webhooks - Issue #15
    triggerWebhooksForEvent("task.created", newTask);
    
    resetForm();
    setIsCreateOpen(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const previousTask = tasks.find((t) => t.id === updatedTask.id);
    if (!previousTask) return;

    // Add to action history for undo - Issue #9
    const action: Action = {
      id: `action-${Date.now()}`,
      type: "update",
      task: updatedTask,
      previousTask: previousTask,
      timestamp: new Date(),
    };

    const newHistory = actionHistory.slice(0, historyIndex + 1);
    newHistory.push(action);
    
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
      setHistoryIndex(newHistory.length - 1);
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    
    setActionHistory(newHistory);

    setTasks(
      tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    
    // Trigger webhooks - Issue #15
    const statusChanged = previousTask.status !== updatedTask.status;
    if (statusChanged) {
      triggerWebhooksForEvent("task.status_changed", updatedTask);
    }
    triggerWebhooksForEvent("task.updated", updatedTask);
    
    setEditingTask(null);
    setIsEditOpen(false);
    resetForm();
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;

    // Add to action history for undo - Issue #9
    const action: Action = {
      id: `action-${Date.now()}`,
      type: "delete",
      task: taskToDelete,
      timestamp: new Date(),
    };

    const newHistory = actionHistory.slice(0, historyIndex + 1);
    newHistory.push(action);
    
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
      setHistoryIndex(newHistory.length - 1);
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    
    setActionHistory(newHistory);
    
    setTasks(tasks.filter((task) => task.id !== taskId));
    
    // Trigger webhooks - Issue #15
    triggerWebhooksForEvent("task.deleted", taskToDelete);
  };

  // Undo function - Issue #9
  const handleUndo = () => {
    if (historyIndex < 0) return;

    const action = actionHistory[historyIndex];
    
    switch (action.type) {
      case "delete":
        // Restore deleted task
        setTasks((prev) => [...prev, action.task]);
        break;
      case "create":
        // Remove created task
        setTasks((prev) => prev.filter((t) => t.id !== action.task.id));
        break;
      case "update":
        // Revert to previous state
        if (action.previousTask) {
          setTasks((prev) =>
            prev.map((t) => (t.id === action.previousTask!.id ? action.previousTask! : t))
          );
        }
        break;
    }

    setHistoryIndex(historyIndex - 1);
  };

  // Redo function - Issue #9
  const handleRedo = () => {
    if (historyIndex >= actionHistory.length - 1) return;

    const nextIndex = historyIndex + 1;
    const action = actionHistory[nextIndex];

    switch (action.type) {
      case "delete":
        setTasks((prev) => prev.filter((t) => t.id !== action.task.id));
        break;
      case "create":
        setTasks((prev) => [...prev, action.task]);
        break;
      case "update":
        setTasks((prev) =>
          prev.map((t) => (t.id === action.task.id ? action.task : t))
        );
        break;
    }

    setHistoryIndex(nextIndex);
  };

  // Keyboard shortcuts for undo/redo - Issue #9
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, actionHistory]);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    if (!draggedTask) return;

    setTasks(
      tasks.map((task) =>
        task.id === draggedTask ? { ...task, status } : task
      )
    );
    setDraggedTask(null);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      tags: task.tags,
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      tags: [],
    });
  };

  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags)));

  const TaskCard = ({ task }: { task: Task }) => {
    const priorityStyle = PRIORITIES[task.priority];
    const blocked = isTaskBlocked(task, tasks);
    const depCount = task.dependencies?.length || 0;
    const completedDeps = task.dependencies?.filter((depId) => {
      const depTask = tasks.find((t) => t.id === depId);
      return depTask?.status === "done";
    }).length || 0;

    return (
      <Card
        draggable
        onDragStart={() => handleDragStart(task.id)}
        className={`cursor-move hover:shadow-lg transition-all duration-200 border-l-4 ${
          blocked ? "opacity-75" : ""
        }`}
        style={{
          borderLeftColor:
            task.priority === "high"
              ? "#ef4444"
              : task.priority === "medium"
              ? "#eab308"
              : "#64748b",
        }}
      >
        <CardContent>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${priorityStyle.color}`}>
                  {priorityStyle.label}
                </span>
                {blocked && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-500 border border-red-500/30" title="Blocked by incomplete dependencies">
                    🔒 Blocked
                  </span>
                )}
                {depCount > 0 && !blocked && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/30" title="All dependencies completed">
                    ✅ {completedDeps}/{depCount} deps
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-sm mb-1 truncate">
                {task.title}
              </h4>              <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">
                {task.description}
              </p>
              {depCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mb-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>{completedDeps}/{depCount} dependencies</span>
                </div>
              )}
              <div className="flex flex-wrap gap-1 mb-3">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs border border-[var(--border-default)] bg-[var(--bg-primary)] text-[var(--text-secondary)]"
                  >
                    <TagIcon />
                    <span className="ml-1">{tag}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => openEditDialog(task)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter task description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            value={formData.status || "todo"}
            onChange={(value) =>
              setFormData({ ...formData, status: value as Task["status"] })
            }
            options={[
              { value: "todo", label: "To Do" },
              { value: "inprogress", label: "In Progress" },
              { value: "done", label: "Done" },
            ]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <Select
            value={formData.priority || "medium"}
            onChange={(value) =>
              setFormData({ ...formData, priority: value as Task["priority"] })
            }
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Tags (comma separated)
        </label>
        <Input
          value={formData.tags?.join(", ") || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              tags: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
          placeholder="design, urgent, review"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Task Manager</h1>
          <p className="text-[var(--text-muted)]">
            Organize and track your project tasks with Kanban boards
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-xs text-[var(--text-muted)]">Total Tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter((t) => t.status === "todo").length}
              </div>
              <p className="text-xs text-[var(--text-muted)]">To Do</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter((t) => t.status === "inprogress").length}
              </div>
              <p className="text-xs text-[var(--text-muted)]">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter((t) => t.status === "done").length}
              </div>
              <p className="text-xs text-[var(--text-muted)]">Done</p>
            </CardContent>
          </Card>
        </div>

        {/* API Integration Stats - Issue #14 */}
        <div className="mb-6">
          <ApiDashboardStats />
        </div>

        {/* API Health and Sync - Issue #14 */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <ApiHealthCheck />
          <TaskSyncButton />
        </div>

        {/* Webhook Manager - Issue #15 */}
        <div className="mb-6">
          <WebhookManager />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusIcon />
              <span className="ml-2">New Task</span>
            </Button>
            
            {/* Undo/Redo Controls - Issue #9 */}
            <div className="flex items-center gap-1 border border-[var(--border-default)] rounded-lg overflow-hidden">
              <button
                onClick={handleUndo}
                disabled={historyIndex < 0}
                className="px-3 py-2 hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <UndoIcon />
              </button>
              <div className="w-px h-5 bg-[var(--border-default)]" />
              <button
                onClick={handleRedo}
                disabled={historyIndex >= actionHistory.length - 1}
                className="px-3 py-2 hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <RedoIcon />
              </button>
            </div>
            
            {historyIndex >= 0 && (
              <span className="text-xs text-[var(--text-muted)]">
                {historyIndex + 1} actions
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {allTags.length > 0 && (
              <Select
                value={filterTag}
                onChange={setFilterTag}
                options={[
                  { value: "", label: "All tags" },
                  ...allTags.map((tag) => ({ value: tag, label: tag })),
                ]}
              />
            )}
          </div>
        </div>

        {/* Create Dialog */}
        <Dialog
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Create New Task"
        >
          {renderForm()}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </div>
        </Dialog>

        {/* Edit SlideOver - Issue #8 */}
        <SlideOver
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          task={editingTask}
          onSave={handleUpdateTask}
          onDelete={handleDeleteTask}
          allTasks={tasks}
        />

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.status);

            return (
              <div
                key={column.id}
                className="flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                <Card className="flex-1 bg-[var(--bg-secondary)]/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${column.color}`} />
                        <span className="text-sm font-semibold">{column.title}</span>
                      </div>
                      <Badge variant="secondary">{columnTasks.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 min-h-[200px]">
                      {columnTasks.length === 0 ? (
                        <div className="text-center py-8 text-[var(--text-muted)] text-sm">
                          <GripIcon />
                          <p className="mt-2">Drop tasks here</p>
                        </div>
                      ) : (
                        columnTasks.map((task) => (
                          <TaskCard key={task.id} task={task} />
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border-default)] mt-8 pt-6">
          <p className="text-center text-sm text-[var(--text-muted)]">
            Drag and drop tasks between columns to update their status. Click
            the + button to create new tasks. Use Ctrl+Z to undo deletions.
          </p>
        </div>
      </div>
    </div>
  );
}
