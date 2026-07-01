# PRD (Product Requirement Document) — Agenda de Campanhas

Este documento especifica os requisitos de produto para o MVP da **Agenda de Campanhas**, uma ferramenta focada em dar previsibilidade sobre campanhas de tráfego e mídia para equipes de marketing e agências.

---

## 1. Visão Geral

### Nome do Produto
Agenda de Campanhas

### Elevator Pitch (3-4 linhas)
Para agências de marketing digital que sofrem com a falta de previsibilidade de campanhas pagas que vão para o ar, a **Agenda de Campanhas** é uma ferramenta visual simples que centraliza e exibe o cronograma de lançamentos. Diferente do Google Agenda, ela é focada exclusivamente no fluxo de mídia, permitindo que a equipe de marketing registre e a agência consulte o status de forma direta, garantindo alinhamento e eliminando surpresas.

### Objetivo do MVP (Lançamento: 01/07/26)
Entregar uma aplicação web funcional onde a equipe de marketing (múltiplos usuários autorizados) possa autenticar-se e gerenciar (criar, ler, editar as informações, excluir e comentar) campanhas, e a agência de marketing (como usuário externo) possa visualizar o calendário de campanhas vigentes, acessar a lista cronológica (incluindo abas de campanhas ativas e concluídas) e adicionar comentários nas ações, sem necessidade de login.

---

## 2. Personas

### Persona 1: Usuário Primário (Equipe de Marketing)
* **Nome fictício:** Mariana Silva
* **Perfil:** Analista de Tráfego Interno, 27 anos. Responsável por planejar e dar o "ok" para o início de campanhas da marca.
* **Dores principais:**
  * Perde muito tempo atualizando planilhas compartilhadas e respondendo mensagens da agência sobre quando determinada campanha vai rodar.
  * O Google Agenda pessoal fica poluído com reuniões e tarefas diárias, dificultando a visualização exclusiva das datas de veiculação de mídia.
* **O que ela quer alcançar:** Um local centralizado e limpo para cadastrar as datas das campanhas de tráfego pago de forma rápida, compartilhando a visualização diretamente com a agência de execução.
* **Como descobriria o produto:** Através de pesquisa orgânica no Google por ferramentas simples de cronograma de tráfego pago ou indicação de colegas da área.

### Persona 2: Usuário Secundário (Agência de Marketing)
* **Nome fictício:** Roberto Costa
* **Perfil:** Diretor de Operações/Atendimento da Agência, 38 anos. Precisa coordenar a equipe de criação (designers e copywriters) para produzir os criativos das campanhas a tempo.
* **Dores principais:**
  * Falta de previsibilidade: frequentemente é surpreendido com demandas de campanhas que precisam ir para o ar no dia seguinte, sem que as peças tenham sido produzidas.
  * Dificuldade de comunicação e desalinhamento sobre datas de início e término de ofertas e ações especiais dos clientes.
* **O que ele quer alcançar:** Consultar facilmente o calendário de campanhas do cliente para planejar o fluxo interno de trabalho com antecedência, sabendo exatamente o que está ativo e o que vai entrar no ar nas próximas semanas.
* **Como descobriria o produto:** Convidado por Mariana (sua cliente), que compartilha o link de consulta da agenda.

---

## 3. User Stories Priorizadas (MoSCoW)

### Must have (Essencial para o MVP)
* **US01:** Como membro da Equipe de Marketing (Mariana e outros), eu quero me autenticar com **login e senha** na nuvem para que apenas usuários autorizados possam gerenciar os dados das campanhas.
* **US02:** Como usuário do marketing, eu quero cadastrar uma nova campanha (nome, **canais em formato de tags**, data de início, data de fim, orçamento estimado, status e observações/comentários iniciais) para disponibilizá-la na agenda.
* **US03:** Como usuário do marketing, eu quero **editar as informações já colocadas**, excluir campanhas ou **fazer comentários em cima de cada ação cadastrada** para manter a agenda atualizada e registrar anotações adicionais.
* **US04:** Como Roberto (Agência), eu quero acessar a agenda através de um link público (sem precisar de login) para consultar as informações rapidamente de forma externa.
* **US05:** Como Roberto (Agência), eu quero visualizar as campanhas em um calendário mensal para ter uma perspectiva de médio prazo dos lançamentos.
* **US06:** Como Roberto (Agência), eu quero visualizar as campanhas em um calendário semanal para acompanhar o planejamento de curto prazo e entregas da semana.
* **US07:** Como Roberto (Agência), eu quero ver as campanhas em formato de lista linear ordenada a partir da data de hoje em diante para saber de forma imediata o que está ativo ou próximo de começar.
* **US08:** Como Roberto (Agência), eu quero **adicionar comentários na seção de comentários de cada campanha (como usuário externo)** para tirar dúvidas e alinhar detalhes diretamente na plataforma.
* **US09:** Como usuário do sistema, eu quero que as campanhas com status **"Concluída" saiam da visualização de calendário** e fiquem agrupadas em uma seção/aba própria chamada "Concluído" na visualização de lista para evitar poluição visual.

### Should have (Importante, mas não bloqueia o lançamento)
* **US10:** Como Roberto (Agência), eu quero filtrar as campanhas por tag de canal/plataforma (ex: Meta, Google, WhatsApp) para focar apenas nas mídias que minha equipe gerencia no momento.
* **US11:** Como usuário do marketing, eu quero duplicar uma campanha existente para agilizar o cadastro de ações recorrentes ou semelhantes.

### Could have (Desejável, se sobrar tempo)
* **US12:** Como usuário do marketing, eu quero exportar a lista de campanhas filtradas em formato CSV para fins de relatório.
* **US13:** Como Roberto (Agência), eu quero pesquisar campanhas por palavra-chave no nome para localizar campanhas específicas rapidamente.

### Won't have (Explicitamente fora do escopo do MVP)
* **US14:** Como agência, eu quero gerenciar múltiplas agendas de clientes diferentes na mesma conta (Multi-tenancy). *Nota: Rejeitado por ser de uso pessoal/interno da equipe e sua agência parceira.*
* **US15:** Como usuário, eu quero que o sistema sincronize automaticamente com as contas de anúncios da Meta/Google para atualizar dados reais de orçamento e veiculação. *Nota: Rejeitado para manter o MVP simples.*
* **US16:** Como Roberto, eu quero receber notificações por e-mail ou WhatsApp quando Mariana cadastrar uma nova campanha de última hora. *Nota: Rejeitado para este MVP.*

---

## 4. Features do MVP (Apenas as Must Have)

### Feature 1: Autenticação Baseada em Nuvem (Admin)
* **Descrição:** Tela de login centralizada para permitir que múltiplos membros da equipe de marketing cadastrados alterem os dados da agenda de qualquer computador com acesso à internet.
* **Critérios de aceitação:**
  * Tela de login acessível na rota `/login` com campos de e-mail e senha.
  * Validação das credenciais usando o serviço de autenticação na nuvem (Supabase Auth).
  * Sessão mantida via cookie seguro ou armazenamento local seguro gerenciado pelo Supabase Client.
  * Caso o usuário tente acessar as ações de alteração de dados de campanhas (criar, editar, deletar) sem estar autenticado, deve ser impedido e redirecionado para a tela de login.
* **Dependências:** Nenhuma.
* **Justificativa:** Permite que múltiplos integrantes da equipe de marketing colaborem e gerenciem a agenda de forma segura na nuvem.

### Feature 2: CRUD de Campanhas com Tags e Comentários (Escrita)
* **Descrição:** Formulário administrativo na nuvem onde os usuários do marketing autenticados podem cadastrar, visualizar detalhes, atualizar dados e excluir campanhas.
* **Critérios de aceitação:**
  * Formulário de cadastro/edição contendo os seguintes campos:
    * **Nome da Campanha** (Texto, obrigatório)
    * **Canais/Plataformas** (Campo de tags múltiplo, ex: Radio, TV, Meta, Google, LinkedIn, WhatsApp, obrigatório)
    * **Data de Início** (Data, obrigatório)
    * **Data de Fim** (Data, obrigatório, deve ser igual ou maior que a Data de Início)
    * **Status** (Select: 'A começar', 'Em andamento', 'Pausada', 'Concluída', obrigatório)
    * **Orçamento Estimado** (Decimal, opcional)
    * **Observações** (Texto longo, opcional)
  * Persistência dos dados no banco de dados na nuvem (Supabase).
  * Capacidade de alterar qualquer campo de uma campanha existente.
  * Capacidade de excluir uma campanha mediante confirmação em tela.
* **Dependências:** Feature 1.
* **Justificativa:** É a funcionalidade necessária para alimentar e manter o sistema com dados reais acessíveis de qualquer lugar.

### Feature 3: Visualizações da Agenda (Leitura Pública) com Regra de "Concluídas"
* **Descrição:** Visualização pública (sem login) das campanhas do Supabase em calendário mensal, semanal e lista linear. Campanhas concluídas saem dos calendários e vão para uma aba separada na lista.
* **Critérios de aceitação:**
  * Rota pública principal `/` acessível sem login.
  * **Calendário Mensal e Semanal:**
    * Exibe campanhas com status 'A começar', 'Em andamento' ou 'Pausada'.
    * **Campanhas com status 'Concluída' NÃO aparecem nas visualizações de calendário (mensal/semanal)**.
    * Exibição das campanhas com cores diferenciadas ou tags indicando os múltiplos canais associados.
  * **Visualização em Lista:**
    * Apresenta duas abas ou seções distintas:
      1. **Ativas/Futuras:** Lista cronológica de hoje em diante de campanhas que estão 'Em andamento', 'A começar' ou 'Pausadas'.
      2. **Concluídas:** Seção/aba chamada **"Concluído"** que agrupa todas as campanhas que foram marcadas com status 'Concluída', servindo de histórico.
  * Clicar no bloco/linha de uma campanha abre um modal responsivo exibindo todos os detalhes da campanha.
* **Dependências:** Feature 2.
* **Justificativa:** Resolve a dor de previsibilidade da agência sem poluir o calendário com ações finalizadas.

### Feature 4: Seção de Comentários Integrada
* **Descrição:** Seção de comentários dentro do modal de detalhes da campanha, persistida no banco de dados do Supabase. Permite que a agência (usuário externo sem login) e a equipe de marketing comentem diretamente na plataforma.
* **Critérios de aceitação:**
  * Dentro do modal de detalhes de qualquer campanha, exibe um feed de comentários cronológico vindo do Supabase.
  * **Para usuários não autenticados (Roberto/Agência):** Exibe um campo para digitar o comentário e um campo de texto curto obrigatório para digitar seu nome/identificação (ex: "Roberto (Agência)") antes de enviar.
  * **Para a equipe logada:** O sistema identifica automaticamente o nome/e-mail do usuário autenticado e permite comentar diretamente.
  * Comentários são salvos diretamente no banco de dados do Supabase na tabela `comentarios`.
* **Dependências:** Feature 3.
* **Justificativa:** Centraliza o alinhamento de cada ação de forma colaborativa e dinâmica, sem necessidade de banco de dados local.

---

## 5. Fluxos Principais

### 1. Cadastro e Primeiro Uso (Criação de Usuário)
1. O administrador principal cria o projeto no **Supabase** e gera os usuários autorizados da equipe de marketing pelo painel de controle do Supabase Auth.
2. Não há tela de setup público para evitar invasões; as contas da equipe de marketing são criadas diretamente pelo painel administrativo do Supabase com o e-mail do Google da empresa.
3. Os integrantes da equipe de marketing acessam `/login` no site publicado e entram usando seus e-mails e senhas cadastrados.

### 2. Fluxo Principal de Valor (Equipe de Marketing cadastrando e editando campanhas)
1. Mariana acessa `/login`, insere seu login e senha e entra no painel.
2. Na tela principal, ela clica no botão "Nova Campanha".
3. Ela preenche os dados:
   * Nome: "Promoção Dia dos Pais"
   * Canais (Tags): "Meta", "Google", "WhatsApp"
   * Período: 10/08/2026 a 20/08/2026
   * Status: "A começar"
   * Orçamento: "R$ 5.000,00"
   * Observações: "Foco em público de 25 a 45 anos."
4. Ela clica em "Salvar". O sistema grava no Supabase e insere a campanha.
5. Mais tarde, Mariana ou outro membro da equipe de marketing acessa e edita a campanha de qualquer lugar, alterando o orçamento ou adicionando um comentário.

### 3. Fluxo Principal de Consulta e Comentários (Agência acompanhando e alinhando)
1. Roberto (da agência) acessa a URL pública da agenda hospedada no GitHub Pages.
2. Ele visualiza o calendário mensal puxado diretamente do Supabase em tempo real.
3. Ele clica sobre o bloco da campanha. O modal de detalhes abre, exibindo as observações.
4. No campo de comentários, Roberto digita seu nome "Roberto (Agência)", escreve seu comentário ("Entregamos os criativos de vídeo hoje na pasta compartilhada.") e clica em "Comentar".
5. O comentário de Roberto é persistido na nuvem no Supabase e passa a constar no feed da campanha instantaneamente.

---

## 6. Regras de Negócio
1. **Consistência de Datas:** A Data de Fim de uma campanha não pode ser anterior à Data de Início.
2. **Restrição de Escrita em Campanhas:** Somente requisições devidamente autenticadas no Supabase podem executar operações de criação, edição e deleção de campanhas.
3. **Comentários de Visitantes:** Visitantes não logados podem comentar nas campanhas, mas devem fornecer obrigatoriamente um nome de identificação. O comentário fica gravado na tabela do Supabase.
4. **Regra de Visibilidade das Concluídas:** Campanhas marcadas como "Concluída" são ocultadas dos calendários (Mensal e Semanal) e exibidas exclusivamente na aba/seção "Concluído" da visualização em Lista.
5. **Single Tenancy:** O sistema opera com apenas uma agenda/organização por banco de dados.

---

## 7. Fora do Escopo (Não estará no MVP)
* Cadastro de múltiplos clientes ou contas de agência independentes (Multi-tenancy).
* Integração automática via API com plataformas de mídia paga para importação de anúncios.
* Sistema de alertas ou notificações ativas (E-mail, WhatsApp, Slack) ao cadastrar/atualizar campanhas ou comentários.
* Níveis hierárquicos de permissões de escrita (ex: editor, revisor, visualizador com senha).
* Upload de arquivos (imagens/vídeos/PDFs) dentro do cadastro de campanhas ou nos comentários.

---

## 8. Requisitos Não-Funcionais

### Performance
* O carregamento da página pública deve ocorrer em menos de 2 segundos sob conexão 4G padrão.
* O tempo de resposta ao salvar ou editar dados via Supabase deve ser inferior a 1 segundo.

### Segurança e Privacidade
* Uso do **Supabase RLS (Row Level Security)** nas tabelas do banco de dados para garantir que apenas usuários com token JWT válido de autenticação possam gravar/editar campanhas.
* Chaves de acesso públicas do Supabase configuradas com políticas de segurança restritas para leitura pública e escrita anônima de comentários.

### Acessibilidade (WCAG 2.1 AA)
* Garantir contraste de cores adequado para os textos sobre as barras de cores das tags/canais no calendário (relação mínima de 4.5:1).
* Elementos interativos navegáveis via teclado.

### Compatibilidade
* Compatibilidade com as duas últimas versões dos principais navegadores (Chrome, Firefox, Safari e Edge).
* Design Responsivo: A visualização em "Lista" deve se tornar a padrão em telas menores (smartphones) para garantir legibilidade.

### LGPD (Lei Geral de Proteção de Dados)
* Como o sistema armazena apenas dados de campanhas corporativas e nomes/comentários auto-informados pelos usuários, o risco de privacidade é baixo. Não há rastreamento ou coleta de dados pessoais sem consentimento.

---

## 9. Métricas de Sucesso
* **Adoção interna:** 100% das novas campanhas ativas e planejadas inseridas na agenda pela equipe de marketing no primeiro mês de uso.
* **Engajamento de consulta e colaboração:** Acesso regular da agência para visualização e uso da seção de comentários para alinhamento.
* **Previsibilidade:** Redução de campanhas lançadas sem criativos ou avisos prévios à agência.

---

## 10. Decisões Técnicas Iniciais e Hospedagem

### Banco de Dados e Backend
* **Recomendação:** Supabase (Banco Postgres na Nuvem, gratuito). Essencial para permitir que múltiplos usuários do marketing colaborem e editem a agenda simultaneamente de diferentes computadores, além de coletar comentários do Roberto na nuvem.
* **Configuração:** Seguir as recomendações do **Anexo A** do tutorial de banco de dados e persistência.

### Autenticação/Login
* **Recomendação:** Supabase Auth usando o e-mail corporativo do Google/Outlook cadastrado previamente no painel do Supabase.
* **Configuração:** Seguir as recomendações do **Anexo A**.

### Pagamentos
* **Recomendação:** Não aplicável ao MVP. Ignorar o **Anexo B**.

### Publicação e Hospedagem
* **Front-end:** Hospedado no **GitHub Pages** de forma estática e gratuita.
* **Conexão Segura:** O código JS compilado no GitHub Pages se conecta diretamente à API do Supabase na nuvem usando HTTPS para buscar as campanhas e salvar os comentários em tempo real.
* **Configuração do deploy:** Seguir as diretrizes do **Anexo C** na fase final de publicação.
