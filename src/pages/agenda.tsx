import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar as CalendarIcon, List, Clock, Search, LogIn, LogOut, Plus, Edit, Trash2, MessageSquare, AlertTriangle } from 'lucide-react'

// Definição da estrutura de dados para Campanhas e Comentários
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
  // Controle de visualização de tela ('monthly' | 'weekly' | 'list')
  const [view, setView] = React.useState<'monthly' | 'weekly' | 'list'>('list')
  // Filtros de busca e plataforma
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedChannel, setSelectedChannel] = React.useState<string | null>(null)
  // Aba ativa na visualização em lista ('active' | 'completed')
  const [listTab, setListTab] = React.useState<'active' | 'completed'>('active')
  // Estado do Modal de Detalhes da Campanha
  const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign | null>(null)
  
  // Estados para o formulário de novo comentário
  const [commentName, setCommentName] = React.useState('')
  const [commentText, setCommentText] = React.useState('')
  const [commentError, setCommentError] = React.useState<string | null>(null)

  // Extrai canais únicos para carregar o filtro
  const allChannels = React.useMemo(() => {
    const channels = new Set<string>()
    campaigns.forEach(c => c.channels.forEach(ch => channels.add(ch)))
    return Array.from(channels)
  }, [campaigns])

  // Filtra as campanhas com base no input de busca e tag selecionada
  const filteredCampaigns = React.useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (campaign.notes && campaign.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesChannel = selectedChannel ? campaign.channels.includes(selectedChannel) : true
      
      return matchesSearch && matchesChannel
    })
  }, [campaigns, searchQuery, selectedChannel])

  // Separa as campanhas ativas e concluídas
  const activeCampaigns = React.useMemo(() => {
    // Regra de Negócio: Campanhas "Concluídas" saem do calendário e ficam agrupadas na lista
    return filteredCampaigns.filter(c => c.status !== 'Concluída')
  }, [filteredCampaigns])

  const completedCampaigns = React.useMemo(() => {
    return filteredCampaigns.filter(c => c.status === 'Concluída')
  }, [filteredCampaigns])

  // Submissão do formulário de novos comentários
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
      if (commentName.length > 100) {
        setCommentError('Seu nome deve ter no máximo 100 caracteres.')
        return
      }
      authorName = commentName.trim()
    }

    if (selectedCampaign) {
      onAddComment(selectedCampaign.id, authorName, commentText.trim())
      
      // Atualiza o modal de detalhes para exibir o novo comentário adicionado
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

  // Cores de tag por canal
  const getChannelColor = (channel: string) => {
    const colors: Record<string, string> = {
      Meta: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      Google: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      LinkedIn: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
      WhatsApp: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      YouTube: 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200',
      TV: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      Radio: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    }
    return colors[channel] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'A começar': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Em andamento': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      Pausada: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      Concluída: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    }
    return colors[status] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 1. Header do Layout Base */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <CalendarIcon className="size-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Agenda de Campanhas</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Navegação/Visualizações */}
            <div className="hidden sm:flex bg-muted p-1 rounded-lg text-sm font-medium gap-1" role="tablist">
              <Button
                variant={view === 'monthly' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => setView('monthly')}
                role="tab"
                aria-selected={view === 'monthly'}
              >
                Mensal
              </Button>
              <Button
                variant={view === 'weekly' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => setView('weekly')}
                role="tab"
                aria-selected={view === 'weekly'}
              >
                Semanal
              </Button>
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => setView('list')}
                role="tab"
                aria-selected={view === 'list'}
              >
                Lista
              </Button>
            </div>

            {/* Login / Logout Auth Controls */}
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

      {/* 2. Área de Filtros e Busca */}
      <section className="bg-muted/20 border-b border-border py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar campanha por nome ou notas..."
              maxLength={100}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border focus-visible:ring-primary/50"
              aria-label="Buscar campanhas"
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

      {/* 3. Área de Conteúdo Principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* Loading State (Esqueleto) */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse border-border bg-card">
                <CardHeader className="h-24 bg-muted/50 rounded-t-lg"></CardHeader>
                <CardContent className="h-32 space-y-4 py-6">
                  <div className="h-4 bg-muted/50 w-1/3 rounded"></div>
                  <div className="h-4 bg-muted/50 w-2/3 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="max-w-xl mx-auto border-destructive/20 bg-destructive/10">
            <CardHeader className="flex flex-row items-center gap-3">
              <AlertTriangle className="size-6 text-destructive" />
              <CardTitle className="text-destructive font-bold">Erro de Conexão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive/95">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Renderização das Visualizações de Telas (Quando não está carregando nem deu erro) */}
        {!loading && !error && (
          <>
            {/* --- VISUALIZAÇÃO EM CALENDÁRIO MENSAL --- */}
            {view === 'monthly' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold tracking-tight text-foreground">Visualização Mensal — Agosto 2026</h2>
                  <p className="text-xs text-muted-foreground">* Campanhas concluídas não são listadas no calendário.</p>
                </div>
                
                {/* Grade de calendário simplificada para visualização visual de MVP */}
                <div className="grid grid-cols-7 gap-1 border border-border bg-muted/50 rounded-lg p-1">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center font-bold text-xs py-2 text-muted-foreground uppercase">{day}</div>
                  ))}
                  {/* Grid de dias - Simulação de Agosto de 2026 (começa no Sábado, dia 1) */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-background/20 min-h-24 p-1 rounded"></div>
                  ))}
                  {Array.from({ length: 31 }).map((_, idx) => {
                    const day = idx + 1
                    const dateStr = `2026-08-${day.toString().padStart(2, '0')}`
                    
                    // Encontra quais campanhas ativas rodam neste dia específico
                    const dayCampaigns = activeCampaigns.filter(c => {
                      return dateStr >= c.startDate && dateStr <= c.endDate
                    })

                    return (
                      <div key={day} className="bg-card border border-border/60 min-h-24 p-1.5 rounded flex flex-col justify-between hover:border-border transition-all">
                        <span className="font-semibold text-xs text-muted-foreground">{day}</span>
                        <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-16">
                          {dayCampaigns.map(c => (
                            <button
                              key={c.id}
                              onClick={() => setSelectedCampaign(c)}
                              className="text-[10px] leading-tight px-1 py-0.5 rounded truncate text-left font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all"
                              title={`${c.name} (${c.channels.join(', ')})`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* --- VISUALIZAÇÃO EM CALENDÁRIO SEMANAL --- */}
            {view === 'weekly' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-foreground">Visualização Semanal (02/08/2026 a 08/08/2026)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {[
                    { name: 'Domingo', date: '2026-08-02' },
                    { name: 'Segunda', date: '2026-08-03' },
                    { name: 'Terça', date: '2026-08-04' },
                    { name: 'Quarta', date: '2026-08-05' },
                    { name: 'Quinta', date: '2026-08-06' },
                    { name: 'Sexta', date: '2026-08-07' },
                    { name: 'Sábado', date: '2026-08-08' }
                  ].map(dayObj => {
                    const dayCampaigns = activeCampaigns.filter(c => {
                      return dayObj.date >= c.startDate && dayObj.date <= c.endDate
                    })

                    return (
                      <Card key={dayObj.name} className="border-border bg-card">
                        <CardHeader className="p-3 bg-muted/40 border-b border-border text-center">
                          <span className="font-bold text-sm block">{dayObj.name}</span>
                          <span className="text-[10px] text-muted-foreground">{new Date(dayObj.date).toLocaleDateString('pt-BR')}</span>
                        </CardHeader>
                        <CardContent className="p-3 space-y-2 min-h-36">
                          {dayCampaigns.length === 0 ? (
                            <span className="text-[11px] text-muted-foreground italic text-center block mt-6">Sem campanhas</span>
                          ) : (
                            dayCampaigns.map(c => (
                              <div
                                key={c.id}
                                onClick={() => setSelectedCampaign(c)}
                                className="p-2 rounded text-xs text-left bg-secondary text-secondary-foreground border border-border hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all"
                              >
                                <span className="font-semibold block truncate">{c.name}</span>
                                <div className="flex flex-wrap gap-0.5 mt-1">
                                  {c.channels.slice(0, 2).map(ch => (
                                    <span key={ch} className="text-[8px] bg-background px-1 rounded">{ch}</span>
                                  ))}
                                </div>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* --- VISUALIZAÇÃO EM LISTA (CRONOLÓGICA COM ABAS) --- */}
            {view === 'list' && (
              <div className="space-y-6">
                {/* Abas Alternadoras da Lista */}
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

                {/* Empty State */}
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

                {/* Exibição dos cards de campanhas */}
                {listTab === 'active' && activeCampaigns.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCampaigns.map(c => (
                      <Card key={c.id} className="border-border hover:shadow-md transition-all flex flex-col justify-between bg-card group">
                        <CardHeader className="pb-3">
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
                                    aria-label="Editar campanha"
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
                                    aria-label="Excluir campanha"
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
                        <CardContent className="text-sm space-y-3 pb-3">
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
                        <CardFooter className="pt-2 border-t border-border/40 flex items-center justify-between">
                          <Button variant="ghost" size="sm" className="w-full text-xs font-semibold gap-1.5 hover:bg-muted text-muted-foreground hover:text-foreground" onClick={() => setSelectedCampaign(c)}>
                            <MessageSquare className="size-3.5" />
                            Ver Detalhes e Comentários ({c.comments.length})
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Exibição das campanhas concluídas */}
                {listTab === 'completed' && completedCampaigns.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedCampaigns.map(c => (
                      <Card key={c.id} className="border-border hover:shadow-md transition-all flex flex-col justify-between bg-card group opacity-85 hover:opacity-100">
                        <CardHeader className="pb-3">
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
                                    aria-label="Editar campanha"
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
                                    aria-label="Excluir campanha"
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
                        <CardContent className="text-sm space-y-3 pb-3">
                          <div className="flex items-center text-muted-foreground text-xs gap-1.5">
                            <Clock className="size-3.5" />
                            <span>
                              {new Date(c.startDate).toLocaleDateString('pt-BR')} até {new Date(c.endDate).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          {c.budget && (
                            <p className="text-sm font-semibold text-muted-foreground">
                              Orçamento: <span>{c.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </p>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2 border-t border-border/40 flex items-center justify-between">
                          <Button variant="ghost" size="sm" className="w-full text-xs font-semibold gap-1.5 hover:bg-muted text-muted-foreground hover:text-foreground" onClick={() => setSelectedCampaign(c)}>
                            <MessageSquare className="size-3.5" />
                            Ver Detalhes e Comentários ({c.comments.length})
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* 4. Footer do Layout Base */}
      <footer className="border-t border-border bg-muted/10 py-6 mt-12 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Agenda de Campanhas. Desenvolvido para alinhamento entre Marketing & Agência.</p>
        </div>
      </footer>

      {/* 5. Modal de Detalhes da Campanha e Seção de Comentários */}
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
              {/* Orçamento e Descrição */}
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

              {/* Formulário para Novo Comentário */}
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
                    className="w-full text-xs p-2 rounded-md bg-card border border-border outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50"
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
