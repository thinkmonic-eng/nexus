import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: "Rápido",
      description: "Colaboración en tiempo real sin latencia",
    },
    {
      icon: Shield,
      title: "Seguro",
      description: "Encriptación de extremo a extremo",
    },
    {
      icon: Users,
      title: "Colaborativo",
      description: "Trabaja con tu equipo distribuido",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-accent-purple/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-accent-cyan/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <Badge 
              variant="secondary" 
              className="px-4 py-1.5 text-sm bg-accent-purple/10 text-accent-purple border-accent-purple/20"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Beta Abierta
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-center text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary mb-6">
            Colaboración
            <br />
            <span className="bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-pink bg-clip-text text-transparent">
              Inteligente
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-center text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            La plataforma de colaboración para equipos distribuidos.
            Comunicación fluida, proyectos organizados, resultados excepcionales.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/login">
              <Button size="lg" className="gap-2 px-8 py-6 text-lg">
                Empezar Gratis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/ui">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Ver Componentes
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto text-center">
            {[
              { value: "10K+", label: "Usuarios" },
              { value: "99.9%", label: "Uptime" },
              { value: "50+", label: "Países" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-bold text-text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Herramientas diseñadas para equipos que trabajan de forma remota
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-accent-purple/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent-purple" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-accent-purple/20 via-accent-cyan/20 to-accent-pink/20 border border-accent-purple/30 overflow-hidden">
            <div className="absolute inset-0 bg-bg-primary/50" />
            
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                ¿Listo para empezar?
              </h2>
              <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                Únete a miles de equipos que ya usan Nexus para colaborar mejor.
              </p>
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Crear Cuenta Gratis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-tertiary text-sm">
          <p>© 2026 Nexus. Colaboración inteligente para equipos distribuidos.</p>
        </div>
      </footer>
    </div>
  );
}
