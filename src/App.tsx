import React from 'react'
import AgendaPage from './pages/agenda'
import type { Campaign } from './pages/agenda'
import LoginPage from './pages/login'
import AdminPanelPage from './pages/admin-panel'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

// Banco de dados fictício em memória para popular o MVP com campanhas ricas e reais de marketing
const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Promoção Dia dos Pais 2026',
    channels: ['Meta', 'Google', 'WhatsApp'],
    startDate: '2026-08-01',
    endDate: '2026-08-15',
    status: 'A começar',
    budget: 8500.0,
    notes: 'Foco em conversão de público masculino de 25 a 50 anos. Criativos em vídeo de 15 segundos para Reels e Stories.',
    comments: [
      {
        id: 'c1',
        author: 'Mariana Silva',
        role: 'Marketing',
        text: 'Layouts base de criativos aprovados pela diretoria. Agência pode iniciar a produção dos vídeos.',
        createdAt: '2026-07-01T10:00:00.000Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Campanha de Tráfego: Lançamento Primavera',
    channels: ['Meta', 'LinkedIn', 'YouTube'],
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'A começar',
    budget: 15000.0,
    notes: 'Campanha institucional para atração de leads B2B (LinkedIn) e vendas B2C (Meta/YouTube).',
    comments: []
  },
  {
    id: '3',
    name: 'Promoção de Inverno Ativa',
    channels: ['Meta', 'Google', 'YouTube'],
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    status: 'Em andamento',
    budget: 12000.0,
    notes: 'Ação focada em retargeting de carrinho abandonado com cupom de 15% OFF.',
    comments: [
      {
        id: 'c2',
        author: 'Roberto Costa',
        role: 'Agência',
        text: 'Subimos o orçamento diário no Google Ads em 20% conforme o planejado. A taxa de conversão subiu 5%.',
        createdAt: '2026-06-28T14:30:00.000Z'
      },
      {
        id: 'c3',
        author: 'Mariana Silva',
        role: 'Marketing',
        text: 'Excelente resultado! O custo por lead caiu bastante. Vamos monitorar até o final da semana.',
        createdAt: '2026-06-29T09:15:00.000Z'
      }
    ]
  },
  {
    id: '4',
    name: 'Liquidação de Outono Concluída',
    channels: ['Meta', 'Google'],
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    status: 'Concluída',
    budget: 5000.0,
    notes: 'Queima de estoque de final de estação.',
    comments: [
      {
        id: 'c4',
        author: 'Roberto Costa',
        role: 'Agência',
        text: 'Campanhas pausadas no painel. O relatório final consolidado de conversões foi enviado por e-mail.',
        createdAt: '2026-06-01T18:00:00.000Z'
      }
    ]
  }
]

export default function App() {
  // Estado que gerencia qual página está visível ('agenda' | 'login' | 'admin')
  const [currentPage, setCurrentPage] = React.useState<'agenda' | 'login' | 'admin'>('agenda')
  // Estado das campanhas em memória para o CRUD do MVP funcionar
  const [campaigns, setCampaigns] = React.useState<Campaign[]>(INITIAL_CAMPAIGNS)
  // Estados para simular loading de rede e exibição de Skeletons
  const [loading, setLoading] = React.useState(true)

  // Simula um carregamento de rede de 800ms ao carregar o app para vermos os Skeletons em ação
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // 1. Ação de Adicionar Comentário
  const handleAddComment = (campaignId: string, author: string, text: string) => {
    const newComment = {
      id: Date.now().toString(),
      author,
      role: currentPage === 'admin' ? ('Marketing' as const) : ('Agência' as const),
      text,
      createdAt: new Date().toISOString()
    }

    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        return {
          ...campaign,
          comments: [...campaign.comments, newComment]
        }
      }
      return campaign
    }))

    toast.success('Comentário publicado com sucesso!')
  }

  // 2. Ação de Adicionar Nova Campanha (Admin)
  const handleAddCampaign = (newCampData: Omit<Campaign, 'id' | 'comments'>) => {
    const newCampaign: Campaign = {
      ...newCampData,
      id: Date.now().toString(),
      comments: []
    }

    setCampaigns(prev => [newCampaign, ...prev])
    toast.success(`Campanha "${newCampaign.name}" criada com sucesso!`)
  }

  // 3. Ação de Editar Campanha (Admin)
  const handleEditCampaign = (id: string, updatedFields: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === id) {
        return {
          ...campaign,
          ...updatedFields
        }
      }
      return campaign
    }))

    toast.success('Campanha atualizada com sucesso!')
  }

  // 4. Ação de Excluir Campanha (Admin)
  const handleDeleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id))
    toast.success('Campanha removida da agenda.')
  }

  // Lógica de Login e Logout
  const handleLoginSuccess = () => {
    setCurrentPage('admin')
    toast.success('Autenticado com sucesso! Bem-vinda, Mariana.')
  }

  const handleLogout = () => {
    setCurrentPage('agenda')
    toast.success('Sessão encerrada.')
  }

  return (
    <React.Fragment>
      {/* 1. Roteador por Estado */}
      {currentPage === 'agenda' && (
        <AgendaPage
          campaigns={campaigns}
          isAdmin={false}
          onNavigateToLogin={() => setCurrentPage('login')}
          onAddComment={handleAddComment}
          loading={loading}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToAgenda={() => setCurrentPage('agenda')}
        />
      )}

      {currentPage === 'admin' && (
        <AdminPanelPage
          campaigns={campaigns}
          onLogout={handleLogout}
          onAddComment={handleAddComment}
          onAddCampaign={handleAddCampaign}
          onEditCampaign={handleEditCampaign}
          onDeleteCampaign={handleDeleteCampaign}
        />
      )}

      {/* Gerenciador de balões de aviso sonner */}
      <Toaster position="bottom-right" richColors />
    </React.Fragment>
  )
}
