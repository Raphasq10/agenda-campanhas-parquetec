import React from 'react'
import AgendaPage from './pages/agenda'
import LoginPage from './pages/login'
import AdminPanelPage from './pages/admin-panel'
import type { Campaign } from './pages/agenda'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

// 1. Mapeadores para traduzir a estrutura do PostgreSQL (snake_case) para o React (camelCase)
const mapCampaignFromDB = (dbCamp: any): Campaign => ({
  id: dbCamp.id,
  name: dbCamp.name,
  channels: dbCamp.channels,
  startDate: dbCamp.start_date,
  endDate: dbCamp.end_date,
  status: dbCamp.status,
  budget: dbCamp.budget ? Number(dbCamp.budget) : undefined,
  notes: dbCamp.notes || '',
  // Mapeia e ordena os comentários de forma cronológica
  comments: (dbCamp.comments || []).map((c: any) => ({
    id: c.id,
    author: c.author,
    role: c.role,
    text: c.text,
    createdAt: c.created_at
  })).sort((a: any, b: any) => a.createdAt.localeCompare(b.createdAt))
})

const mapCampaignToDB = (camp: Omit<Campaign, 'id' | 'comments'>) => ({
  name: camp.name,
  channels: camp.channels,
  start_date: camp.startDate,
  end_date: camp.endDate,
  status: camp.status,
  budget: camp.budget || null,
  notes: camp.notes || ''
})

export default function App() {
  const [currentPage, setCurrentPage] = React.useState<'agenda' | 'login' | 'admin'>('agenda')
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([])
  const [session, setSession] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [dbError, setDbError] = React.useState<string | null>(null)

  // 2. Função para buscar campanhas e comentários agregados do Supabase
  const fetchCampaigns = async (showLoadingIndicator = false) => {
    if (showLoadingIndicator) setLoading(true)
    setDbError(null)
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*, comments(*)')
        .order('created_at', { ascending: false })

      if (error) throw error

      const mapped = (data || []).map(mapCampaignFromDB)
      setCampaigns(mapped)
    } catch (err: any) {
      setDbError('Não foi possível carregar as campanhas. Verifique suas conexões e chaves no .env.local.')
      console.error('Erro Supabase:', err.message)
    } finally {
      setLoading(false)
    }
  }

  // 3. Monitoramento de Sessão de Usuário e Inicialização
  React.useEffect(() => {
    // Busca a sessão ativa imediatamente no carregamento
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        setCurrentPage('admin')
      }
    })

    // Escuta mudanças de estado de autenticação (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        setCurrentPage('admin')
      } else {
        setCurrentPage('agenda')
      }
    })

    fetchCampaigns(true)

    return () => subscription.unsubscribe()
  }, [])

  // 4. CRUD: Adicionar Comentário
  const handleAddComment = async (campaignId: string, author: string, text: string) => {
    // Determina o cargo do autor na hora de salvar
    const role = session ? 'Marketing' : 'Agência'
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          campaign_id: campaignId,
          author,
          role,
          text
        })

      if (error) throw error

      toast.success('Comentário publicado com sucesso!')
      fetchCampaigns(false) // Recarrega silenciosamente em background
    } catch (err: any) {
      toast.error('Erro ao salvar comentário no banco de dados.')
      console.error(err)
    }
  }

  // 5. CRUD: Adicionar Nova Campanha (Admin)
  const handleAddCampaign = async (newCampData: Omit<Campaign, 'id' | 'comments'>) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .insert(mapCampaignToDB(newCampData))

      if (error) throw error

      toast.success(`Campanha "${newCampData.name}" criada com sucesso!`)
      fetchCampaigns(false)
    } catch (err: any) {
      toast.error('Erro ao cadastrar campanha no banco.')
      console.error(err)
    }
  }

  // 6. CRUD: Editar Campanha (Admin)
  const handleEditCampaign = async (id: string, updatedFields: Partial<Campaign>) => {
    try {
      const dbFields: any = {}
      if (updatedFields.name !== undefined) dbFields.name = updatedFields.name
      if (updatedFields.channels !== undefined) dbFields.channels = updatedFields.channels
      if (updatedFields.startDate !== undefined) dbFields.start_date = updatedFields.startDate
      if (updatedFields.endDate !== undefined) dbFields.end_date = updatedFields.endDate
      if (updatedFields.status !== undefined) dbFields.status = updatedFields.status
      if (updatedFields.budget !== undefined) dbFields.budget = updatedFields.budget
      if (updatedFields.notes !== undefined) dbFields.notes = updatedFields.notes

      const { error } = await supabase
        .from('campaigns')
        .update(dbFields)
        .eq('id', id)

      if (error) throw error

      toast.success('Campanha atualizada com sucesso!')
      fetchCampaigns(false)
    } catch (err: any) {
      toast.error('Erro ao atualizar campanha no banco.')
      console.error(err)
    }
  }

  // 7. CRUD: Excluir Campanha (Admin)
  const handleDeleteCampaign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Campanha removida com sucesso.')
      fetchCampaigns(false)
    } catch (err: any) {
      toast.error('Erro ao excluir campanha no banco.')
      console.error(err)
    }
  }

  // 8. Logout Administrativo
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Sessão encerrada com sucesso.')
    } catch (err: any) {
      toast.error('Erro ao fazer logout.')
    }
  }

  return (
    <React.Fragment>
      {currentPage === 'agenda' && (
        <AgendaPage
          campaigns={campaigns}
          isAdmin={false}
          onNavigateToLogin={() => setCurrentPage('login')}
          onAddComment={handleAddComment}
          loading={loading}
          error={dbError}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={() => setCurrentPage('admin')}
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

      <Toaster position="bottom-right" richColors />
    </React.Fragment>
  )
}
