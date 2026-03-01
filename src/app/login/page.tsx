"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nexus_auth");
      return saved ? JSON.parse(saved) : { isAuthenticated: false, user: null };
    }
    return { isAuthenticated: false, user: null };
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    // Validación
    if (!email.trim()) {
      setError("El email es requerido");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un email válido");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("La contraseña es requerida");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication (acepta cualquier credencial válida)
    const newAuthState: AuthState = {
      isAuthenticated: true,
      user: { email },
    };

    localStorage.setItem("nexus_auth", JSON.stringify(newAuthState));
    setAuthState(newAuthState);
    setSuccess(true);
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("nexus_auth");
    setAuthState({ isAuthenticated: false, user: null });
    setEmail("");
    setPassword("");
    setSuccess(false);
  };

  // Si está autenticado, mostrar dashboard básico
  if (authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent-purple/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-accent-purple" />
            </div>
            <CardTitle className="text-2xl">¡Bienvenido! 🎉</CardTitle>
            <CardDescription>
              Has iniciado sesión correctamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-bg-secondary">
              <p className="text-sm text-text-secondary mb-1">Email:</p>
              <p className="text-text-primary font-medium">{authState.user?.email}</p>
            </div>
            <Badge variant="secondary" className="w-full justify-center py-2">
              Estado: Autenticado
            </Badge>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Link href="/" className="w-full">
              <Button className="w-full gap-2">
                Ir al Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-pink bg-clip-text text-transparent">
              Nexus
            </h1>
          </Link>
          <p className="text-text-secondary mt-2">Inicia sesión en tu cuenta</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert className="mb-4 border-accent-purple/50 text-accent-purple">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>¡Inicio de sesión exitoso! Redirigiendo...</AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-text-tertiary">Mínimo 6 caracteres</p>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border-default" />
                  <span className="text-text-secondary">Recordarme</span>
                </label>
                <Link
                  href="#"
                  className="text-accent-purple hover:text-accent-purple/80 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Iniciando sesión..."
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <p className="text-sm text-text-secondary text-center">
                ¿No tienes cuenta?{" "}
                <Link
                  href="#"
                  className="text-accent-purple hover:text-accent-purple/80 font-medium"
                >
                  Regístrate
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
