import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, Info, Terminal } from "lucide-react";

export default function UIShowcasePage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="mb-12 border-b border-border-default pb-8">
          <h1 className="text-4xl font-bold mb-2">Componentes UI</h1>
          <p className="text-text-secondary text-lg">
            Showcase de componentes base del sistema de diseño Nexus
          </p>
          <div className="mt-4 flex gap-2">
            <Badge variant="secondary">10 Componentes</Badge>
            <Badge variant="outline">Shadcn UI</Badge>
          </div>
        </header>

        {/* Button Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold pb-2 border-b border-border-subtle">
            Button
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Variantes</CardTitle>
              <CardDescription>Diferentes estilos de botones</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tamaños</CardTitle>
              <CardDescription>Diferentes tamaños de botones</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <Button size="lg">Large</Button>
              <Button>Default</Button>
              <Button size="sm">Small</Button>
              <Button size="icon">+</Button>
            </CardContent>
          </Card>
        </section>

        {/* Input Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold pb-2 border-b border-border-subtle">
            Input
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Input</CardTitle>
              <CardDescription>Campos de entrada de texto</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default</label>
                <Input placeholder="Placeholder..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Disabled</label>
                <Input placeholder="Disabled..." disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Con valor</label>
                <Input value="Valor predefinido" readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" value="password123" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Textarea Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold pb-2 border-b border-border-subtle">
            Textarea
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Área de Texto</CardTitle>
              <CardDescription>Campo de texto multilinea</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Escribe algo aquí..." />
              <Textarea placeholder="Disabled textarea..." disabled />
            </CardContent>
          </Card>
        </section>

        {/* Card Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold pb-2 border-b border-border-subtle">
            Card
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Simple</CardTitle>
                <CardDescription>Una tarjeta básica con contenido</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Este es el contenido de la tarjeta. Puede incluir texto, imágenes o cualquier otro elemento.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card con Footer</CardTitle>
                <CardDescription>Tarjeta con acciones</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">Contenido de ejemplo con acciones al final.</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm">Cancelar</Button>
                <Button size="sm">Aceptar</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Badge Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold pb-2 border-b border-border-subtle">
            Badge
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Variantes de Badge</CardTitle>
              <CardDescription>Etiquetas para estados y categorías</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge className="bg-accent-purple text-white hover:bg-accent-purple/90">Custom</Badge>
            </CardContent>
          </Card>
        </section>

        {/* Alert Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold pb-2 border-b border-border-subtle">
            Alert
          </h2>
          <div className="space-y-4">
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Default Alert</AlertTitle>
              <AlertDescription>
                Esta es una alerta por defecto con información general.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Algo salió mal. Por favor, intenta de nuevo.
              </AlertDescription>
            </Alert>

            <Alert className="border-accent-purple/50 text-accent-purple">
              <Info className="h-4 w-4" />
              <AlertTitle>Información</AlertTitle>
              <AlertDescription>
                Alerta personalizada con color de acento.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Dialog Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold pb-2 border-b border-border-subtle">
            Dialog (Modal)
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Diálogo Modal</CardTitle>
              <CardDescription>Ventana emergente para acciones importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Abrir Diálogo</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                    <DialogDescription>
                      Haz cambios en tu perfil aquí. Guarda cuando termines.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-right text-sm">Nombre</label>
                      <Input id="name" value="Usuario" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="email" className="text-right text-sm">Email</label>
                      <Input id="email" value="usuario@ejemplo.com" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Guardar cambios</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </section>

        {/* Select Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold pb-2 border-b border-border-subtle">
            Select
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Selector</CardTitle>
              <CardDescription>Lista desplegable de opciones</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opcion1">Opción 1</SelectItem>
                  <SelectItem value="opcion2">Opción 2</SelectItem>
                  <SelectItem value="opcion3">Opción 3</SelectItem>
                </SelectContent>
              </Select>

              <Select disabled>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Disabled..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test">Test</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </section>

        {/* Switch Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold pb-2 border-b border-border-subtle">
            Switch
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Interruptor</CardTitle>
              <CardDescription>Toggle para activar/desactivar</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch id="airplane-mode" />
                <label htmlFor="airplane-mode" className="text-sm font-medium">
                  Modo Avión
                </label>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Switch id="wifi" defaultChecked />
                <label htmlFor="wifi" className="text-sm font-medium">Wi-Fi</label>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Switch id="disabled" disabled />
                <label htmlFor="disabled" className="text-sm font-medium opacity-50">
                  Disabled
                </label>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Separator Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold pb-2 border-b border-border-subtle">
            Separator
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Separadores</CardTitle>
              <CardDescription>Divisores visuales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-text-secondary">Separador horizontal:</p>
                <Separator />
              </div>
              <div className="flex items-center gap-4 h-8">
                <p className="text-sm text-text-secondary">Vertical:</p>
                <Separator orientation="vertical" />
                <span>Item 1</span>
                <Separator orientation="vertical" />
                <span>Item 2</span>
                <Separator orientation="vertical" />
                <span>Item 3</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Summary */}
        <section className="mt-12 p-6 rounded-xl bg-bg-secondary border border-border-default">
          <h2 className="text-xl font-semibold mb-4">Resumen de Componentes</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            {[
              "Button",
              "Input",
              "Textarea",
              "Card",
              "Badge",
              "Alert",
              "Dialog",
              "Select",
              "Switch",
              "Separator",
            ].map((component) => (
              <div
                key={component}
                className="flex items-center gap-2 p-2 rounded bg-bg-tertiary"
              >
                <CheckCircle className="h-4 w-4 text-accent-cyan" />
                <span>{component}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-border-default text-center text-text-tertiary text-sm">
          <p>Nexus UI Components v1.0 — Construido con Shadcn UI</p>
        </footer>
      </div>
    </div>
  );
}
