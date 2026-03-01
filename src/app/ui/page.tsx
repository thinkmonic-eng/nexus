"use client";

import React, { useState } from "react";

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
  },
  {
    id: "task-2",
    title: "Implement authentication",
    description: "Add login and signup functionality",
    status: "inprogress",
    priority: "high",
    tags: ["feature", "auth"],
    createdAt: new Date(),
  },
  {
    id: "task-3",
    title: "Create landing page",
    description: "Build hero section and features showcase",
    status: "todo",
    priority: "medium",
    tags: ["frontend", "marketing"],
    createdAt: new Date(),
  },
  {
    id: "task-4",
    title: "Write documentation",
    description: "Document API endpoints and components",
    status: "todo",
    priority: "low",
    tags: ["docs"],
    createdAt: new Date(),
  },
];

// Simple Button Component
function Button({
  children,
  onClick,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
  className?: string;
}) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200";
  const variants = {
    default: "bg-[var(--accent-purple)] text-white hover:opacity-90",
    outline: "border border-[var(--border-default)] hover:bg-[var(--bg-secondary)]",
    ghost: "hover:bg-[var(--bg-secondary)]",
  };
  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
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
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
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

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string>("");

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

    setTasks([...tasks, newTask]);
    resetForm();
    setIsCreateOpen(false);
  };

  const handleUpdateTask = () => {
    if (!editingTask || !formData.title) return;

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: formData.title || task.title,
              description: formData.description || task.description,
              status: (formData.status as Task["status"]) || task.status,
              priority: (formData.priority as Task["priority"]) || task.priority,
              tags: formData.tags || task.tags,
            }
          : task
      )
    );
    setEditingTask(null);
    setIsEditOpen(false);
    resetForm();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

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

    return (
      <Card
        draggable
        onDragStart={() => handleDragStart(task.id)}
        className="cursor-move hover:shadow-lg transition-all duration-200 border-l-4"
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
              </div>
              <h4 className="font-semibold text-sm mb-1 truncate">
                {task.title}
              </h4>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">
                {task.description}
              </p>
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

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusIcon />
              <span className="ml-2">New Task</span>
            </Button>
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

        {/* Edit Dialog */}
        <Dialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Task"
        >
          {renderForm()}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTask}>Update Task</Button>
          </div>
        </Dialog>

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
            the + button to create new tasks.
          </p>
        </div>
      </div>
    </div>
  );
}
