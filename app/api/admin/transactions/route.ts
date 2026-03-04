import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/admin-config";
import { prisma } from "@/lib/prisma";

type Transaction = {
  id: string;
  transactionId: string;
  amount: number;
  status: string;
  paymentDate: Date;
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerPhone: string;
  street: string;
  streetNumber: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  shippingMethod: string;
  items: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Middleware de autenticação
function isAuthenticated(req: NextRequest): boolean {
  const sessionToken = req.cookies.get(AUTH_COOKIE_NAME);
  return !!sessionToken;
}

// GET - Listar todas as transações
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // Buscar todas as transações do banco
    const dbTransactions = await prisma.transaction.findMany({
      orderBy: {
        paymentDate: "desc",
      },
    });

    // Formatar para compatibilidade com dashboard
    const transactions = dbTransactions.map((transaction: Transaction) => ({
      transactionId: transaction.transactionId,
      amount: transaction.amount,
      status: transaction.status,
      paymentDate: transaction.paymentDate.toISOString(),
      checkoutData: {
        customerName: transaction.customerName,
        customerEmail: transaction.customerEmail,
        customerCpf: transaction.customerCpf,
        customerPhone: transaction.customerPhone,
        shippingAddress: {
          street: transaction.street,
          number: transaction.streetNumber,
          complement: transaction.complement,
          district: transaction.district,
          city: transaction.city,
          state: transaction.state,
          zip_code: transaction.zipCode,
        },
        shippingMethod: transaction.shippingMethod,
        items: transaction.items ? JSON.parse(transaction.items) : [],
      },
    }));

    return NextResponse.json({
      success: true,
      total: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Erro ao listar transações:", error);
    return NextResponse.json(
      { error: "Erro ao listar transações" },
      { status: 500 },
    );
  }
}

// DELETE - Deletar transação(ões)
export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: "IDs inválidos. Envie um array de IDs." },
        { status: 400 },
      );
    }

    // Deletar do banco de dados
    const result = await prisma.transaction.deleteMany({
      where: {
        transactionId: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} transação(ões) deletada(s)`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Erro ao deletar transações:", error);
    return NextResponse.json(
      { error: "Erro ao deletar transações" },
      { status: 500 },
    );
  }
}

// POST - Adicionar transação manualmente (para testes)
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!data.transactionId) {
      return NextResponse.json(
        { error: "transactionId é obrigatório" },
        { status: 400 },
      );
    }

    // Criar transação no banco de dados
    await prisma.transaction.create({
      data: {
        transactionId: data.transactionId,
        amount: data.amount || 0,
        status: data.status || "PENDING",
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
        customerName:
          data.checkoutData?.customerName || data.customerName || "",
        customerEmail:
          data.checkoutData?.customerEmail || data.customerEmail || "",
        customerCpf: data.checkoutData?.customerCpf || data.customerCpf || "",
        customerPhone:
          data.checkoutData?.customerPhone || data.customerPhone || "",
        street: data.checkoutData?.shippingAddress?.street || data.street || "",
        streetNumber:
          data.checkoutData?.shippingAddress?.number || data.streetNumber || "",
        complement:
          data.checkoutData?.shippingAddress?.complement ||
          data.complement ||
          "",
        district:
          data.checkoutData?.shippingAddress?.district || data.district || "",
        city: data.checkoutData?.shippingAddress?.city || data.city || "",
        state: data.checkoutData?.shippingAddress?.state || data.state || "",
        zipCode:
          data.checkoutData?.shippingAddress?.zip_code || data.zipCode || "",
        shippingMethod:
          data.checkoutData?.shippingMethod || data.shippingMethod || "",
        items: data.checkoutData?.items
          ? JSON.stringify(data.checkoutData.items)
          : data.items || "[]",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Transação adicionada",
    });
  } catch (error) {
    console.error("Erro ao adicionar transação:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar transação" },
      { status: 500 },
    );
  }
}
