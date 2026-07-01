import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar as CalendarIcon, List, Clock, Search, LogIn, LogOut, Plus, Edit, Trash2, MessageSquare, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'

export interface Comment {
  id: string
  author: string
  role: 'Marketing' | 'Agência'
  text: string
  createdAt: string
}

export interface Campaign {
  id: string
  name: string
  channels: string[]
  startDate: string
  endDate: string
  status: 'A começar' | 'Em andamento' | 'Pausada' | 'Concluída'
  budget?: number
  notes?: string
  comments: Comment[]
}

interface AgendaProps {
  campaigns: Campaign[]
  isAdmin: boolean
  onLogout?: () => void
  onNavigateToLogin?: () => void
  onAddComment: (campaignId: string, author: string, text: string) => void
  onOpenCreateModal?: () => void
  onOpenEditModal?: (campaign: Campaign) => void
  onOpenDeleteModal?: (campaign: Campaign) => void
  loading?: boolean
  error?: string | null
}

// Função para mapear cores pastéis personalizadas para cada canal de mídia
export const getChannelColor = (channel: string): string => {
  const colors: Record<string, string> = {
    Meta: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/45 dark:text-blue-300 dark:border-blue-900/50',
    Google: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/45 dark:text-red-300 dark:border-red-900/50',
    LinkedIn: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/45 dark:text-sky-300 dark:border-sky-900/50',
    WhatsApp: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/45 dark:text-emerald-300 dark:border-emerald-900/50',
    YouTube: 'bg-rose-50 text-rose-805 border-rose-200 dark:bg-rose-950/45 dark:text-rose-300 dark:border-rose-900/50',
    TV: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/45 dark:text-purple-300 dark:border-purple-900/50',
    Radio: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/45 dark:text-amber-300 dark:border-amber-900/50',
    Email: 'bg-indigo-50 text-indigo-850 border-indigo-200 dark:bg-indigo-950/45 dark:text-indigo-300 dark:border-indigo-900/50'
  }
  return colors[channel] || 'bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800/50'
}

// 1. Função para gerar cores pastéis consistentes e harmoniosas por ID de campanha
interface PastelScheme {
  bg: string
  text: string
  border: string
  hoverBg: string
  dot: string
}

export const getPastelColor = (campaignId: string): PastelScheme => {
  const schemes: PastelScheme[] = [
    { 
      bg: 'bg-emerald-50 dark:bg-emerald-950/30', 
      text: 'text-emerald-800 dark:text-emerald-300', 
      border: 'border-emerald-200 dark:border-emerald-800/60', 
      hoverBg: 'hover:bg-emerald-100 dark:hover:bg-emerald-950/50',
      dot: 'bg-emerald-500' 
    },
    { 
      bg: 'bg-sky-50 dark:bg-sky-950/30', 
      text: 'text-sky-800 dark:text-sky-300', 
      border: 'border-sky-200 dark:border-sky-800/60', 
      hoverBg: 'hover:bg-sky-100 dark:hover:bg-sky-950/50',
      dot: 'bg-sky-500' 
    },
    { 
      bg: 'bg-purple-50 dark:bg-purple-950/30', 
      text: 'text-purple-800 dark:text-purple-300', 
      border: 'border-purple-200 dark:border-purple-800/60', 
      hoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-950/50',
      dot: 'bg-purple-500' 
    },
    { 
      bg: 'bg-amber-50 dark:bg-amber-950/30', 
      text: 'text-amber-800 dark:text-amber-300', 
      border: 'border-amber-200 dark:border-amber-800/60', 
      hoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-950/50',
      dot: 'bg-amber-500' 
    },
    { 
      bg: 'bg-rose-50 dark:bg-rose-950/30', 
      text: 'text-rose-800 dark:text-rose-300', 
      border: 'border-rose-200 dark:border-rose-800/60', 
      hoverBg: 'hover:bg-rose-100 dark:hover:bg-rose-950/50',
      dot: 'bg-rose-500' 
    },
    { 
      bg: 'bg-indigo-50 dark:bg-indigo-950/30', 
      text: 'text-indigo-800 dark:text-indigo-300', 
      border: 'border-indigo-200 dark:border-indigo-800/60', 
      hoverBg: 'hover:bg-indigo-100 dark:hover:bg-indigo-950/50',
      dot: 'bg-indigo-500' 
    },
    { 
      bg: 'bg-teal-50 dark:bg-teal-950/30', 
      text: 'text-teal-800 dark:text-teal-300', 
      border: 'border-teal-200 dark:border-teal-800/60', 
      hoverBg: 'hover:bg-teal-100 dark:hover:bg-teal-950/50',
      dot: 'bg-teal-500' 
    },
    { 
      bg: 'bg-orange-50 dark:bg-orange-950/30', 
      text: 'text-orange-800 dark:text-orange-300', 
      border: 'border-orange-200 dark:border-orange-800/60', 
      hoverBg: 'hover:bg-orange-100 dark:hover:bg-orange-950/50',
      dot: 'bg-orange-500' 
    }
  ]

  let hash = 0
  for (let i = 0; i < campaignId.length; i++) {
    hash = campaignId.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % schemes.length
  return schemes[idx]
}

// 2. Auxiliares para cálculo de data e geração do calendário semanal/mensal
const toDateString = (d: Date) => d.toISOString().split('T')[0]

const getWeeksOfMonth = (year: number, month: number): Date[][] => {
  const weeks: Date[][] = []
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  // Encontra o domingo da primeira semana do mês
  const startDay = new Date(firstDayOfMonth)
  startDay.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay())
  
  const currentDay = new Date(startDay)
  
  while (currentDay <= lastDayOfMonth || currentDay.getDay() !== 0) {
    if (currentDay.getDay() === 0) {
      weeks.push([])
    }
    weeks[weeks.length - 1].push(new Date(currentDay))
    currentDay.setDate(currentDay.getDate() + 1)
  }
  return weeks
}

const getStartOfWeek = (d: Date): Date => {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day
  return new Date(date.setDate(diff))
}

export default function AgendaPage({
  campaigns,
  isAdmin,
  onLogout,
  onNavigateToLogin,
  onAddComment,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenDeleteModal,
  loading = false,
  error = null
}: AgendaProps) {
  const [view, setView] = React.useState<'monthly' | 'weekly' | 'list'>('list')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedChannel, setSelectedChannel] = React.useState<string | null>(null)
  const [listTab, setListTab] = React.useState<'active' | 'completed'>('active')
  const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign | null>(null)
  
  // Estado da data atual de navegação (Inicializado no mês de testes: Agosto de 2026)
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date(2026, 7, 1))

  const [commentName, setCommentName] = React.useState('')
  const [commentText, setCommentText] = React.useState('')
  const [commentError, setCommentError] = React.useState<string | null>(null)

  // Extrai canais para filtro
  const allChannels = React.useMemo(() => {
    const channels = new Set<string>()
    campaigns.forEach(c => c.channels.forEach(ch => channels.add(ch)))
    return Array.from(channels)
  }, [campaigns])

  // Filtra campanhas com base na busca e canal selecionado
  const filteredCampaigns = React.useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (campaign.notes && campaign.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesChannel = selectedChannel ? campaign.channels.includes(selectedChannel) : true
      return matchesSearch && matchesChannel
    })
  }, [campaigns, searchQuery, selectedChannel])

  // Regra de Negócio: Filtra campanhas Ativas (não concluídas) para exibições de calendário
  const activeCampaigns = React.useMemo(() => {
    return filteredCampaigns.filter(c => c.status !== 'Concluída')
  }, [filteredCampaigns])

  const completedCampaigns = React.useMemo(() => {
    return filteredCampaigns.filter(c => c.status === 'Concluída')
  }, [filteredCampaigns])

  // Lógica de navegação de datas
  const handlePrevPeriod = () => {
    if (view === 'monthly') {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    } else if (view === 'weekly') {
      setCurrentDate(prev => {
        const next = new Date(prev)
        next.setDate(prev.getDate() - 7)
        return next
      })
    }
  }

  const handleNextPeriod = () => {
    if (view === 'monthly') {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    } else if (view === 'weekly') {
      setCurrentDate(prev => {
        const next = new Date(prev)
        next.setDate(prev.getDate() + 7)
        return next
      })
    }
  }

  const handleToday = () => {
    // Retorna para o mês padrão dos dados de exemplo
    setCurrentDate(new Date(2026, 7, 1))
  }

  // Envio de comentários
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCommentError(null)

    if (!commentText.trim()) {
      setCommentError('O texto do comentário não pode estar vazio.')
      return
    }

    if (commentText.length > 500) {
      setCommentError('O comentário deve ter no máximo 500 caracteres.')
      return
    }

    let authorName = 'Mariana Silva (Marketing)'
    if (!isAdmin) {
      if (!commentName.trim()) {
        setCommentError('Por favor, informe seu nome para comentar.')
        return
      }
      authorName = commentName.trim()
    }

    if (selectedCampaign) {
      onAddComment(selectedCampaign.id, authorName, commentText.trim())
      
      const updatedCampaign = campaigns.find(c => c.id === selectedCampaign.id)
      if (updatedCampaign) {
        setSelectedCampaign({
          ...updatedCampaign,
          comments: [
            ...updatedCampaign.comments,
            {
              id: Date.now().toString(),
              author: authorName,
              role: isAdmin ? 'Marketing' : 'Agência',
              text: commentText.trim(),
              createdAt: new Date().toISOString()
            }
          ]
        })
      }

      setCommentText('')
      if (!isAdmin) setCommentName('')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'A começar': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Em andamento': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      Pausada: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      Concluída: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    }
    return colors[status] || 'bg-slate-100 text-slate-800'
  }

  // --- Algoritmo de geração das semanas do calendário ---
  const weeks = React.useMemo(() => {
    return getWeeksOfMonth(currentDate.getFullYear(), currentDate.getMonth())
  }, [currentDate])

  const weekDaysHeader = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <CalendarIcon className="size-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Agenda de Campanhas</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-muted p-1 rounded-lg text-sm font-medium gap-1" role="tablist">
              {['monthly', 'weekly', 'list'].map((tab) => (
                <Button
                  key={tab}
                  variant={view === tab ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 capitalize"
                  onClick={() => setView(tab as any)}
                  role="tab"
                  aria-selected={view === tab}
                >
                  {tab === 'monthly' ? 'Mensal' : tab === 'weekly' ? 'Semanal' : 'Lista'}
                </Button>
              ))}
            </div>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden md:inline-block">
                  Logado como <strong className="text-foreground">Marketing</strong>
                </span>
                {onOpenCreateModal && (
                  <Button size="sm" className="gap-1.5" onClick={onOpenCreateModal}>
                    <Plus className="size-4" />
                    Nova Campanha
                  </Button>
                )}
                {onLogout && (
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={onLogout}>
                    <LogOut className="size-4" />
                    Sair
                  </Button>
                )}
              </div>
            ) : (
              onNavigateToLogin && (
                <Button variant="outline" size="sm" className="gap-1.5 border-border hover:bg-muted" onClick={onNavigateToLogin}>
                  <LogIn className="size-4" />
                  Área Restrita
                </Button>
              )
            )}
          </div>
        </div>
      </header>

      {/* Barra de Filtros */}
      <section className="bg-muted/20 border-b border-border py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar campanha..."
              maxLength={100}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-sm font-medium text-muted-foreground shrink-0">Filtrar por canal:</span>
            <Button
              variant={selectedChannel === null ? 'secondary' : 'outline'}
              size="xs"
              className="rounded-full shrink-0"
              onClick={() => setSelectedChannel(null)}
            >
              Todos
            </Button>
            {allChannels.map(channel => (
              <Button
                key={channel}
                variant={selectedChannel === channel ? 'secondary' : 'outline'}
                size="xs"
                className="rounded-full shrink-0"
                onClick={() => setSelectedChannel(channel)}
              >
                {channel}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-muted/60 w-1/4 rounded"></div>
            <div className="h-96 bg-muted/30 rounded-xl"></div>
          </div>
        )}

        {error && !loading && (
          <Card className="max-w-xl mx-auto border-destructive/20 bg-destructive/10">
            <CardHeader className="flex flex-row items-center gap-3">
              <AlertTriangle className="size-6 text-destructive" />
              <CardTitle className="text-destructive font-bold">Erro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {/* Navegador de Datas para Visão Mensal e Semanal */}
            {view !== 'list' && (
              <div className="flex items-center justify-between bg-muted/20 border border-border p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="size-8" onClick={handlePrevPeriod} aria-label="Período anterior">
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="size-8" onClick={handleNextPeriod} aria-label="Próximo período">
                    <ChevronRight className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleToday}>Voltar ao Mês Base</Button>
                </div>
                <h2 className="text-sm md:text-base font-bold tracking-tight text-foreground">
                  {view === 'monthly' ? (
                    currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()
                  ) : (
                    `SEMANA DE ${getStartOfWeek(currentDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' })} A ${new Date(getStartOfWeek(currentDate).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' })}`
                  )}
                </h2>
              </div>
            )}

            {/* --- VISUALIZAÇÃO EM CALENDÁRIO MENSAL (ALGORITMO DE FAIXAS/TRIPAS) --- */}
            {view === 'monthly' && (
              <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
                {/* Dias da Semana (Header) */}
                <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center py-2 font-bold text-xs text-muted-foreground uppercase">
                  {weekDaysHeader.map(day => <div key={day}>{day}</div>)}
                </div>

                {/* Weeks Grid */}
                <div className="flex flex-col">
                  {weeks.map((week, weekIdx) => {
                    const weekStartStr = toDateString(week[0])
                    const weekEndStr = toDateString(week[6])

                    // Filtra campanhas ativas no período desta semana específica
                    const weekCampaigns = activeCampaigns.filter(c => {
                      return c.startDate <= weekEndStr && c.endDate >= weekStartStr
                    })

                    // Ordena por data de início para empilhar bonitinho na esquerda primeiro
                    weekCampaigns.sort((a, b) => a.startDate.localeCompare(b.startDate))

                    // Algoritmo de agendamento de faixas horizontais (row tracks) sem colisão
                    const slots: (Campaign | null)[][] = []
                    const placedCampaigns: { campaign: Campaign; rowIdx: number; startIdx: number; colSpan: number }[] = []

                    weekCampaigns.forEach(c => {
                      const segStart = c.startDate < weekStartStr ? weekStartStr : c.startDate
                      const segEnd = c.endDate > weekEndStr ? weekEndStr : c.endDate

                      const startIdx = week.findIndex(d => toDateString(d) === segStart)
                      const endIdx = week.findIndex(d => toDateString(d) === segEnd)
                      const colSpan = endIdx - startIdx + 1

                      let rowIdx = 0
                      while (true) {
                        if (!slots[rowIdx]) {
                          slots[rowIdx] = Array(7).fill(null)
                        }

                        let isFree = true
                        for (let col = startIdx; col <= endIdx; col++) {
                          if (slots[rowIdx][col] !== null) {
                            isFree = false
                            break
                          }
                        }

                        if (isFree) {
                          for (let col = startIdx; col <= endIdx; col++) {
                            slots[rowIdx][col] = c
                          }
                          break
                        }
                        rowIdx++
                      }

                      placedCampaigns.push({ campaign: c, rowIdx, startIdx, colSpan })
                    })

                    return (
                      <div key={weekIdx} className="relative min-h-[120px] border-b border-border/60 last:border-b-0 grid grid-cols-7 pb-2">
                        
                        {/* Grade de fundo (números dos dias) */}
                        {week.map((date, dateIdx) => {
                          const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                          const isToday = toDateString(date) === toDateString(new Date())
                          return (
                            <div
                              key={dateIdx}
                              className={`absolute inset-y-0 border-r border-border/45 last:border-r-0 p-1 flex justify-end ${!isCurrentMonth ? 'bg-muted/10 text-muted-foreground/50' : ''}`}
                              style={{ left: `${(dateIdx / 7) * 100}%`, width: `${100 / 7}%` }}
                            >
                              <span className={`text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                                {date.getDate()}
                              </span>
                            </div>
                          );
                        })}

                        {/* Linha invisível de espaçamento para empilhar o conteúdo abaixo dos números */}
                        <div className="col-span-7 h-7"></div>

                        {/* Faixas/Tripas das Campanhas empilhadas por grids */}
                        <div className="col-span-7 grid grid-cols-7 gap-y-1 relative px-0.5">
                          {placedCampaigns.map(({ campaign, rowIdx, startIdx, colSpan }) => {
                            const colors = getPastelColor(campaign.id)
                            const isStartsThisWeek = campaign.startDate >= weekStartStr
                            const isEndsThisWeek = campaign.endDate <= weekEndStr

                            return (
                              <button
                                key={campaign.id}
                                onClick={() => setSelectedCampaign(campaign)}
                                className={`col-span-7 h-6 text-[10px] md:text-xs px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1.5 cursor-pointer truncate shadow-sm transition-all ${colors.bg} ${colors.text} ${colors.border} ${colors.hoverBg}`}
                                style={{
                                  gridColumn: `${startIdx + 1} / span ${colSpan}`,
                                  gridRow: `${rowIdx + 1}`,
                                  marginLeft: isStartsThisWeek ? '4px' : '0px',
                                  marginRight: isEndsThisWeek ? '4px' : '0px',
                                }}
                              >
                                <span className={`size-1.5 rounded-full shrink-0 ${colors.dot}`} />
                                <span className="truncate">{campaign.name}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* --- VISUALIZAÇÃO EM CALENDÁRIO SEMANAL (ALGORITMO DE FAIXAS/TRIPAS) --- */}
            {view === 'weekly' && (
              <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
                
                {/* Cabeçalho de Dias da Semana com datas */}
                {(() => {
                  const startOfWeek = getStartOfWeek(currentDate)
                  const weekDates = Array.from({ length: 7 }).map((_, i) => {
                    const d = new Date(startOfWeek)
                    d.setDate(startOfWeek.getDate() + i)
                    return d
                  })

                  const weekStartStr = toDateString(weekDates[0])
                  const weekEndStr = toDateString(weekDates[6])

                  // Filtra campanhas que rodam nesta semana
                  const weekCampaigns = activeCampaigns.filter(c => {
                    return c.startDate <= weekEndStr && c.endDate >= weekStartStr
                  })

                  // Ordena para organizar as trilhas horizontais
                  weekCampaigns.sort((a, b) => a.startDate.localeCompare(b.startDate))

                  // Layout das barras contínuas da semana
                  const slots: (Campaign | null)[][] = []
                  const placedCampaigns: { campaign: Campaign; rowIdx: number; startIdx: number; colSpan: number }[] = []

                  weekCampaigns.forEach(c => {
                    const segStart = c.startDate < weekStartStr ? weekStartStr : c.startDate
                    const segEnd = c.endDate > weekEndStr ? weekEndStr : c.endDate

                    const startIdx = weekDates.findIndex(d => toDateString(d) === segStart)
                    const endIdx = weekDates.findIndex(d => toDateString(d) === segEnd)
                    const colSpan = endIdx - startIdx + 1

                    let rowIdx = 0
                    while (true) {
                      if (!slots[rowIdx]) {
                        slots[rowIdx] = Array(7).fill(null)
                      }

                      let isFree = true
                      for (let col = startIdx; col <= endIdx; col++) {
                        if (slots[rowIdx][col] !== null) {
                          isFree = false
                          break
                        }
                      }

                      if (isFree) {
                        for (let col = startIdx; col <= endIdx; col++) {
                          slots[rowIdx][col] = c
                        }
                        break
                      }
                      rowIdx++
                    }

                    placedCampaigns.push({ campaign: c, rowIdx, startIdx, colSpan })
                  })

                  return (
                    <div className="flex flex-col">
                      {/* Top Header */}
                      <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center py-3 font-bold text-xs uppercase text-muted-foreground">
                        {weekDaysHeader.map((dayName, idx) => {
                          const date = weekDates[idx]
                          const isToday = toDateString(date) === toDateString(new Date())
                          return (
                            <div key={dayName} className="flex flex-col items-center gap-0.5">
                              <span>{dayName}</span>
                              <span className={`text-[14px] font-bold h-6 w-6 rounded-full flex items-center justify-center mt-1 ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                                {date.getDate()}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Timeline Tracks Grid */}
                      <div className="relative min-h-[300px] grid grid-cols-7 py-4 gap-y-2">
                        {/* Linhas de grade vertical de fundo */}
                        {weekDates.map((_, idx) => (
                          <div
                            key={idx}
                            className="absolute inset-y-0 border-r border-border/45 last:border-r-0"
                            style={{ left: `${(idx / 7) * 100}%`, width: `${100 / 7}%` }}
                          />
                        ))}

                        {/* Renderização das faixas/tripas na grade de 7 colunas */}
                        <div className="col-span-7 grid grid-cols-7 gap-y-2.5 relative px-1">
                          {placedCampaigns.length === 0 ? (
                            <div className="col-span-7 text-center py-16 text-xs text-muted-foreground italic">
                              Sem campanhas programadas nesta semana.
                            </div>
                          ) : (
                            placedCampaigns.map(({ campaign, rowIdx, startIdx, colSpan }) => {
                              const colors = getPastelColor(campaign.id)
                              const isStartsThisWeek = campaign.startDate >= weekStartStr
                              const isEndsThisWeek = campaign.endDate <= weekEndStr

                              return (
                                <button
                                  key={campaign.id}
                                  onClick={() => setSelectedCampaign(campaign)}
                                  className={`col-span-7 h-8 text-[11px] md:text-sm px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-2 cursor-pointer truncate shadow-sm transition-all ${colors.bg} ${colors.text} ${colors.border} ${colors.hoverBg}`}
                                  style={{
                                    gridColumn: `${startIdx + 1} / span ${colSpan}`,
                                    gridRow: `${rowIdx + 1}`,
                                    marginLeft: isStartsThisWeek ? '6px' : '0px',
                                    marginRight: isEndsThisWeek ? '6px' : '0px',
                                  }}
                                >
                                  <span className={`size-2 rounded-full shrink-0 ${colors.dot}`} />
                                  <span className="truncate">{campaign.name}</span>
                                </button>
                              )
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* --- VISUALIZAÇÃO EM LISTA --- */}
            {view === 'list' && (
              <div className="space-y-6">
                <div className="flex border-b border-border gap-6">
                  <button
                    onClick={() => setListTab('active')}
                    className={`pb-2.5 text-sm font-semibold tracking-tight transition-all border-b-2 relative -bottom-[2px] ${listTab === 'active' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    role="tab"
                    aria-selected={listTab === 'active'}
                  >
                    Campanhas Ativas / A Começar ({activeCampaigns.length})
                  </button>
                  <button
                    onClick={() => setListTab('completed')}
                    className={`pb-2.5 text-sm font-semibold tracking-tight transition-all border-b-2 relative -bottom-[2px] ${listTab === 'completed' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    role="tab"
                    aria-selected={listTab === 'completed'}
                  >
                    Concluídas ({completedCampaigns.length})
                  </button>
                </div>

                {((listTab === 'active' && activeCampaigns.length === 0) ||
                  (listTab === 'completed' && completedCampaigns.length === 0)) && (
                  <div className="text-center py-16 px-4 bg-muted/10 border border-dashed border-border rounded-xl">
                    <List className="mx-auto size-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-bold text-foreground mb-1">Nenhuma campanha encontrada</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Não há registros cadastrados ou os filtros selecionados ocultaram as campanhas desta aba.
                    </p>
                  </div>
                )}

                {/* Exibição dos cards de campanhas na Lista */}
                {((listTab === 'active' ? activeCampaigns : completedCampaigns)).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(listTab === 'active' ? activeCampaigns : completedCampaigns).map(c => {
                      const colors = getPastelColor(c.id)
                      return (
                        <Card key={c.id} className={`border-border hover:shadow-md transition-all flex flex-col justify-between bg-card group relative overflow-hidden`}>
                          
                          {/* Faixa lateral decorativa pastel para integrar a cor identificadora no card */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${colors.dot}`} />

                          <CardHeader className="pb-3 pl-5">
                            <div className="flex justify-between items-start gap-2">
                              <Badge className={getStatusColor(c.status)} variant="outline">{c.status}</Badge>
                              {isAdmin && (
                                <div className="flex gap-1">
                                  {onOpenEditModal && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-7 text-muted-foreground hover:text-foreground"
                                      onClick={() => onOpenEditModal(c)}
                                      aria-label="Editar"
                                    >
                                      <Edit className="size-3.5" />
                                    </Button>
                                  )}
                                  {onOpenDeleteModal && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-7 text-destructive hover:text-destructive"
                                      onClick={() => onOpenDeleteModal(c)}
                                      aria-label="Excluir"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                            <CardTitle className="text-lg font-bold mt-2 group-hover:text-primary transition-colors">{c.name}</CardTitle>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {c.channels.map(ch => (
                                <Badge key={ch} className={getChannelColor(ch)} variant="secondary">{ch}</Badge>
                              ))}
                            </div>
                          </CardHeader>
                          <CardContent className="text-sm space-y-3 pb-3 pl-5">
                            <div className="flex items-center text-muted-foreground text-xs gap-1.5">
                              <Clock className="size-3.5" />
                              <span>
                                {new Date(c.startDate).toLocaleDateString('pt-BR')} até {new Date(c.endDate).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            {c.budget && (
                              <p className="text-sm font-semibold">
                                Orçamento: <span className="text-foreground">{c.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                              </p>
                            )}
                            {c.notes && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {c.notes}
                              </p>
                            )}
                          </CardContent>
                          <CardFooter className="pt-2 border-t border-border/40 flex items-center justify-between pl-5">
                            <Button variant="ghost" size="sm" className="w-full text-xs font-semibold gap-1.5 hover:bg-muted text-muted-foreground hover:text-foreground" onClick={() => setSelectedCampaign(c)}>
                              <MessageSquare className="size-3.5" />
                              Ver Detalhes e Comentários ({c.comments.length})
                            </Button>
                          </CardFooter>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/10 py-6 mt-12 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Agenda de Campanhas. Desenvolvido para alinhamento entre Marketing & Agência.</p>
        </div>
      </footer>

      {/* Modal de Detalhes da Campanha e Seção de Comentários */}
      <Dialog open={selectedCampaign !== null} onOpenChange={open => !open && setSelectedCampaign(null)}>
        {selectedCampaign && (
          <DialogContent className="max-w-2xl bg-card border-border max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge className={getStatusColor(selectedCampaign.status)} variant="outline">
                  {selectedCampaign.status}
                </Badge>
                {selectedCampaign.channels.map(ch => (
                  <Badge key={ch} className={getChannelColor(ch)} variant="secondary">
                    {ch}
                  </Badge>
                ))}
              </div>
              <DialogTitle className="text-2xl font-bold mt-2 text-foreground">{selectedCampaign.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-1.5 mt-1">
                <Clock className="size-3.5" />
                Vigência: {new Date(selectedCampaign.startDate).toLocaleDateString('pt-BR')} a {new Date(selectedCampaign.endDate).toLocaleDateString('pt-BR')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-4 border-t border-b border-border/40 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedCampaign.budget && (
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase">Orçamento Planejado</h4>
                    <p className="text-lg font-semibold mt-0.5 text-foreground">
                      {selectedCampaign.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                )}
              </div>

              {selectedCampaign.notes && (
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">Observações / Detalhes</h4>
                  <p className="text-sm mt-1 text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedCampaign.notes}
                  </p>
                </div>
              )}

              {/* Feed de Comentários */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3 flex items-center gap-1.5">
                  <MessageSquare className="size-4" />
                  Feed de Comentários ({selectedCampaign.comments.length})
                </h4>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {selectedCampaign.comments.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic py-3 text-center bg-muted/20 rounded-lg">
                      Nenhum comentário cadastrado ainda. Seja o primeiro a registrar!
                    </p>
                  ) : (
                    selectedCampaign.comments.map(comment => (
                      <div key={comment.id} className="p-3 bg-muted/30 rounded-lg border border-border/30 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-foreground flex items-center gap-1">
                            {comment.author}
                            <Badge variant="outline" className={`text-[9px] px-1 py-0 ${comment.role === 'Marketing' ? 'border-primary/20 text-primary bg-primary/5' : 'border-blue-200 text-blue-700 bg-blue-50/50'}`}>
                              {comment.role}
                            </Badge>
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Formulário para Comentário */}
              <form onSubmit={handleCommentSubmit} className="space-y-3 bg-muted/20 p-4 rounded-lg border border-border/40">
                <h5 className="text-xs font-bold text-foreground">Deixar um comentário</h5>
                
                {commentError && (
                  <p className="text-xs text-destructive font-medium" role="alert">{commentError}</p>
                )}

                {!isAdmin && (
                  <div className="space-y-1.5">
                    <Label htmlFor="commenter-name" className="text-[11px] font-semibold">Seu Nome / Identificação (Ex: Roberto - Agência)</Label>
                    <Input
                      id="commenter-name"
                      placeholder="Identifique-se"
                      maxLength={100}
                      value={commentName}
                      onChange={e => setCommentName(e.target.value)}
                      className="h-8 text-xs bg-card focus-visible:ring-primary/50"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="comment-text" className="text-[11px] font-semibold">Mensagem / Alinhamento</Label>
                  <textarea
                    id="comment-text"
                    placeholder="Digite sua dúvida ou nota de alinhamento..."
                    maxLength={500}
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    rows={3}
                    className="w-full text-xs p-2 rounded-md bg-card border border-border outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                  <div className="text-[10px] text-muted-foreground text-right">
                    {commentText.length}/500 caracteres
                  </div>
                </div>

                <Button type="submit" size="sm" className="w-full sm:w-auto">Enviar Comentário</Button>
              </form>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedCampaign(null)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
