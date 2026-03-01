export default function DesignTokensPage() {
  const colors = [
    { name: "bg-primary", light: "#ffffff", dark: "#0a0a0b", description: "Fondo principal" },
    { name: "bg-secondary", light: "#f5f5f5", dark: "#141415", description: "Fondo secundario" },
    { name: "bg-tertiary", light: "#e5e5e5", dark: "#1c1c1d", description: "Fondo terciario" },
    { name: "bg-elevated", light: "#fafafa", dark: "#1f1f20", description: "Fondo elevado" },
    { name: "text-primary", light: "#0a0a0b", dark: "#fafafa", description: "Texto principal" },
    { name: "text-secondary", light: "#525252", dark: "#a3a3a3", description: "Texto secundario" },
    { name: "text-tertiary", light: "#737373", dark: "#737373", description: "Texto terciario" },
    { name: "accent-purple", light: "#8b5cf6", dark: "#a78bfa", description: "Acento púrpura" },
    { name: "accent-cyan", light: "#06b6d4", dark: "#22d3ee", description: "Acento cian" },
    { name: "accent-pink", light: "#ec4899", dark: "#f472b6", description: "Acento rosa" },
    { name: "border-subtle", light: "#e5e5e5", dark: "#262627", description: "Borde sutil" },
    { name: "border-default", light: "#d4d4d4", dark: "#3f3f40", description: "Borde por defecto" },
  ];

  const typography = [
    { name: "Inter 400", weight: "font-normal", text: "Regular" },
    { name: "Inter 500", weight: "font-medium", text: "Medium" },
    { name: "Inter 600", weight: "font-semibold", text: "Semibold" },
    { name: "Inter 700", weight: "font-bold", text: "Bold" },
  ];

  const fontSizes = [
    { name: "xs", size: "text-xs", example: "Texto extra pequeño" },
    { name: "sm", size: "text-sm", example: "Texto pequeño" },
    { name: "base", size: "text-base", example: "Texto base" },
    { name: "lg", size: "text-lg", example: "Texto grande" },
    { name: "xl", size: "text-xl", example: "Texto extra grande" },
    { name: "2xl", size: "text-2xl", example: "Heading 2" },
    { name: "3xl", size: "text-3xl", example: "Heading 1" },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 border-b border-border-default pb-8">
          <h1 className="text-4xl font-bold mb-2">Design Tokens</h1>
          <p className="text-text-secondary text-lg">
            Sistema de diseño de Nexus — Paleta de colores y tipografía
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-3 py-1 bg-bg-secondary rounded-full text-xs text-text-secondary border border-border-subtle">
              Dark Mode Default
            </span>
            <span className="px-3 py-1 bg-bg-secondary rounded-full text-xs text-text-secondary border border-border-subtle">
              Inter Font
            </span>
          </div>
        </header>

        {/* Colors Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-border-subtle">
            Paleta de Colores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colors.map((color) => (
              <div
                key={color.name}
                className="rounded-xl border border-border-default overflow-hidden bg-bg-secondary"
              >
                <div className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <div
                      className="w-16 h-16 rounded-lg border border-border-subtle shadow-sm"
                      style={{ backgroundColor: color.light }}
                      title={`Light: ${color.light}`}
                    />
                    <div
                      className="w-16 h-16 rounded-lg border border-border-subtle shadow-sm"
                      style={{ backgroundColor: color.dark }}
                      title={`Dark: ${color.dark}`}
                    />
                  </div>
                  <div>
                    <code className="text-sm font-mono text-accent-purple">
                      {color.name}
                    </code>
                    <p className="text-sm text-text-secondary mt-1">
                      {color.description}
                    </p>
                  </div>
                  <div className="flex gap-4 text-xs text-text-tertiary font-mono">
                    <span>L: {color.light}</span>
                    <span>D: {color.dark}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-border-subtle">
            Tipografía — Inter
          </h2>
          
          {/* Font Weights */}
          <div className="mb-10">
            <h3 className="text-lg font-medium mb-4 text-text-secondary">Pesos</h3>
            <div className="space-y-4">
              {typography.map((type) => (
                <div
                  key={type.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary border border-border-subtle"
                >
                  <span className={`text-2xl ${type.weight}`}>
                    {type.text}
                  </span>
                  <code className="text-sm font-mono text-text-tertiary">
                    {type.name}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Font Sizes */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-text-secondary">Tamaños</h3>
            <div className="space-y-4">
              {fontSizes.map((font) => (
                <div
                  key={font.name}
                  className="flex items-baseline gap-6 p-4 rounded-xl bg-bg-secondary border border-border-subtle"
                >
                  <span className={`${font.size} flex-1`}>
                    {font.example}
                  </span>
                  <code className="text-sm font-mono text-text-tertiary">
                    {font.size}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Usage Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-border-subtle">
            Ejemplo de Uso
          </h2>
          <div className="p-6 rounded-xl bg-bg-secondary border border-border-default space-y-4">
            <div className="p-4 rounded-lg bg-bg-tertiary">
              <p className="text-text-tertiary text-sm mb-2">Componente de ejemplo:</p>
              <div className="p-4 rounded-lg bg-bg-elevated border border-border-subtle">
                <h4 className="text-xl font-semibold text-text-primary mb-2">
                  Título del componente
                </h4>
                <p className="text-text-secondary mb-4">
                  Descripción usando color secundario para texto de apoyo.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-accent-purple/20 text-accent-purple text-sm font-medium">
                    Etiqueta
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-accent-cyan/20 text-accent-cyan text-sm font-medium">
                    Destacado
                  </span>
                </div>
              </div>
            </div>
            <pre className="p-4 rounded-lg bg-bg-primary text-sm font-mono text-text-secondary overflow-x-auto">
{`<div className="bg-bg-elevated border border-border-subtle">
  <h4 className="text-text-primary">
    Título del componente
  </h4>
  <p className="text-text-secondary">
    Descripción...
  </p>
</div>`}
            </pre>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-border-default text-center text-text-tertiary text-sm">
          <p>Nexus Design System v1.0</p>
        </footer>
      </div>
    </div>
  );
}
