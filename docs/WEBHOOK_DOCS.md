# Webhook de Pagamento - Documentação Completa

## 📋 Visão Geral

Este sistema implementa um fluxo completo de pagamento via PIX com callback webhook, confirmação de email e página de sucesso.

## 🔄 Fluxo de Pagamento Completo

```
1. Cliente preenche checkout
   ↓
2. Sistema gera PIX via FreePay Brasil
   ├─ URL de callback: POST /api/webhook/freepay
   └─ Email configurado em metadata
   ↓
3. Cliente paga via PIX
   ↓
4. FreePay notifica webhook
   ↓
5. Webhook processa pagamento
   ├─ Status = PAID/CONFIRMED
   ├─ Armazena transação
   └─ Prepara dados para email
   ↓
6. Email enviado para cliente
   ├─ Confirmação de pagamento
   ├─ Resumo do pedido
   ├─ Dados de entrega
   └─ Prazo: até 8 dias úteis
   ↓
7. Cliente redirecionado para /payment-success
   ├─ Exibe confirmação
   ├─ Timeline de próximas etapas
   └─ Informações de rastreamento
```

## 📁 Arquivos do Sistema

### 1. Webhook Endpoint
**Arquivo:** `app/api/webhook/freepay/route.ts`

**POST /api/webhook/freepay**
- Recebe notificações da FreePay Brasil
- Processa status de pagamento (PAID, REFUSED, FAILED, etc)
- Armazena transação em memória (TODO: implementar banco de dados)
- Envia email de confirmação (TODO: implementar serviço)

**Exemplo de Payload Recebido:**
```json
{
  "data": {
    "id": "924422a5e6f348b58c8e99bbe76665fa",
    "amount": 3873,
    "status": "PAID",
    "payment_method": "pix",
    "pix": {
      "qr_code": "00020101021226940014...",
      "expiration_date": "2026-03-04T13:38:59+00:00"
    }
  },
  "event": "payment.confirmed",
  "timestamp": "2026-03-04T13:37:56Z"
}
```

**GET /api/webhook/freepay?id=<transactionId>**
- Recupera status de uma transação específica
- Usado pela página de sucesso para validar o pagamento

### 2. Serviço de Email
**Arquivo:** `lib/email-service.ts`

#### Função: `sendPaymentConfirmationEmail(data)`
Envia email de confirmação com:
- ID do pedido
- Resumo dos itens
- Valor total pago
- Endereço de entrega
- **Prazo: até 8 dias úteis**
- Link para rastreamento
- Instrções de contato

#### Função: `sendPaymentFailedEmail(data)`
Envia email em caso de pagamento recusado/falhado

### 3. Página de Sucesso
**Arquivo:** `app/components/home/PaymentSuccessPage.tsx`
**Rota:** `/payment-success[?id=<transactionId>]`

Exibe:
- ✅ Confirmação de pagamento
- 💰 Valor total pago
- 📦 Itens do pedido
- 📍 Endereço de entrega
- ⏱️ Prazo: até 8 dias úteis
- 📧 Email de confirmação enviado
- 📍 Timeline: Confirmação → Preparação → Trânsito → Entrega

### 4. Armazenamento Local
**Arquivo:** `lib/checkout-storage.ts`

Funções utilitárias:
- `storeCheckoutData(data)` - Armazena em localStorage
- `getStoredCheckoutData()` - Recupera dados
- `clearStoredCheckoutData()` - Limpa dados
- `convertPixCheckoutToCheckoutData()` - Converte estrutura

## 🔧 Integração com PixCheckout

Adicione ao final do `handleFinishPurchase` (após receber resposta da API):

```typescript
// Armazenar dados para uso posterior
const checkoutData = convertPixCheckoutToCheckoutData(
  transactionId,          // do response da API
  fullName,
  "email@usuario.com",    // TODO: adicionar email no formulário
  items,
  {
    street: street,
    street_number: number,
    complement: complement,
    neighborhood: district,
    city: city,
    state: state,
  },
  shippingOption,
  totalPrice,
);

storeCheckoutData(checkoutData);

// Redirecionar para página de sucesso
window.location.href = `/payment-success?id=${transactionId}`;
```

## 📧 Formas de Envio de Email

### Opção 1: Resend (Recomendado para Next.js)
```bash
npm install resend
```

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWithResend(
  email: string,
  htmlContent: string,
): Promise<boolean> {
  try {
    const response = await resend.emails.send({
      from: "noreply@cacaushow.com.br",
      to: email,
      subject: "Pagamento Confirmado - Cacau Show",
      html: htmlContent,
    });
    return response.error === null;
  } catch (error) {
    console.error("Erro ao enviar email com Resend:", error);
    return false;
  }
}
```

### Opção 2: Nodemailer (Para Gmail, Outlook, etc)
```bash
npm install nodemailer
```

```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendWithNodemailer(
  email: string,
  htmlContent: string,
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: "contato@cacaushow.com.br",
      to: email,
      subject: "Pagamento Confirmado - Cacau Show",
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return false;
  }
}
```

### Opção 3: SendGrid
```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendWithSendGrid(
  email: string,
  htmlContent: string,
): Promise<boolean> {
  try {
    await sgMail.send({
      to: email,
      from: "noreply@cacaushow.com.br",
      subject: "Pagamento Confirmado - Cacau Show",
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Erro ao enviar email com SendGrid:", error);
    return false;
  }
}
```

## 🗄️ Armazenamento Persistente

Atualmente o sistema usa Map em memória (perdido ao reiniciar servidor).

### Implementar com Banco de Dados

```typescript
// lib/database.ts
import prisma from "@/lib/prisma";

export async function storeTransaction(data: any) {
  return prisma.transaction.create({
    data: {
      id: data.id,
      amount: data.amount,
      status: data.status,
      customerEmail: data.email,
      customerName: data.name,
      items: JSON.stringify(data.items),
      shippingAddress: JSON.stringify(data.address),
      paymentDate: new Date(),
    },
  });
}

export async function getTransaction(id: string) {
  return prisma.transaction.findUnique({
    where: { id },
  });
}
```

### Schema Prisma
```prisma
model Transaction {
  id                String    @id
  amount            Int
  status            String
  customerEmail     String
  customerName      String
  items             String    // JSON
  shippingAddress   String    // JSON
  paymentDate       DateTime
  confirmedAt       DateTime?
  sentEmail         Boolean   @default(false)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

## 🔐 Variáveis de Ambiente

```env
# Webhook callback
FREEPAY_WEBHOOK_URL=http://seu-dominio.com/api/webhook/freepay

# Email (escolha um)
RESEND_API_KEY=re_xxxxx
# OU
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
# OU
SENDGRID_API_KEY=SG.xxxxx
```

## 📊 Status de Pagamento

- `PENDING` - Aguardando pagamento
- `PAID` / `CONFIRMED` - Pagamento confirmado ✅
- `REFUSED` - Pagamento recusado ❌
- `FAILED` - Erro no processamento ❌
- `CANCELLED` - Cancelado pelo usuário ❌

## 🚀 Próximos Passos

1. ✅ **Webhook criado** - Recebe notificações
2. ⏳ **Envio de email** - Ainda em TODO
3. ✅ **Página de sucesso** - Pronta
4. ⏳ **Armazenamento banco dados** - Recomendado para produção
5. ⏳ **Integração completa** - Adicionar chamada no PixCheckout
6. ⏳ **Autenticação webhook** - Validar assinatura da FreePay
7. ⏳ **Retry automático** - Caso email falhe

## 📝 Checklist de Implementação

- [ ] Escolher provedor de email
- [ ] Instalar dependências de email
- [ ] Implementar `sendPaymentConfirmationEmail()` no webhook
- [ ] Testar envio de email
- [ ] Adicionar email como campo no checkout
- [ ] Integrar redirect com armazenamento de dados
- [ ] Testar fluxo completo
- [ ] Implementar banco de dados para transações
- [ ] Adicionar validação de assinatura do webhook
- [ ] Setup SMTP para produção

## 🧪 Teste Local

1. Abrir ngrok ou similar para expor localhost
2. Atualizar `postback_url` com URL pública
3. Fazer pagamento de teste
4. Verificar logs do webhook
5. Confirmar página de sucesso

```bash
# Terminal 1: ngrok
ngrok http 3000

# Terminal 2: aplicação
npm run dev

# Terminal 3: monitorar logs
tail -f /var/log/seu-app
```

## 📞 Suporte

Para dúvidas sobre:
- **FreePay Brasil**: https://freepaybrasil.readme.io
- **Resend**: https://resend.com/docs
- **Nodemailer**: https://nodemailer.com
- **SendGrid**: https://sendgrid.com/docs
