// Export functionality for tasks and projects

// Local Task type definition
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "inprogress" | "done";
  priority: "low" | "medium" | "high";
  tags: string[];
  createdAt: Date;
  dueDate?: Date;
  assignee?: string;
  project?: string;
  dependencies?: string[];
}

export interface ExportOptions {
  format: "csv" | "json";
  includeTasks: boolean;
  includeProjects: boolean;
  dateRange?: {
    from?: string;
    to?: string;
  };
  projectFilter?: string;
  statusFilter?: Task["status"] | "all";
}

export interface ExportedData {
  tasks?: Task[];
  projects?: Array<{
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  exportDate: string;
  totalTasks: number;
  totalProjects: number;
}

// Convert tasks to CSV format
function tasksToCSV(tasks: Task[]): string {
  const headers = [
    "ID",
    "Title",
    "Description",
    "Status",
    "Priority",
    "Tags",
    "Created At",
    "Due Date",
    "Assignee",
    "Project",
    "Dependencies",
  ];

  const rows = tasks.map((task) => [
    task.id,
    `"${task.title.replace(/"/g, '""')}"`,
    `"${(task.description || "").replace(/"/g, '""')}"`,
    task.status,
    task.priority,
    `"${(task.tags || []).join(",")}"`,
    new Date(task.createdAt).toISOString(),
    task.dueDate ? new Date(task.dueDate).toISOString() : "",
    task.assignee || "",
    task.project || "",
    `"${(task.dependencies || []).join(",")}"`,
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

// Get tasks from localStorage (same as page.tsx)
function getStoredTasks(): Task[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("nexus_tasks");
  return stored ? JSON.parse(stored) : [];
}

// Get projects from localStorage
function getStoredProjects() {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("nexus_projects");
  return stored
    ? JSON.parse(stored)
    : [
        {
          id: "default",
          name: "Default Project",
          description: "Default project for tasks",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
}

// Filter tasks based on options
function filterTasks(tasks: Task[], options: ExportOptions): Task[] {
  return tasks.filter((task) => {
    // Status filter
    if (options.statusFilter && options.statusFilter !== "all") {
      if (task.status !== options.statusFilter) return false;
    }

    // Project filter
    if (options.projectFilter && options.projectFilter !== "all") {
      if (task.project !== options.projectFilter) return false;
    }

    // Date range filter
    if (options.dateRange?.from || options.dateRange?.to) {
      const taskDate = new Date(task.createdAt);
      if (options.dateRange.from) {
        const fromDate = new Date(options.dateRange.from);
        if (taskDate < fromDate) return false;
      }
      if (options.dateRange.to) {
        const toDate = new Date(options.dateRange.to);
        if (taskDate > toDate) return false;
      }
    }

    return true;
  });
}

// Export data based on options
export function exportData(options: ExportOptions): {
  data: string;
  filename: string;
  mimeType: string;
} {
  const tasks = options.includeTasks ? getStoredTasks() : [];
  const projects = options.includeProjects ? getStoredProjects() : [];
  const filteredTasks = filterTasks(tasks, options);

  const timestamp = new Date().toISOString().split("T")[0];

  if (options.format === "csv") {
    let csvContent = "";

    if (options.includeTasks && filteredTasks.length > 0) {
      csvContent += "# TASKS\n";
      csvContent += tasksToCSV(filteredTasks);
      csvContent += "\n\n";
    }

    if (options.includeProjects && projects.length > 0) {
      csvContent += "# PROJECTS\n";
      csvContent += "ID,Name,Description,Created At,Updated At\n";
      projects.forEach((project: { id: string; name: string; description?: string; createdAt: string; updatedAt: string }) => {
        csvContent += `${project.id},"${project.name}","${(project.description || "").replace(/"/g, '""')}",${project.createdAt},${project.updatedAt}\n`;
      });
    }

    return {
      data: csvContent,
      filename: `nexus-export-${timestamp}.csv`,
      mimeType: "text/csv",
    };
  } else {
    // JSON format
    const exportData: ExportedData = {
      tasks: options.includeTasks ? filteredTasks : undefined,
      projects: options.includeProjects ? projects : undefined,
      exportDate: new Date().toISOString(),
      totalTasks: filteredTasks.length,
      totalProjects: projects.length,
    };

    return {
      data: JSON.stringify(exportData, null, 2),
      filename: `nexus-export-${timestamp}.json`,
      mimeType: "application/json",
    };
  }
}

// Download file
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Preview export data (first 5 items)
export function previewExport(options: ExportOptions): {
  tasks: Task[];
  projects: Array<{ id: string; name: string }>;
  totalTasks: number;
  totalProjects: number;
} {
  const tasks = options.includeTasks ? getStoredTasks() : [];
  const projects = options.includeProjects ? getStoredProjects() : [];
  const filteredTasks = filterTasks(tasks, options);

  return {
    tasks: filteredTasks.slice(0, 5),
    projects: projects.slice(0, 5),
    totalTasks: filteredTasks.length,
    totalProjects: projects.length,
  };
}
