# 🍫 Cacau Show - E-commerce

Sistema de e-commerce completo para venda de chocolates com pagamento via PIX, desenvolvido com Next.js 14 e TypeScript.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Prisma ORM** - Gerenciamento de banco de dados
- **PostgreSQL (Neon)** - Banco de dados serverless
- **FreePay Brasil** - API de pagamentos PIX
- **Brevo (Sendinblue)** - Serviço de envio de emails

## 📋 Funcionalidades

✅ Catálogo de produtos com filtros e busca  
✅ Carrinho de compras com localStorage  
✅ Checkout completo com validação de CPF e CEP  
✅ Integração com FreePay Brasil para pagamento PIX  
✅ Envio automático de emails de confirmação via Brevo  
✅ Webhooks para atualização de status de pagamento  
✅ Dashboard administrativo com autenticação  
✅ Exportação de transações para Excel  
✅ Persistência de dados com PostgreSQL (Neon) + Prisma  

## 🛠️ Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local com suas credenciais

# Criar banco de dados
npx prisma generate
npx prisma db push

# Rodar em desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuração

### 1. FreePay Brasil

Obtenha suas credenciais em [https://freepaybrasil.com.br](https://freepaybrasil.com.br)

```env
FREEPAY_PUBLIC_KEY=pk_live_...
FREEPAY_SECRET_KEY=sk_live_...
FREEPAY_WEBHOOK_URL=https://seu-dominio.com/api/webhook/freepay
```

### 2. Brevo (Email)

Obtenha a API key em [https://app.brevo.com/settings/keys/api](https://app.brevo.com/settings/keys/api)

```env
BREVO_API_KEY=xsmtpsib-...
```

### 3. Neon PostgreSQL (Database)

Crie um banco de dados no Neon através da Vercel:

1. Acesse [Vercel Storage](https://vercel.com/storage/postgres)
2. Crie um novo banco de dados Neon
3. Copie as credenciais geradas

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:password@host.neon.tech/database?sslmode=require
```

O `DATABASE_URL` usa connection pooling (recomendado para aplicações).  
O `DATABASE_URL_UNPOOLED` é conexão direta (use para migrações se necessário).

### 4. Admin Dashboard

Configure credenciais do admin:

```env
ADMIN_ROUTE_HASH=seu_hash_personalizado
ADMIN_USERNAME=admin@cacau.com.br
ADMIN_PASSWORD_HASH=$2y$12$...
```

**Gere o hash da senha em:** [https://bcrypt-generator.com/](https://bcrypt-generator.com/) (rounds: 12)

## 📱 Rotas

- `/` - Loja (produtos)
- `/admin/[hash]/login` - Login do admin
- `/admin/[hash]/dashboard` - Dashboard administrativo
- `/api/webhook/freepay` - Webhook de pagamentos
- `/api/admin/auth` - Autenticação admin
- `/api/admin/transactions` - API de transações

## 🗄️ Banco de Dados

O projeto usa Prisma ORM com PostgreSQL (Neon) - um banco de dados serverless otimizado para Next.js.

```bash
# Gerar Prisma Client
npx prisma generate

# Sincronizar schema com banco (cria/atualiza tabelas)
npx prisma db push

# Abrir Prisma Studio (interface visual do banco)
npx prisma studio

# Resetar banco (CUIDADO: apaga todos os dados)
npx prisma db push --force-reset
```

**Vantagens do Neon:**
- ✅ Serverless (paga apenas pelo uso)
- ✅ Connection pooling automático
- ✅ Escalabilidade automática
- ✅ Compatível com Vercel
- ✅ Backups automáticos

## 📊 Dashboard Admin

Acesse: `http://localhost:3000/admin/[SEU_HASH]/login`

Funcionalidades:
- Lista de todas as transações
- Estatísticas (total, pago, pendente, recusado)
- Exportação para Excel
- Exclusão de transações
- Dados completos: CPF, telefone, endereço, CEP

## 🧪 Ambiente de Desenvolvimento

Produto de teste disponível apenas em `NODE_ENV=development`:
- ID: 999
- Preço: R$ 0,50
- Nome: "Tablete Teste"

## 📦 Build para Produção

```bash
# Build
npm run build

# Rodar em produção
npm start
```

## 📄 Licença

Este projeto é privado.

