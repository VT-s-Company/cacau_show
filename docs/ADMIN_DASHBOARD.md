# Dashboard Administrativo - Cacau Show

## 🔐 Acesso ao Dashboard

### URL de Acesso
O dashboard está protegido por uma rota com hash configurável:

```
http://localhost:3000/admin/admin-dashboard-2026/login
```

**Nota:** O hash `admin-dashboard-2026` pode ser customizado através da variável de ambiente `ADMIN_ROUTE_HASH` no arquivo `.env.local`.

### Credenciais Padrão (Desenvolvimento)
- **Usuário:** `admin`
- **Senha:** `admin123`

## 📊 Funcionalidades

### 1. **Dashboard Principal**
- Visualização de todas as transações
- Estatísticas em tempo real:
  - Total de transações
  - Transações pagas
  - Transações pendentes
  - Transações recusadas

### 2. **Gerenciamento de Transações**
Cada transação exibe:
- ✅ ID da transação
- 📊 Status (Pago, Pendente, Recusado, Falhou)
- 👤 Nome do cliente
- 📧 Email
- 🆔 CPF
- 📮 CEP
- 💰 Valor
- 📅 Data e hora
- 📍 Endereço completo

### 3. **Ações Disponíveis**
- 🔄 **Atualizar:** Recarrega a lista de transações
- 📥 **Exportar Excel:** Baixa todas as transações em formato .xlsx
- 🗑️ **Deletar:** Remove uma ou mais transações selecionadas

### 4. **Exportação para Excel**
O arquivo Excel exportado contém todas as informações:
- ID da Transação
- Status
- Data/Hora
- Nome do Cliente
- Email
- CPF
- Telefone
- Valor
- Método de Frete
- CEP
- Endereço completo (Rua, Número, Complemento, Bairro, Cidade, Estado)
- Lista de itens comprados

## 🔧 Configuração

### Variáveis de Ambiente (.env.local)

```bash
# ==================================================
# ADMIN DASHBOARD
# ==================================================

ADMIN_ROUTE_HASH=admin-dashboard-2026
ADMIN_USERNAME=admin
# Senha padrão: admin123 (em produção, usar hash bcrypt)
ADMIN_PASSWORD_HASH=$2a$10$rQZ0qJxZxZxZxZxZxZxZxuKqJ0qJ0qJ0qJ0qJ0qJ0qJ0qJ0qJ0qJ0q
```

### Customização do Hash da Rota

Para alterar o hash da rota de acesso:

1. Edite o arquivo `.env.local`
2. Modifique a variável `ADMIN_ROUTE_HASH`:
   ```bash
   ADMIN_ROUTE_HASH=meu-dashboard-secreto-2026
   ```
3. Reinicie o servidor
4. Acesse: `http://localhost:3000/admin/meu-dashboard-secreto-2026/login`

## 🚀 Como Usar

### 1. Fazer Login
1. Acesse `/admin/[seu-hash]/login`
2. Digite as credenciais
3. Será redirecionado para o dashboard

### 2. Visualizar Transações
- Todas as transações são exibidas em uma tabela
- Use a barra de rolagem horizontal para ver todas as colunas

### 3. Selecionar Transações
- Clique nos checkboxes para selecionar transações individuais
- Use o checkbox do cabeçalho para selecionar/desselecionar todas

### 4. Deletar Transações
1. Selecione uma ou mais transações
2. Clique em "Deletar Selecionados"
3. Confirme a ação

### 5. Exportar para Excel
1. Clique em "Exportar Excel"
2. O arquivo será baixado automaticamente com nome `transacoes_YYYY-MM-DD.xlsx`

### 6. Fazer Logout
- Clique no botão "Sair" no canto superior direito

## 📝 Status de Transações

| Status | Descrição | Cor |
|--------|-----------|-----|
| **PAID** | Pagamento confirmado | 🟢 Verde |
| **CONFIRMED** | Transação confirmada | 🟢 Verde |
| **PENDING** | Aguardando pagamento | 🟡 Amarelo |
| **REFUSED** | Pagamento recusado | 🔴 Vermelho |
| **FAILED** | Falha no pagamento | 🔴 Vermelho |

## 🔒 Segurança

### Desenvolvimento
- Autenticação básica com credenciais em variáveis de ambiente
- Cookie de sessão válido por 24 horas
- Rota protegida por hash customizável

### Produção (Recomendações)
1. **Use HTTPS:** Sempre em produção
2. **Hash Bcrypt:** Utilize hash bcrypt para senhas
3. **Banco de Dados:** Migre de Map em memória para PostgreSQL/MongoDB
4. **JWT:** Considere usar JWT para autenticação
5. **Rate Limiting:** Proteja contra ataques de força bruta
6. **Auditoria:** Registre todas as ações de admin em logs

## 🗄️ Armazenamento de Dados

### Estado Atual
- **Armazenamento:** Map em memória (compartilhado entre webhook e dashboard)
- **Persistência:** Dados são perdidos ao reiniciar o servidor

### Migração para Produção
Para produção, recomenda-se migrar para banco de dados:

```typescript
// Exemplo com Prisma
// schema.prisma
model Transaction {
  id            String   @id @default(uuid())
  transactionId String   @unique
  amount        Int
  status        String
  customerName  String?
  customerEmail String?
  customerCpf   String?
  customerPhone String?
  checkoutData  Json?
  paymentDate   DateTime @default(now())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## 🔗 Rotas da API

### Autenticação
- **POST** `/api/admin/auth` - Login
- **DELETE** `/api/admin/auth` - Logout
- **GET** `/api/admin/auth` - Verificar sessão

### Transações
- **GET** `/api/admin/transactions` - Listar todas as transações
- **DELETE** `/api/admin/transactions` - Deletar transações
  ```json
  { "ids": ["transaction_id_1", "transaction_id_2"] }
  ```
- **POST** `/api/admin/transactions` - Adicionar transação manualmente (para testes)

## 🎨 Interface

- **Design:** Tailwind CSS com gradiente chocolate/marrom
- **Responsivo:** Funciona em desktop e mobile
- **Tabela:** Scroll horizontal para muitas colunas
- **Badges:** Cores indicativas de status
- **Cards:** Estatísticas em destaque

## 📦 Dependências

- `xlsx` - Exportação para Excel
- `js-cookie` - Gerenciamento de cookies
- `bcryptjs` - Hash de senhas (pronto para uso)
- `@types/js-cookie` - Tipos TypeScript
- `@types/bcryptjs` - Tipos TypeScript

## 🐛 Troubleshooting

### Não consigo fazer login
- Verifique se as credenciais estão corretas (admin/admin123)
- Verifique se o cookie não está bloqueado pelo navegador
- Limpe os cookies e tente novamente

### Transações não aparecem
- Verifique se há transações registradas no sistema
- Clique em "Atualizar" para recarregar
- Verifique o console do navegador para erros

### Exportação não funciona
- Verifique se há transações para exportar
- Desabilite bloqueadores de popup
- Verifique se o navegador permite downloads

### Erro 401 (Não autorizado)
- Faça login novamente
- Verifique se o cookie de sessão não expirou (24h)

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- Console do navegador (F12)
- Logs do servidor Next.js
- Arquivo `.env.local` está configurado corretamente
