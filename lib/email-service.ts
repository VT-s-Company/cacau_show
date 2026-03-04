/**
 * Serviço de envio de emails para confirmação de pagamento
 * Integrado com Brevo (Sendinblue)
 */

import axios from "axios";

export interface PaymentEmailData {
  transactionId: string;
  customerEmail: string;
  customerName: string;
  customerCpf?: string;
  customerPhone?: string;
  amount: number;
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zip_code?: string;
  };
  shippingMethod: string;
  estimatedDelivery: string; // data estimada
}

async function sendWithBrevo(
  to: string,
  toName: string,
  subject: string,
  htmlContent: string,
): Promise<boolean> {
  try {
    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoApiUrl = process.env.BREVO_API_URL;

    if (!brevoApiKey) {
      console.error("❌ BREVO_API_KEY não configurado");
      return false;
    }

    const response = await axios.post(
      `${brevoApiUrl}/smtp/email`,
      {
        to: [
          {
            email: to,
            name: toName,
          },
        ],
        sender: {
          email: process.env.MAIL_FROM_ADDRESS,
          name: process.env.MAIL_FROM_NAME || "Cacau Show",
        },
        subject,
        htmlContent,
      },
      {
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
        },
      },
    );

    console.log(`✅ Email enviado via Brevo para ${to}:`, response.data);
    return true;
  } catch (error) {
    console.error("❌ Erro ao enviar email via Brevo:", error);
    return false;
  }
}

export async function sendPaymentConfirmationEmail(
  data: PaymentEmailData,
): Promise<boolean> {
  try {
    console.log(`📧 Enviando email de confirmação para: ${data.customerEmail}`);

    // Gerar HTML do email
    const htmlContent = generateConfirmationEmailHTML(data);

    // Enviar via Brevo
    const result = await sendWithBrevo(
      data.customerEmail,
      data.customerName,
      "🎉 Pagamento Confirmado - Cacau Show",
      htmlContent,
    );

    return result;
  } catch (error) {
    console.error("Erro ao enviar email de confirmação:", error);
    return false;
  }
}

export async function sendPaymentFailedEmail(
  data: PaymentEmailData,
): Promise<boolean> {
  try {
    console.log(
      `📧 Enviando email de falha de pagamento para: ${data.customerEmail}`,
    );

    const htmlContent = generateFailedEmailHTML(data);

    // Enviar via Brevo
    const result = await sendWithBrevo(
      data.customerEmail,
      data.customerName,
      "⚠️ Pagamento Não Confirmado - Cacau Show",
      htmlContent,
    );

    return result;
  } catch (error) {
    console.error("Erro ao enviar email de falha:", error);
    return false;
  }
}

function generateConfirmationEmailHTML(data: PaymentEmailData): string {
  const itemsTotal = data.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pagamento Confirmado - Cacau Show</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
    .header h1 { margin: 0; font-size: 28px; }
    .section { margin-bottom: 25px; }
    .section h2 { color: #8B4513; font-size: 18px; border-bottom: 2px solid #D2691E; padding-bottom: 10px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .info-label { font-weight: bold; color: #666; }
    .info-value { text-align: right; }
    .item { padding: 10px; background: #f9f9f9; margin: 5px 0; border-radius: 4px; }
    .item-row { display: flex; justify-content: space-between; }
    .total-section { background: #f0f0f0; padding: 15px; border-radius: 8px; font-size: 16px; }
    .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
    .total-row.grand-total { font-size: 18px; font-weight: bold; color: #2d9b3a; border-top: 2px solid #ddd; padding-top: 10px; }
    .address-box { background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #D2691E; }
    .delivery-info { background: #e8f5e9; padding: 15px; border-radius: 8px; border-left: 4px solid #2d9b3a; margin: 20px 0; }
    .delivery-info strong { color: #2d9b3a; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
    .btn { display: inline-block; background: #2d9b3a; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Pagamento Confirmado!</h1>
      <p>Obrigado pela sua compra</p>
    </div>

    <div class="section">
      <h2>Informações do Pedido</h2>
      <div class="info-row">
        <span class="info-label">ID do Pedido:</span>
        <span class="info-value">${data.transactionId}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Data do Pagamento:</span>
        <span class="info-value">${new Date().toLocaleDateString("pt-BR")}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Cliente:</span>
        <span class="info-value">${data.customerName}</span>
      </div>
    </div>

    <div class="section">
      <h2>📦 Itens do Pedido</h2>
      ${data.items
        .map(
          (item) => `
        <div class="item">
          <div class="item-row">
            <span><strong>${item.title}</strong></span>
            <span>${item.quantity}x ${formatCurrency(item.unitPrice)}</span>
          </div>
          <div class="item-row" style="justify-content: flex-end; color: #666;">
            <span>${formatCurrency(item.quantity * item.unitPrice)}</span>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>

    <div class="section">
      <h2>💰 Resumo do Pagamento</h2>
      <div class="total-section">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(itemsTotal)}</span>
        </div>
        <div class="total-row">
          <span>Frete (${data.shippingMethod}):</span>
          <span>${formatCurrency(data.amount - itemsTotal)}</span>
        </div>
        <div class="total-row grand-total">
          <span>Total Pago:</span>
          <span>${formatCurrency(data.amount)}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>📍 Endereço de Entrega</h2>
      <div class="address-box">
        <p><strong>${data.customerName}</strong></p>
        <p>${data.shippingAddress.street}, ${data.shippingAddress.number}</p>
        ${data.shippingAddress.complement ? `<p>${data.shippingAddress.complement}</p>` : ""}
        <p>${data.shippingAddress.district}, ${data.shippingAddress.city} - ${data.shippingAddress.state}</p>
      </div>
    </div>

    <div class="delivery-info">
      <h3 style="margin-top: 0;">⏱️ Prazo de Entrega</h3>
      <p><strong>Estimada em até 8 dias úteis</strong></p>
      <p style="color: #666; font-size: 14px; margin: 0;">Você receberá um email de rastreamento quando o seu pedido for enviado.</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <p style="color: #666;">Aproveite seu produto! 🍫</p>
    </div>

    <div class="footer">
      <p>Este é um email automático. Não responda para este endereço.</p>
      <p>Qualquer dúvida, entre em contato através do nosso site: www.ofertinhas.site</p>
      <p>&copy; 2026 Cacau Show. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateFailedEmailHTML(data: PaymentEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pagamento Não Confirmado - Cacau Show</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ff6b6b; color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ff6b6b; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Pagamento Não Confirmado</h1>
    </div>

    <div class="content">
      <p>Olá <strong>${data.customerName}</strong>,</p>
      <p>Seu pagamento PIX no valor de <strong>R$ ${(data.amount / 100).toFixed(2)}</strong> não foi confirmado.</p>
      <p><strong>Motivos possíveis:</strong></p>
      <ul>
        <li>O código PIX expirou antes do pagamento</li>
        <li>O pagamento não foi finalizado</li>
        <li>Houve um erro na transferência</li>
      </ul>
      <p>Para tentar novamente, acesse: <a href="https://www.ofertinhas.site">www.ofertinhas.site</a></p>
      <p>Se precisar de ajuda, entre em contato com nosso suporte.</p>
    </div>

    <div class="footer">
      <p>&copy; 2026 Cacau Show. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
  `;
}
