// Webhook types and configuration

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  active: boolean;
  secret?: string;
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
}

export type WebhookEvent =
  | "task.created"
  | "task.updated"
  | "task.deleted"
  | "task.status_changed"
  | "task.assigned"
  | "project.created"
  | "project.updated"
  | "project.deleted";

export const WEBHOOK_EVENTS: { value: WebhookEvent; label: string }[] = [
  { value: "task.created", label: "Tarea creada" },
  { value: "task.updated", label: "Tarea actualizada" },
  { value: "task.deleted", label: "Tarea eliminada" },
  { value: "task.status_changed", label: "Estado de tarea cambiado" },
  { value: "task.assigned", label: "Tarea asignada" },
  { value: "project.created", label: "Proyecto creado" },
  { value: "project.updated", label: "Proyecto actualizado" },
  { value: "project.deleted", label: "Proyecto eliminado" },
];

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: unknown;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: WebhookPayload;
  responseStatus: number;
  responseBody?: string;
  success: boolean;
  duration: number;
  createdAt: string;
}

export interface WebhookFormData {
  name: string;
  url: string;
  events: WebhookEvent[];
  active: boolean;
  secret?: string;
}

// Storage key for webhooks
const WEBHOOKS_STORAGE_KEY = "nexus_webhooks";
const WEBHOOK_LOGS_STORAGE_KEY = "nexus_webhook_logs";

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Get all webhooks
export function getWebhooks(): Webhook[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(WEBHOOKS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save webhooks
export function saveWebhooks(webhooks: Webhook[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WEBHOOKS_STORAGE_KEY, JSON.stringify(webhooks));
}

// Create webhook
export function createWebhook(data: WebhookFormData): Webhook {
  const webhooks = getWebhooks();
  const newWebhook: Webhook = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    failureCount: 0,
  };
  saveWebhooks([...webhooks, newWebhook]);
  return newWebhook;
}

// Update webhook
export function updateWebhook(id: string, data: Partial<WebhookFormData>): Webhook | null {
  const webhooks = getWebhooks();
  const index = webhooks.findIndex((w) => w.id === id);
  if (index === -1) return null;
  
  webhooks[index] = {
    ...webhooks[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveWebhooks(webhooks);
  return webhooks[index];
}

// Delete webhook
export function deleteWebhook(id: string): boolean {
  const webhooks = getWebhooks();
  const filtered = webhooks.filter((w) => w.id !== id);
  if (filtered.length === webhooks.length) return false;
  saveWebhooks(filtered);
  return true;
}

// Get webhook by ID
export function getWebhookById(id: string): Webhook | null {
  return getWebhooks().find((w) => w.id === id) || null;
}

// Get webhook logs
export function getWebhookLogs(webhookId?: string): WebhookLog[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(WEBHOOK_LOGS_STORAGE_KEY);
  const logs = stored ? JSON.parse(stored) : [];
  if (webhookId) {
    return logs.filter((log: WebhookLog) => log.webhookId === webhookId);
  }
  return logs;
}

// Save webhook log
export function saveWebhookLog(log: WebhookLog): void {
  if (typeof window === "undefined") return;
  const logs = getWebhookLogs();
  // Keep only last 100 logs
  const trimmed = [log, ...logs].slice(0, 100);
  localStorage.setItem(WEBHOOK_LOGS_STORAGE_KEY, JSON.stringify(trimmed));
}

// Trigger webhook (simulated)
export async function triggerWebhook(
  webhook: Webhook,
  event: WebhookEvent,
  data: unknown
): Promise<{ success: boolean; status: number; duration: number }> {
  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  const startTime = Date.now();
  
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Webhook-Event": event,
      "X-Webhook-ID": webhook.id,
    };

    if (webhook.secret) {
      // In a real implementation, this would be HMAC signature
      headers["X-Webhook-Signature"] = `sha256=${webhook.secret}`;
    }

    // Simulate HTTP request (in real app, this would be actual fetch)
    // For demo purposes, we'll simulate success
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const duration = Date.now() - startTime;
    
    // Save log
    const log: WebhookLog = {
      id: generateId(),
      webhookId: webhook.id,
      event,
      payload,
      responseStatus: 200,
      responseBody: JSON.stringify({ received: true }),
      success: true,
      duration,
      createdAt: new Date().toISOString(),
    };
    saveWebhookLog(log);

    // Update webhook last triggered
    updateWebhook(webhook.id, {});
    const updated = getWebhookById(webhook.id);
    if (updated) {
      updated.lastTriggeredAt = new Date().toISOString();
      updated.failureCount = 0;
      const webhooks = getWebhooks();
      const idx = webhooks.findIndex((w) => w.id === webhook.id);
      if (idx !== -1) webhooks[idx] = updated;
      saveWebhooks(webhooks);
    }

    return { success: true, status: 200, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    
    const log: WebhookLog = {
      id: generateId(),
      webhookId: webhook.id,
      event,
      payload,
      responseStatus: 0,
      responseBody: error instanceof Error ? error.message : "Unknown error",
      success: false,
      duration,
      createdAt: new Date().toISOString(),
    };
    saveWebhookLog(log);

    // Update failure count
    const updated = getWebhookById(webhook.id);
    if (updated) {
      updated.failureCount++;
      const webhooks = getWebhooks();
      const idx = webhooks.findIndex((w) => w.id === webhook.id);
      if (idx !== -1) webhooks[idx] = updated;
      saveWebhooks(webhooks);
    }

    return { success: false, status: 0, duration };
  }
}

// Trigger all webhooks for an event
export async function triggerWebhooksForEvent(
  event: WebhookEvent,
  data: unknown
): Promise<void> {
  const webhooks = getWebhooks().filter(
    (w) => w.active && w.events.includes(event)
  );
  
  await Promise.all(
    webhooks.map((webhook) => triggerWebhook(webhook, event, data))
  );
}
