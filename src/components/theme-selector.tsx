"use client";

import React, { useState, useEffect } from "react";
import {
  Theme,
  ThemeMode,
  ThemeConfig,
  DEFAULT_THEMES,
  getThemeConfig,
  saveThemeConfig,
  applyTheme,
} from "@/lib/themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export function ThemeSelector() {
  const [config, setConfig] = useState<ThemeConfig>({
    mode: "system",
    themeId: "default",
  });
  const [customColor, setCustomColor] = useState("");

  useEffect(() => {
    const saved = getThemeConfig();
    setConfig(saved);
    applyTheme(saved);
  }, []);

  const handleModeChange = (mode: ThemeMode) => {
    const newConfig = { ...config, mode };
    setConfig(newConfig);
    saveThemeConfig(newConfig);
    applyTheme(newConfig);
  };

  const handleThemeChange = (themeId: string) => {
    const newConfig = { ...config, themeId, customPrimary: undefined };
    setConfig(newConfig);
    saveThemeConfig(newConfig);
    applyTheme(newConfig);
  };

  const handleCustomColor = (color: string) => {
    setCustomColor(color);
    if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
      const newConfig = { ...config, customPrimary: color };
      setConfig(newConfig);
      saveThemeConfig(newConfig);
      applyTheme(newConfig);
    }
  };

  const currentTheme =
    DEFAULT_THEMES.find((t) => t.id === config.themeId) || DEFAULT_THEMES[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PaletteIcon className="w-5 h-5" />
          Personalizar Tema
        </CardTitle>
        <CardDescription>
          Elige un tema o personaliza los colores de la aplicación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div className="space-y-3">
          <Label>Modo de Color</Label>
          <div className="flex gap-2">
            {(["light", "dark", "system"] as ThemeMode[]).map((mode) => (
              <Button
                key={mode}
                variant={config.mode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => handleModeChange(mode)}
              >
                {mode === "light" && <SunIcon className="w-4 h-4 mr-2" />}
                {mode === "dark" && <MoonIcon className="w-4 h-4 mr-2" />}
                {mode === "system" && <MonitorIcon className="w-4 h-4 mr-2" />}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Theme Selection */}
        <div className="space-y-3">
          <Label>Tema</Label>
          <div className="grid grid-cols-2 gap-3">
            {DEFAULT_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  config.themeId === theme.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span className="font-medium text-sm">{theme.name}</span>
                </div>
                <div className="flex gap-1">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: theme.secondary }}
                  />
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Custom Color */}
        <div className="space-y-3">
          <Label>Color Primario Personalizado</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customColor || currentTheme.primary}
              onChange={(e) => handleCustomColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => handleCustomColor(e.target.value)}
              placeholder="#3B82F6"
              className="flex-1 h-10 px-3 rounded-md border bg-transparent"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Ingresa un color HEX (ej: #3B82F6) o usa el selector
          </p>
        </div>

        <Separator />

        {/* Preview */}
        <div className="space-y-3">
          <Label>Vista Previa</Label>
          <div className="p-4 rounded-lg border space-y-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full"
                style={{
                  backgroundColor: config.customPrimary || currentTheme.primary,
                }}
              />
              <span className="text-sm">Color primario actual</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Botón Primario</Button>
              <Button variant="secondary" size="sm">
                Botón Secundario
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Icons
function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" strokeWidth={2} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={2} />
      <line x1="8" y1="21" x2="16" y2="21" strokeWidth={2} />
      <line x1="12" y1="17" x2="12" y2="21" strokeWidth={2} />
    </svg>
  );
}
