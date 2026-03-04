# Integração PIX - FreePay Brasil

Este projeto utiliza a API da FreePay Brasil para processar pagamentos via PIX.

## Configuração

### 1. Obter Chave da API

1. Acesse [FreePay Brasil](https://freepaybrasil.com.br)
2. Crie uma conta ou faça login
3. Acesse o painel e obtenha sua chave de API

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

2. Edite o arquivo `.env.local` e adicione sua chave de API:

```env
NEXT_PUBLIC_FREEPAY_API_KEY=sua_chave_api_aqui
```

### 3. Webhook (Opcional)

Para receber atualizações sobre o status dos pagamentos, você precisará configurar um endpoint de webhook:

**URL do webhook:** `https://seu-dominio.com/api/webhook/freepay`

O webhook ainda não foi implementado neste projeto. Você precisará criar o arquivo `app/api/webhook/freepay/route.ts` para processar as notificações.

## Como Funciona

### Fluxo de Pagamento

1. **Usuário preenche dados**: Nome, CPF, telefone, endereço
2. **Seleciona produtos**: Produto principal + tabletes opcionais
3. **Escolhe frete**: Grátis, Jadlog ou Correios PAC (com ajuste regional por CEP)
4. **Finaliza compra**: Clica em "Finalizar compra via PIX"
5. **Sistema gera PIX**: Chama API FreePay com todos os dados
6. **Modal exibe QR Code**: Usuário pode escanear ou copiar código
7. **Pagamento confirmado**: Webhook atualiza status (quando implementado)

### Dados Enviados para API

```typescript
{
  amount: 15000, // R$ 150,00 em centavos
  payment_method: "pix",
  customer: {
    name: "João Silva",
    email: "cliente@example.com",
    document: "12345678900",
    phone: "11999999999",
    address: { /* endereço completo */ }
  },
  items: [
    { title: "Ovo de Páscoa", unit_price: 12000, quantity: 1 },
    { title: "Tablete Pistache", unit_price: 1000, quantity: 1 },
    { title: "Frete Jadlog", unit_price: 1500, quantity: 1 }
  ],
  pix: { expires_in: 3600 }, // 1 hora
  metadata: { provider_name: "Cacau Show - Promoção Páscoa" }
}
```

### Resposta da API

```typescript
{
  id: "trans_abc123",
  status: "pending",
  amount: 15000,
  pix: {
    qr_code: "00020126580014...", // Código copia e cola
    qr_code_base64: "iVBORw0KGgoAAA...", // QR Code em base64
    expires_at: "2026-03-04T18:00:00Z"
  }
}
```

## Componentes Criados

### PixPaymentModal

Modal responsável por exibir os detalhes do pagamento PIX:

- **QR Code**: Imagem base64 para escanear
- **Código Copia e Cola**: Input com botão de copiar
- **Valor**: Display formatado em Real
- **Validade**: Data/hora de expiração
- **ID da Transação**: Referência única

**Localização:** `app/components/home/PixPaymentModal.tsx`

### API Client

Funções para integração com FreePay Brasil:

- `createPixTransaction()`: Cria transação PIX
- Tipos TypeScript completos
- Tratamento de erros

**Localização:** `lib/freepay-api.ts`

## Ajuste de Frete por Região

O sistema ajusta automaticamente o valor do frete baseado no CEP:

- **Sudeste** (0-3): -R$ 5,00
- **Norte/Nordeste/CO** (6-8): +R$ 5,00
- **Demais regiões** (4-5, 9): Valor normal

## Próximos Passos

### Implementar Webhook

Crie `app/api/webhook/freepay/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  
  // Validar assinatura do webhook
  // Processar status: paid, failed, refunded, etc.
  // Atualizar banco de dados
  // Enviar confirmação por email
  
  return NextResponse.json({ received: true });
}
```

### Adicionar Campo de Email

Atualmente o email está fixo como `cliente@example.com`. Adicione um campo de email no formulário de checkout.

### Armazenar Transações

Implemente um banco de dados para armazenar:
- ID da transação
- Status do pagamento
- Dados do cliente
- Produtos comprados

### Tratamento de Status

Adicione lógica para:
- Polling do status da transação
- Redirecionar após pagamento confirmado
- Exibir erro se pagamento falhar
- Permitir cancelamento

## Documentação Oficial

- [API Reference](https://freepaybrasil.readme.io/reference)
- [Criar Transação](https://freepaybrasil.readme.io/reference/createpaymenttransaction-1)
- [Formato dos Webhooks](https://freepaybrasil.readme.io/reference/formato-dos-webhooks)

## Suporte

Para problemas com a API FreePay, entre em contato com o suporte deles através do site oficial.
