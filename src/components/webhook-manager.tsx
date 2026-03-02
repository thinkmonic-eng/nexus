"use client";

import React, { useState, useEffect } from "react";
import {
  Webhook,
  WebhookEvent,
  WebhookFormData,
  WebhookLog,
  WEBHOOK_EVENTS,
  getWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  getWebhookLogs,
} from "@/lib/webhooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function WebhookManager() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null);
  const [formData, setFormData] = useState<WebhookFormData>({
    name: "",
    url: "",
    events: [],
    active: true,
    secret: "",
  });

  useEffect(() => {
    loadWebhooks();
  }, []);

  useEffect(() => {
    if (selectedWebhook) {
      setLogs(getWebhookLogs(selectedWebhook));
    } else {
      setLogs(getWebhookLogs());
    }
  }, [selectedWebhook]);

  const loadWebhooks = () => {
    setWebhooks(getWebhooks());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWebhook) {
      updateWebhook(editingWebhook.id, formData);
    } else {
      createWebhook(formData);
    }
    loadWebhooks();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setFormData({
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      active: webhook.active,
      secret: webhook.secret || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este webhook?")) {
      deleteWebhook(id);
      loadWebhooks();
    }
  };

  const resetForm = () => {
    setEditingWebhook(null);
    setFormData({
      name: "",
      url: "",
      events: [],
      active: true,
      secret: "",
    });
  };

  const toggleEvent = (event: WebhookEvent) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter((e) => e !== event)
        : [...prev.events, event],
    }));
  };

  const getStatusBadge = (webhook: Webhook) => {
    if (!webhook.active) {
      return <Badge variant="secondary">Inactivo</Badge>;
    }
    if (webhook.failureCount > 5) {
      return <Badge variant="destructive">Fallando</Badge>;
    }
    return <Badge variant="default">Activo</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Webhooks</CardTitle>
            <CardDescription>
              Configura endpoints para recibir notificaciones de eventos
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nuevo Webhook
          </Button>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <WebhookIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay webhooks configurados</p>
              <p className="text-sm">Crea uno para recibir notificaciones de eventos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <Card
                  key={webhook.id}
                  className={`cursor-pointer transition-colors ${
                    selectedWebhook === webhook.id
                      ? "border-primary"
                      : "hover:border-muted-foreground/25"
                  }`}
                  onClick={() =>
                    setSelectedWebhook(
                      selectedWebhook === webhook.id ? null : webhook.id
                    )
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{webhook.name}</h4>
                          {getStatusBadge(webhook)}
                        </div>
                        <p className="text-sm text-muted-foreground font-mono mb-2">
                          {webhook.url}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                        {webhook.lastTriggeredAt && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Última llamada: {new Date(webhook.lastTriggeredAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(webhook);
                          }}
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(webhook.id);
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Logs de Webhooks</CardTitle>
          <CardDescription>
            {selectedWebhook
              ? "Mostrando logs del webhook seleccionado"
              : "Mostrando todos los logs"}
            <Button
              variant="link"
              size="sm"
              onClick={() => setSelectedWebhook(null)}
              className={selectedWebhook ? "" : "hidden"}
            >
              Ver todos
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay logs disponibles</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg border text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant={log.success ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {log.success ? "Éxito" : "Error"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-medium">{log.event}</p>
                    <p className="text-xs text-muted-foreground">
                      Status: {log.responseStatus} • {log.duration}ms
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingWebhook ? "Editar Webhook" : "Nuevo Webhook"}
            </DialogTitle>
            <DialogDescription>
              Configura un endpoint para recibir notificaciones de eventos
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Webhook de producción"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL del Endpoint</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://api.ejemplo.com/webhooks"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secret">Secret (opcional)</Label>
              <Input
                id="secret"
                type="password"
                value={formData.secret}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, secret: e.target.value }))
                }
                placeholder="whsec_..."
              />
            </div>
            <div className="space-y-2">
              <Label>Eventos</Label>
              <div className="grid grid-cols-2 gap-2">
                {WEBHOOK_EVENTS.map((event) => (
                  <div key={event.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={event.value}
                      checked={formData.events.includes(event.value)}
                      onCheckedChange={() => toggleEvent(event.value)}
                    />
                    <Label htmlFor={event.value} className="text-sm cursor-pointer">
                      {event.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, active: checked }))
                }
              />
              <Label htmlFor="active">Webhook activo</Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingWebhook ? "Guardar Cambios" : "Crear Webhook"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function WebhookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
