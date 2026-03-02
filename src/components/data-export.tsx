"use client";

import React, { useState, useEffect } from "react";
import { ExportOptions, exportData, downloadFile, previewExport } from "@/lib/export";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DataExport() {
  const [options, setOptions] = useState<ExportOptions>({
    format: "csv",
    includeTasks: true,
    includeProjects: true,
    statusFilter: "all",
    projectFilter: "all",
  });
  const [preview, setPreview] = useState<{
    tasks: Task[];
    projects: Array<{ id: string; name: string }>;
    totalTasks: number;
    totalProjects: number;
  } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    // Load projects for filter
    const stored = localStorage.getItem("nexus_projects");
    if (stored) {
      setProjects(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    // Update preview when options change
    setPreview(previewExport(options));
  }, [options]);

  const handleExport = () => {
    setIsExporting(true);
    try {
      const { data, filename, mimeType } = exportData(options);
      downloadFile(data, filename, mimeType);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DownloadIcon className="w-5 h-5" />
          Exportar Datos
        </CardTitle>
        <CardDescription>
          Exporta tus tareas y proyectos a CSV o JSON
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Format Selection */}
        <div className="space-y-2">
          <Label>Formato de Exportación</Label>
          <div className="flex gap-2">
            <Button
              variant={options.format === "csv" ? "default" : "outline"}
              size="sm"
              onClick={() => setOptions((prev) => ({ ...prev, format: "csv" }))}
            >
              CSV
            </Button>
            <Button
              variant={options.format === "json" ? "default" : "outline"}
              size="sm"
              onClick={() => setOptions((prev) => ({ ...prev, format: "json" }))}
            >
              JSON
            </Button>
          </div>
        </div>

        {/* Data Selection */}
        <div className="space-y-4">
          <Label>Datos a Exportar</Label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="includeTasks"
                checked={options.includeTasks}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({ ...prev, includeTasks: checked }))
                }
              />
              <Label htmlFor="includeTasks" className="cursor-pointer">
                Incluir Tareas
              </Label>
            </div>
            {preview && (
              <Badge variant="secondary">{preview.totalTasks} tareas</Badge>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="includeProjects"
                checked={options.includeProjects}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({ ...prev, includeProjects: checked }))
                }
              />
              <Label htmlFor="includeProjects" className="cursor-pointer">
                Incluir Proyectos
              </Label>
            </div>
            {preview && (
              <Badge variant="secondary">{preview.totalProjects} proyectos</Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Filters */}
        <div className="space-y-4">
          <Label>Filtros</Label>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Estado</Label>
              <Select
                value={options.statusFilter}
                onValueChange={(value) =>
                  setOptions((prev) => ({
                    ...prev,
                    statusFilter: value as Task["status"] | "all",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="todo">Por hacer</SelectItem>
                  <SelectItem value="inprogress">En progreso</SelectItem>
                  <SelectItem value="done">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Proyecto</Label>
              <Select
                value={options.projectFilter}
                onValueChange={(value) =>
                  setOptions((prev) => ({ ...prev, projectFilter: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los proyectos</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Desde</Label>
              <input
                type="date"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={options.dateRange?.from || ""}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      from: e.target.value || undefined,
                    },
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Hasta</Label>
              <input
                type="date"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={options.dateRange?.to || ""}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      to: e.target.value || undefined,
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Preview */}
        {preview && (
          <div className="space-y-2">
            <Label>Vista Previa</Label>
            <ScrollArea className="h-[150px] rounded-md border p-2">
              {options.includeTasks && preview.tasks.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Tareas (mostrando {preview.tasks.length} de {preview.totalTasks}):
                  </p>
                  {preview.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="text-xs py-1 px-2 bg-secondary rounded mb-1"
                    >
                      {task.title} — {task.status}
                    </div>
                  ))}
                </div>
              )}
              {options.includeProjects && preview.projects.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Proyectos (mostrando {preview.projects.length} de {preview.totalProjects}):
                  </p>
                  {preview.projects.map((project) => (
                    <div
                      key={project.id}
                      className="text-xs py-1 px-2 bg-secondary rounded mb-1"
                    >
                      {project.name}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={isExporting || (!options.includeTasks && !options.includeProjects)}
          className="w-full"
        >
          {isExporting ? (
            <>Exportando... <span className="ml-2 animate-spin">⏳</span></>
          ) : (
            <>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Exportar {options.format.toUpperCase()}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Icon
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}
