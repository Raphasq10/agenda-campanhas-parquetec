import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, ShieldAlert, KeyRound } from 'lucide-react'

// Schema de validação Zod para a barreira pública de acesso
const gateSchema = z.object({
  username: z.string()
    .min(1, { message: 'O usuário é obrigatório.' })
    .trim(),
  password: z.string()
    .min(1, { message: 'A senha de acesso é obrigatória.' })
})

type GateFormValues = z.infer<typeof gateSchema>

interface PublicGateProps {
  onAccessGranted: () => void
  onNavigateToLogin: () => void
}

export default function PublicGatePage({ onAccessGranted, onNavigateToLogin }: PublicGateProps) {
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<GateFormValues>({
    resolver: zodResolver(gateSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onSubmit = (data: GateFormValues) => {
    setLoading(true)
    setErrorMsg(null)

    // Validação estática segura do lado do cliente
    if (data.username === 'agencia' && data.password === 'itaipuparquetec789R$') {
      localStorage.setItem('public_access_granted', 'true')
      onAccessGranted()
    } else {
      setErrorMsg('Usuário ou senha de acesso incorretos. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-border bg-card">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <KeyRound className="size-6 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Agenda Protegida</CardTitle>
          <CardDescription>
            Insira as credenciais de acesso geral para visualizar o calendário
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 font-medium flex items-start gap-2 animate-shake" role="alert">
                <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold">
                Usuário
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Ex: agencia"
                maxLength={50}
                className="w-full focus-visible:ring-primary/50 focus-visible:border-primary"
                {...register('username')}
                aria-invalid={errors.username ? 'true' : 'false'}
              />
              {errors.username && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                Senha de Acesso
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite a senha de acesso"
                  maxLength={50}
                  className="w-full pr-10 focus-visible:ring-primary/50 focus-visible:border-primary"
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 mt-2">
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5 text-base font-semibold"
              disabled={loading}
            >
              {loading ? 'Validando acesso...' : 'Desbloquear Agenda'}
            </Button>
            <div className="text-center mt-3 w-full">
              <button 
                type="button" 
                onClick={onNavigateToLogin}
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 focus-visible:outline-none"
              >
                Acesso da Equipe (Área Restrita)
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
