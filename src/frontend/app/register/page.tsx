'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, ArrowLeft } from 'lucide-react'
import { RegistrationProgress } from '@/components/registration-progress'
import { PlanCard } from '@/components/plan-card'
import { subscriptionsService } from '@/services/subscriptions.service'

// ------------------------
// 1. Base de features para cada plan
// ------------------------
const basePlans = [
  {
    key: "basic",
    accentColor: "primary",
    features: [
      "Calidad HD",
      "{devices} dispositivo(s) a la vez",
      "Catálogo completo",
      "50 puntos por renovación"
    ]
  },
  {
    key: "medium",
    accentColor: "secondary",
    features: [
      "Calidad Full HD",
      "{devices} dispositivos simultáneos",
      "Catálogo completo",
      "Descargas ilimitadas",
      "100 puntos por renovación"
    ]
  },
  {
    key: "premium",
    accentColor: "accent",
    features: [
      "Calidad 4K Ultra HD",
      "{devices} dispositivos simultáneos",
      "Catálogo completo",
      "Descargas ilimitadas",
      "Audio Dolby Atmos",
      "200 puntos por renovación"
    ]
  }
]

// ------------------------
// 2. Llamada a Onboarding
// ------------------------
async function completeOnboarding(body: any) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const url = `${baseUrl}/api/onboarding/complete`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    throw new Error(error.message || "Error completing onboarding");
  }

  return resp.json();
}

// ------------------------
// 3. Fetch de planes reales
// ------------------------
// Use subscriptionsService to fetch plans from backend

export default function RegisterPage() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Datos Step 1
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Datos Step 2
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Datos Step 3
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')

  // ------------------------
  // 4. Cargar planes desde backend
  // ------------------------
  const [apiPlans, setApiPlans] = useState<any[]>([]);
  const [finalPlans, setFinalPlans] = useState<any[]>([]);

  useEffect(() => {
    subscriptionsService.getPlans()
      .then((plans) => {
        setApiPlans(plans);

        // Fusionar datos API con features base
        const merged = plans.map((plan: any, idx: number) => {
          const base = basePlans[idx] || basePlans[0];

          return {
            id: plan.id,
            name: plan.name,
            price: plan.price,
            accentColor: base.accentColor,
            features: base.features.map(f =>
              f.replace("{devices}", plan.maxProfiles?.toString() || '1')
            )
          };
        });

        setFinalPlans(merged);
      })
      .catch(console.error);
  }, []);

  // ------------------------
  // 5. Step 1
  // ------------------------
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    setStep(2)
  }

  // ------------------------
  // 6. Step 2
  // ------------------------
  const handleStep2Submit = () => {
    if (!selectedPlan) {
      alert('Por favor selecciona un plan')
      return
    }
    setStep(3)
  }

  // ------------------------
  // 7. Step 3 - Completar onboarding
  // ------------------------
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const body = {
        user: {
          email,
          password,
          fullName,
          birthDate,
        },
        planId: selectedPlan!,
        payment: {
          cardNumber,
          expiration: expiryDate,
          cvv,
          nameOnCard: cardName,
          pointsToRedeem: 0,
        },
      };

      console.log("Sending:", body);

      const response = await completeOnboarding(body);

      console.log("Success:", response);

      localStorage.setItem("accessToken", response.accessToken);

      alert("¡Cuenta creada exitosamente!");
      router.push("/dashboard");

    } catch (err: any) {
      console.error("Onboarding error:", err);
      alert(err.message || "Error al crear la cuenta");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      {/* Logo Header */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Play className="h-10 w-10 text-primary fill-primary" />
        <span className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          NextFlop
        </span>
      </Link>

      {/* Progress Indicator */}
      <RegistrationProgress currentStep={step} totalSteps={3} />

      {/* Step 1: User Data */}
      {step === 1 && (
        <Card className="w-full max-w-lg bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Crear cuenta</CardTitle>
            <CardDescription>Paso 1 de 3: Datos del usuario</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90"
              >
                Siguiente
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Plan Selection */}
      {step === 2 && (
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Selecciona tu plan</h2>
            <p className="text-muted-foreground">Paso 2 de 3: Elige el plan perfecto para ti</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {finalPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                features={plan.features}
                accentColor={plan.accentColor}
                isSelected={selectedPlan === plan.id}
                onSelect={() => setSelectedPlan(plan.id)}
              />
            ))}
          </div>

          <div className="flex gap-4 max-w-lg mx-auto">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleStep2Submit}
              disabled={!selectedPlan}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="w-full max-w-4xl">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Información de pago</CardTitle>
              <CardDescription>Paso 3 de 3: Completa tu suscripción</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Payment Form */}
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de tarjeta</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Fecha de expiración</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/AA"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                        maxLength={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="JUAN PEREZ"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Al continuar aceptas nuestras{' '}
                      <Link href="#" className="text-primary hover:underline">
                        Condiciones de Uso
                      </Link>
                      {' '}y{' '}
                      <Link href="#" className="text-primary hover:underline">
                        Política de Privacidad
                      </Link>
                      . Tu suscripción se renovará automáticamente.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(2)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Procesando...' : 'Finalizar y crear cuenta'}
                    </Button>
                  </div>
                </form>

                {/* Plan Summary */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Resumen de tu plan</h3>
                    {selectedPlan && (
                      <Card className="bg-card border-border">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-semibold text-lg">
                                Plan {finalPlans.find(p => p.id === selectedPlan)?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">Suscripción mensual</p>
                            </div>

                            <p className="text-2xl font-bold">
                              ${finalPlans.find(p => p.id === selectedPlan)?.price}
                            </p>
                          </div>

                          <Button
                            variant="link"
                            className="p-0 h-auto text-primary"
                            onClick={() => setStep(2)}
                          >
                            Cambiar plan
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold text-primary">Beneficio especial:</span>{' '}
                      Comenzarás a acumular puntos desde tu primera renovación mensual.
                      ¡Canjéalos por meses gratis y descuentos exclusivos!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
