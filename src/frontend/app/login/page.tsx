'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play } from 'lucide-react'

// Importamos el cliente de API real
import { apiFetch, setAuthToken } from '@/services/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Llamada real al backend vía Kong
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      console.log("[NextFlop] Login exitoso:", data)

      // Guardar token JWT en el navegador
      if (data?.token) setAuthToken(data.token)

      // Redirigir al home o dashboard
      router.push('/home')

    } catch (error: any) {
      console.error("[NextFlop] Error de login:", error)
      console.error("[NextFlop] Error de login:", error.status, error.info);


      const backendMsg =
        typeof error.info === 'object' && error.info?.message
          ? error.info.message
          : 'Credenciales incorrectas o error del servidor'

      setErrorMessage(backendMsg)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      {/* Logo Header */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Play className="h-10 w-10 text-primary fill-primary" />
        <span className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          NextFlop
        </span>
      </Link>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center">Iniciar sesión</CardTitle>
          <CardDescription className="text-center text-base">
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error del backend */}
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Primera vez aquí?{' '}
              <Link
                href="/register"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
