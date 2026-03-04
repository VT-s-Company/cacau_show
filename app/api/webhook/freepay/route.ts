import { NextRequest, NextResponse } from "next/server";
import {
  sendPaymentConfirmationEmail,
  sendPaymentFailedEmail,
  type PaymentEmailData,
} from "@/lib/email-service";
import { prisma } from "@/lib/prisma";

interface FreepayWebhookPayload {
  data: {
    id: string;
    amount: number;
    status: string;
    payment_method: string;
    pix?: {
      qr_code: string;
      expiration_date: string;
    };
    custom_id?: string;
    created_at?: string;
  };
  event?: string;
  timestamp?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const method = searchParams.get("method");

    // Registrar dados de checkout antes de gerar PIX
    if (method === "register") {
      const checkoutData: PaymentEmailData = await req.json();

      // Salvar no banco de dados
      await prisma.transaction.create({
        data: {
          transactionId: checkoutData.transactionId,
          amount: checkoutData.amount,
          status: "PENDING",
          customerName: checkoutData.customerName,
          customerEmail: checkoutData.customerEmail,
          customerCpf: checkoutData.customerCpf,
          customerPhone: checkoutData.customerPhone,
          street: checkoutData.shippingAddress.street,
          streetNumber: checkoutData.shippingAddress.number,
          complement: checkoutData.shippingAddress.complement,
          district: checkoutData.shippingAddress.district,
          city: checkoutData.shippingAddress.city,
          state: checkoutData.shippingAddress.state,
          zipCode: checkoutData.shippingAddress.zip_code,
          shippingMethod: checkoutData.shippingMethod,
          items: JSON.stringify(checkoutData.items),
        },
      });

      console.log(
        `✅ Dados de checkout registrados para transação: ${checkoutData.transactionId}`,
      );

      return NextResponse.json({ registered: true });
    }

    // Processar webhook de pagamento
    const payload: FreepayWebhookPayload = await req.json();

    console.log("=== Webhook FreePay Recebido ===");
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const { data } = payload;

    if (!data) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Verificar se o pagamento foi confirmado
    if (data.status === "CONFIRMED" || data.status === "PAID") {
      console.log(`✅ Pagamento confirmado: ${data.id}`);

      // Recuperar dados de checkout do banco
      const stored = await prisma.transaction.findUnique({
        where: { transactionId: data.id },
      });

      // Atualizar status da transação
      await prisma.transaction.update({
        where: { transactionId: data.id },
        data: {
          status: data.status,
          paymentDate: new Date(),
        },
      });

      // Enviar email de confirmação
      if (stored) {
        const checkoutData: PaymentEmailData = {
          transactionId: stored.transactionId,
          customerEmail: stored.customerEmail || "",
          customerName: stored.customerName || "",
          customerCpf: stored.customerCpf,
          customerPhone: stored.customerPhone,
          amount: stored.amount,
          items: stored.items ? JSON.parse(stored.items) : [],
          shippingAddress: {
            street: stored.street || "",
            number: stored.streetNumber || "",
            complement: stored.complement,
            district: stored.district || "",
            city: stored.city || "",
            state: stored.state || "",
            zip_code: stored.zipCode,
          },
          shippingMethod: stored.shippingMethod || "",
          estimatedDelivery: "",
        };

        const emailSent = await sendPaymentConfirmationEmail(checkoutData);
        console.log(
          `📧 Email de confirmação ${emailSent ? "enviado" : "não enviado"} para ${checkoutData.customerEmail}`,
        );
      } else {
        console.warn(
          "⚠️ Dados de checkout não encontrados para enviar email. Transação ID:",
          data.id,
        );
      }

      return NextResponse.json(
        { received: true, status: "processed" },
        { status: 200 },
      );
    }

    if (data.status === "REFUSED" || data.status === "FAILED") {
      console.log(`❌ Pagamento recusado/falhou: ${data.id}`);

      // Recuperar dados de checkout do banco
      const stored = await prisma.transaction.findUnique({
        where: { transactionId: data.id },
      });

      // Atualizar status
      if (stored) {
        await prisma.transaction.update({
          where: { transactionId: data.id },
          data: { status: data.status },
        });

        const checkoutData: PaymentEmailData = {
          transactionId: stored.transactionId,
          customerEmail: stored.customerEmail || "",
          customerName: stored.customerName || "",
          customerCpf: stored.customerCpf,
          customerPhone: stored.customerPhone,
          amount: stored.amount,
          items: stored.items ? JSON.parse(stored.items) : [],
          shippingAddress: {
            street: stored.street || "",
            number: stored.streetNumber || "",
            complement: stored.complement,
            district: stored.district || "",
            city: stored.city || "",
            state: stored.state || "",
            zip_code: stored.zipCode,
          },
          shippingMethod: stored.shippingMethod || "",
          estimatedDelivery: "",
        };

        const emailSent = await sendPaymentFailedEmail(checkoutData);
        console.log(
          `📧 Email de falha ${emailSent ? "enviado" : "não enviado"} para ${checkoutData.customerEmail}`,
        );
      }

      return NextResponse.json(
        { received: true, status: "failed" },
        { status: 200 },
      );
    }

    console.log(`⏳ Status: ${data.status}`);

    return NextResponse.json(
      { received: true, status: data.status },
      { status: 200 },
    );
  } catch (error) {
    console.error("Webhook Error:", error);

    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 },
    );
  }
}

// Endpoint para verificar status de transação
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get("id");

    if (!transactionId) {
      return NextResponse.json(
        { error: "ID da transação não fornecido" },
        { status: 400 },
      );
    }

    const transaction = await prisma.transaction.findUnique({
      where: { transactionId },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 },
      );
    }

    // Formatar response para compatibilidade com código existente
    const response = {
      transactionId: transaction.transactionId,
      amount: transaction.amount,
      status: transaction.status,
      paymentDate: transaction.paymentDate.toISOString(),
      checkoutData: {
        transactionId: transaction.transactionId,
        customerName: transaction.customerName,
        customerEmail: transaction.customerEmail,
        customerCpf: transaction.customerCpf,
        customerPhone: transaction.customerPhone,
        amount: transaction.amount,
        items: transaction.items ? JSON.parse(transaction.items) : [],
        shippingAddress: {
          street: transaction.street || "",
          number: transaction.streetNumber || "",
          complement: transaction.complement,
          district: transaction.district || "",
          city: transaction.city || "",
          state: transaction.state || "",
          zip_code: transaction.zipCode,
        },
        shippingMethod: transaction.shippingMethod,
        estimatedDelivery: "",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET Error:", error);

    return NextResponse.json(
      { error: "Erro ao buscar transação" },
      { status: 500 },
    );
  }
}
