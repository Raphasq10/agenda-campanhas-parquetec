import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import AgendaPage from './agenda'
import type { Campaign } from './agenda'
import { Calendar as CalendarIcon, Tag, DollarSign, FileText, AlertTriangle } from 'lucide-react'

// Schema de validação Zod para garantir consistência de datas e segurança
const campaignFormSchema = z.object({
  name: z.string()
    .min(3, { message: 'O nome da campanha deve ter pelo menos 3 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
    .trim(),
  channelsInput: z.string()
    .min(1, { message: 'Informe ao menos um canal de marketing (ex: Meta, Google).' })
    .max(100, { message: 'Os canais devem somar no máximo 100 caracteres.' }),
  startDate: z.string().min(1, { message: 'A data de início é obrigatória.' }),
  endDate: z.string().min(1, { message: 'A data de término é obrigatória.' }),
  status: z.enum(['A começar', 'Em andamento', 'Pausada', 'Concluída']),
  budget: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().nonnegative({ message: 'O orçamento deve ser um número positivo.' }).optional()
  ),
  notes: z.string()
    .max(1000, { message: 'As observações devem ter no máximo 1000 caracteres.' })
    .optional()
}).refine(data => {
  // Regra de Negócio: Data de Fim deve ser igual ou maior que a Data de Início
  return new Date(data.endDate) >= new Date(data.startDate)
}, {
  message: 'A data de término não pode ser anterior à data de início.',
  path: ['endDate'] // Vincula o erro ao campo endDate
})

interface AdminPanelProps {
  campaigns: Campaign[]
  onLogout: () => void
  onAddComment: (campaignId: string, author: string, text: string) => void
  onAddCampaign: (campaign: Omit<Campaign, 'id' | 'comments'>) => void
  onEditCampaign: (id: string, updatedFields: Partial<Campaign>) => void
  onDeleteCampaign: (id: string) => void
}

export default function AdminPanelPage({
  campaigns,
  onLogout,
  onAddComment,
  onAddCampaign,
  onEditCampaign,
  onDeleteCampaign
}: AdminPanelProps) {
  // Estados para gerenciar a visibilidade dos modais de formulário
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  // Estados para a campanha que está sendo editada ou excluída
  const [editingCampaign, setEditingCampaign] = React.useState<Campaign | null>(null)
  const [deletingCampaign, setDeletingCampaign] = React.useState<Campaign | null>(null)

  // React Hook Form para Criação de Campanha (tipagem inferida do Zod para evitar erros de build)
  const createForm = useForm({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: '',
      channelsInput: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: 'A começar' as const,
      budget: 0 as number | undefined,
      notes: ''
    }
  })

  // React Hook Form para Edição de Campanha
  const editForm = useForm({
    resolver: zodResolver(campaignFormSchema)
  })

  // Popula o formulário de edição com os dados da campanha selecionada
  React.useEffect(() => {
    if (editingCampaign) {
      editForm.reset({
        name: editingCampaign.name,
        channelsInput: editingCampaign.channels.join(', '),
        startDate: editingCampaign.startDate,
        endDate: editingCampaign.endDate,
        status: editingCampaign.status,
        budget: editingCampaign.budget || 0,
        notes: editingCampaign.notes || ''
      })
    }
  }, [editingCampaign, editForm])

  // Submissão da criação de nova campanha
  const onCreateSubmit = (data: any) => {
    // Transforma a string de tags em um array de strings limpas
    const channels = data.channelsInput
      .split(',')
      .map((ch: string) => ch.trim())
      .filter((ch: string) => ch.length > 0)

    onAddCampaign({
      name: data.name,
      channels,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      budget: data.budget,
      notes: data.notes
    })

    createForm.reset()
    setCreateOpen(false)
  }

  // Submissão da edição de campanha
  const onEditSubmit = (data: any) => {
    if (!editingCampaign) return

    const channels = data.channelsInput
      .split(',')
      .map((ch: string) => ch.trim())
      .filter((ch: string) => ch.length > 0)

    onEditCampaign(editingCampaign.id, {
      name: data.name,
      channels,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      budget: data.budget,
      notes: data.notes
    })

    setEditingCampaign(null)
    setEditOpen(false)
  }

  // Confirmação de exclusão da campanha
  const handleDeleteConfirm = () => {
    if (deletingCampaign) {
      onDeleteCampaign(deletingCampaign.id)
      setDeletingCampaign(null)
      setDeleteOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Renderiza a Agenda com os controles administrativos ativos */}
      <AgendaPage
        campaigns={campaigns}
        isAdmin={true}
        onLogout={onLogout}
        onAddComment={onAddComment}
        onOpenCreateModal={() => setCreateOpen(true)}
        onOpenEditModal={(c) => {
          setEditingCampaign(c)
          setEditOpen(true)
        }}
        onOpenDeleteModal={(c) => {
          setDeletingCampaign(c)
          setDeleteOpen(true)
        }}
      />

      {/* --- MODAL 1: CRIAR NOVA CAMPANHA --- */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Criar Nova Campanha</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para cadastrar a nova campanha.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={createForm.handleSubmit(onCreateSubmit)} noValidate className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="create-name">Nome da Campanha</Label>
              <Input
                id="create-name"
                maxLength={100}
                placeholder="Ex: Promoção Dia dos Pais"
                {...createForm.register('name')}
              />
              {createForm.formState.errors.name && (
                <p className="text-xs text-destructive font-medium mt-1">{createForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="create-channels" className="flex items-center gap-1">
                <Tag className="size-3.5" />
                Canais / Plataformas (Separados por vírgula)
              </Label>
              <Input
                id="create-channels"
                maxLength={100}
                placeholder="Ex: Meta, Google, WhatsApp, Email"
                {...createForm.register('channelsInput')}
              />
              {createForm.formState.errors.channelsInput && (
                <p className="text-xs text-destructive font-medium mt-1">{createForm.formState.errors.channelsInput.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="create-start-date" className="flex items-center gap-1">
                  <CalendarIcon className="size-3.5" />
                  Data de Início
                </Label>
                <Input
                  id="create-start-date"
                  type="date"
                  {...createForm.register('startDate')}
                />
                {createForm.formState.errors.startDate && (
                  <p className="text-xs text-destructive font-medium mt-1">{createForm.formState.errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="create-end-date" className="flex items-center gap-1">
                  <CalendarIcon className="size-3.5" />
                  Data de Término
                </Label>
                <Input
                  id="create-end-date"
                  type="date"
                  {...createForm.register('endDate')}
                />
                {createForm.formState.errors.endDate && (
                  <p className="text-xs text-destructive font-medium mt-1">{createForm.formState.errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="create-status">Status</Label>
                <select
                  id="create-status"
                  className="w-full h-9 px-3 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  {...createForm.register('status')}
                >
                  <option value="A começar">A começar</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Pausada">Pausada</option>
                  <option value="Concluída">Concluída</option>
                </select>
                {createForm.formState.errors.status && (
                  <p className="text-xs text-destructive font-medium mt-1">{createForm.formState.errors.status.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="create-budget" className="flex items-center gap-1">
                  <DollarSign className="size-3.5" />
                  Orçamento Estimado (R$)
                </Label>
                <Input
                  id="create-budget"
                  type="number"
                  placeholder="Ex: 5000"
                  {...createForm.register('budget')}
                />
                {createForm.formState.errors.budget && (
                  <p className="text-xs text-destructive font-medium mt-1">{createForm.formState.errors.budget.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="create-notes" className="flex items-center gap-1">
                <FileText className="size-3.5" />
                Observações
              </Label>
              <textarea
                id="create-notes"
                maxLength={1000}
                placeholder="Detalhes adicionais da campanha..."
                rows={3}
                className="w-full text-sm p-2 rounded-md bg-card border border-border outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                {...createForm.register('notes')}
              />
              {createForm.formState.errors.notes && (
                <p className="text-xs text-destructive font-medium mt-1">{createForm.formState.errors.notes.message}</p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button type="submit">Cadastrar Campanha</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- MODAL 2: EDITAR CAMPANHA EXISTENTE --- */}
      <Dialog open={editOpen} onOpenChange={(open) => {
        if (!open) setEditingCampaign(null)
        setEditOpen(open)
      }}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Editar Campanha</DialogTitle>
            <DialogDescription>
              Modifique os dados abaixo para atualizar as informações da campanha.
            </DialogDescription>
          </DialogHeader>

          {editingCampaign && (
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} noValidate className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="edit-name">Nome da Campanha</Label>
                <Input
                  id="edit-name"
                  maxLength={100}
                  {...editForm.register('name')}
                />
                {editForm.formState.errors.name && (
                  <p className="text-xs text-destructive font-medium mt-1">{editForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-channels" className="flex items-center gap-1">
                  <Tag className="size-3.5" />
                  Canais / Plataformas (Separados por vírgula)
                </Label>
                <Input
                  id="edit-channels"
                  maxLength={100}
                  {...editForm.register('channelsInput')}
                />
                {editForm.formState.errors.channelsInput && (
                  <p className="text-xs text-destructive font-medium mt-1">{editForm.formState.errors.channelsInput.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="edit-start-date" className="flex items-center gap-1">
                    <CalendarIcon className="size-3.5" />
                    Data de Início
                  </Label>
                  <Input
                    id="edit-start-date"
                    type="date"
                    {...editForm.register('startDate')}
                  />
                  {editForm.formState.errors.startDate && (
                    <p className="text-xs text-destructive font-medium mt-1">{editForm.formState.errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="edit-end-date" className="flex items-center gap-1">
                    <CalendarIcon className="size-3.5" />
                    Data de Término
                  </Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    {...editForm.register('endDate')}
                  />
                  {editForm.formState.errors.endDate && (
                    <p className="text-xs text-destructive font-medium mt-1">{editForm.formState.errors.endDate.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    className="w-full h-9 px-3 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    {...editForm.register('status')}
                  >
                    <option value="A começar">A começar</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Pausada">Pausada</option>
                    <option value="Concluída">Concluída</option>
                  </select>
                  {editForm.formState.errors.status && (
                    <p className="text-xs text-destructive font-medium mt-1">{editForm.formState.errors.status.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="edit-budget" className="flex items-center gap-1">
                    <DollarSign className="size-3.5" />
                    Orçamento Estimado (R$)
                  </Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    {...editForm.register('budget')}
                  />
                  {editForm.formState.errors.budget && (
                    <p className="text-xs text-destructive font-medium mt-1">{editForm.formState.errors.budget.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-notes" className="flex items-center gap-1">
                  <FileText className="size-3.5" />
                  Observações
                </Label>
                <textarea
                  id="edit-notes"
                  maxLength={1000}
                  rows={3}
                  className="w-full text-sm p-2 rounded-md bg-card border border-border outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  {...editForm.register('notes')}
                />
                {editForm.formState.errors.notes && (
                  <p className="text-xs text-destructive font-medium mt-1">{editForm.formState.errors.notes.message}</p>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => {
                  setEditingCampaign(null)
                  setEditOpen(false)
                }}>Cancelar</Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* --- MODAL 3: CONFIRMAR EXCLUSÃO DE CAMPANHA --- */}
      <Dialog open={deleteOpen} onOpenChange={(open) => {
        if (!open) setDeletingCampaign(null)
        setDeleteOpen(open)
      }}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="size-5" />
              Excluir Campanha?
            </DialogTitle>
            <DialogDescription className="pt-2">
              Você está prestes a excluir permanentemente a campanha: <strong className="text-foreground">"{deletingCampaign?.name}"</strong>. 
              Esta ação não poderá ser desfeita e todos os comentários vinculados serão apagados.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => {
              setDeletingCampaign(null)
              setDeleteOpen(false)
            }}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Sim, Excluir Campanha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
