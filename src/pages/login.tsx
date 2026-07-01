import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, User, ArrowLeft } from 'lucide-react'

// Schema de validação Zod para garantir que os dados de login sigam as regras básicas de segurança
const loginSchema = z.object({
  username: z.string()
    .min(3, { message: 'O login deve ter pelo menos 3 caracteres.' })
    .max(50, { message: 'O login deve ter no máximo 50 caracteres.' })
    .trim(),
  password: z.string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
    .max(50, { message: 'A senha deve ter no máximo 50 caracteres.' })
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginProps {
  onLoginSuccess: () => void
  onBackToAgenda: () => void
}

export default function LoginPage({ onLoginSuccess, onBackToAgenda }: LoginProps) {
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  // Simulação do envio de login para validação (lógica de autenticação com banco virá depois)
  const onSubmit = (data: LoginFormValues) => {
    setLoading(true)
    setErrorMsg(null)

    setTimeout(() => {
      // Simulação rápida para propósitos visuais: aceita qualquer usuário admin com senha '123456'
      if (data.username === 'admin' && data.password === '123456') {
        onLoginSuccess()
      } else {
        setErrorMsg('Usuário ou senha inválidos. Tente usar "admin" e "123456".')
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-12">
      {/* Botão de retorno rápido para acessibilidade e navegação */}
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          onClick={onBackToAgenda}
          className="gap-2 text-muted-foreground hover:text-foreground"
          aria-label="Voltar para a página pública da agenda"
        >
          <ArrowLeft className="size-4" />
          Voltar para a Agenda
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-lg border-border bg-card">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Lock className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Área Restrita</CardTitle>
          <CardDescription>
            Faça login para gerenciar o calendário de campanhas
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 font-medium" role="alert">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold flex items-center gap-1.5">
                <User className="size-3.5 text-muted-foreground" />
                Login
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Ex: admin"
                maxLength={50} // Limite rígido contra overflows e ataques
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
              <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-1.5">
                <Lock className="size-3.5 text-muted-foreground" />
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                maxLength={50} // Limite rígido
                className="w-full focus-visible:ring-primary/50 focus-visible:border-primary"
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
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
              {loading ? 'Validando acesso...' : 'Entrar na Agenda'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
