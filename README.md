# Agenda de Campanhas

A **Agenda de Campanhas** é uma ferramenta web interativa focada em dar previsibilidade sobre campanhas de mídia paga vigentes e planejadas. Ela centraliza e exibe o cronograma de lançamentos por meio de calendários mensal/semanal e lista cronológica, facilitando o alinhamento de entregas de criativos e copys entre a equipe de marketing interna (usuários autenticados) e a agência parceira (usuários de consulta pública).

---

## 🚀 Como Rodar Localmente

Siga os passos abaixo para configurar e rodar o projeto em sua máquina:

1. **Clonar o repositório** e navegar até a pasta do projeto.
2. **Instalar as dependências** do projeto rodando o comando:
   ```bash
   npm install
   ```
3. **Configurar as variáveis de ambiente:**
   * Crie um arquivo chamado `.env.local` na raiz do projeto.
   * Copie o conteúdo de `.env.example` para dentro dele.
   * Preencha as chaves com as credenciais do seu projeto no **Supabase**.
4. **Iniciar o servidor de desenvolvimento** local executando:
   ```bash
   npm run dev
   ```
5. **Acessar o aplicativo:** Abra o navegador e acesse a URL que aparecer no seu terminal (geralmente [http://localhost:5173](http://localhost:5173)).

---

## 🛠️ Stack Técnica do MVP

* **Frontend:** Vite + React + TypeScript
* **Estilização:** Tailwind CSS (Estilo utilitário) + shadcn/ui (Biblioteca de componentes acessíveis)
* **Backend & Banco de dados:** Supabase (PostgreSQL na nuvem e autenticação Supabase Auth)
* **Hospedagem:** GitHub Pages (Ambiente estático gratuito)

---

## 📁 Documentos de Referência

* [Documento de Requisitos de Produto (PRD.md)](./PRD.md)
* [Planejamento de Stack Técnica (TECH_STACK.md)](./TECH_STACK.md)
