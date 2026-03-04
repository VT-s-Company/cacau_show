import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.FREEPAY_BASE_URL ?? "https://api.freepaybrasil.com";
const publicKey = process.env.FREEPAY_PUBLIC_KEY ?? "";
const secretKey = process.env.FREEPAY_SECRET_KEY ?? "";

function getBasicAuth() {
  const credentials = `${publicKey}:${secretKey}`;
  return Buffer.from(credentials).toString("base64");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Log para debug
    console.log("=== FreePay Request ===");
    console.log("URL:", `${baseUrl}/v1/payment-transaction/create`);
    console.log("Body:", JSON.stringify(body, null, 2));

    const response = await fetch(`${baseUrl}/v1/payment-transaction/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${getBasicAuth()}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();

    console.log("=== FreePay Response ===");
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("FreePay ERROR:", data);

      return NextResponse.json(
        {
          error: data?.message || "Erro ao criar transação PIX",
          details: data,
          status: response.status,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Payment API Error:", error);

    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 },
    );
  }
}
