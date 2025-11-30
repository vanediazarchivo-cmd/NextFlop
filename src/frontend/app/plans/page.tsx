import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Check, X } from 'lucide-react'
import { subscriptionsService, type SubscriptionPlan } from '@/services'

export default function PlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setIsLoading(true)
        const data = await subscriptionsService.getPlans()
        setPlans(data)
      } catch (error) {
        console.error('Error loading plans:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPlans()
  }, [])
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Play className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              NextFlop
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/register">Comenzar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-balance">
            Planes y precios
          </h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Elige el plan perfecto para ti. Sin compromisos, cancela cuando quieras.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                plan.recommended ? 'border-primary border-2 shadow-lg shadow-primary/20' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Más popular
                  </div>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl mb-2">{plan.name}</CardTitle>
                <div className="text-5xl font-bold mb-2">
                  ${plan.price}
                </div>
                <CardDescription className="text-base">por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className={`h-5 w-5 flex-shrink-0 text-${plan.color} mt-0.5`} />
                      ) : (
                        <X className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-0.5" />
                      )}
                      <span className={`text-sm ${!feature.included ? 'text-muted-foreground' : ''}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full h-11 bg-${plan.color} hover:bg-${plan.color}/90`}
                  asChild
                >
                  <Link href="/register">
                    Elegir este plan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Comparación detallada</h2>
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold">Característica</th>
                      <th className="text-center p-4 font-semibold">Básico</th>
                      <th className="text-center p-4 font-semibold">Medium</th>
                      <th className="text-center p-4 font-semibold">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-4">Precio mensual</td>
                      <td className="text-center p-4 font-semibold">$9.99</td>
                      <td className="text-center p-4 font-semibold">$14.99</td>
                      <td className="text-center p-4 font-semibold">$19.99</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4">Calidad de video</td>
                      <td className="text-center p-4">HD (720p)</td>
                      <td className="text-center p-4">Full HD (1080p)</td>
                      <td className="text-center p-4">4K Ultra HD</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4">Dispositivos permitidos</td>
                      <td className="text-center p-4">Ilimitados</td>
                      <td className="text-center p-4">Ilimitados</td>
                      <td className="text-center p-4">Ilimitados</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4">Pantallas simultáneas</td>
                      <td className="text-center p-4">1</td>
                      <td className="text-center p-4">2</td>
                      <td className="text-center p-4">4</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4">Descargas</td>
                      <td className="text-center p-4">
                        <X className="h-5 w-5 mx-auto text-muted-foreground" />
                      </td>
                      <td className="text-center p-4">
                        <Check className="h-5 w-5 mx-auto text-secondary" />
                      </td>
                      <td className="text-center p-4">
                        <Check className="h-5 w-5 mx-auto text-accent" />
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4">Audio Dolby Atmos</td>
                      <td className="text-center p-4">
                        <X className="h-5 w-5 mx-auto text-muted-foreground" />
                      </td>
                      <td className="text-center p-4">
                        <X className="h-5 w-5 mx-auto text-muted-foreground" />
                      </td>
                      <td className="text-center p-4">
                        <Check className="h-5 w-5 mx-auto text-accent" />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4">Puntos por renovación</td>
                      <td className="text-center p-4 font-semibold text-primary">50</td>
                      <td className="text-center p-4 font-semibold text-secondary">100</td>
                      <td className="text-center p-4 font-semibold text-accent">200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
