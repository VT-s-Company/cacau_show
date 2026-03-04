// Tipos para a API FreePay Brasil
export interface FreePayCustomer {
  name: string;
  email: string;
  document: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zipcode: string;
  };
}

export interface FreePayItem {
  title: string;
  unit_price: number; // em centavos
  quantity: number;
  tangible: boolean;
}

export interface FreePayPixData {
  expires_in?: number; // em segundos, padrão 3600 (1h)
}

export interface CreatePixTransactionRequest {
  amount: number; // em centavos
  payment_method: "pix";
  postback_url: string;
  customer: FreePayCustomer;
  items: FreePayItem[];
  pix?: FreePayPixData;
  metadata: {
    provider_name: string;
  };
  ip?: string;
}

export interface FreePayPixResponse {
  qr_code: string;
  qr_code_base64: string;
  expires_at: string;
}

export interface CreatePixTransactionResponse {
  id: string;
  status: string;
  amount: number;
  payment_method: string;
  pix: FreePayPixResponse;
  created_at: string;
  updated_at: string;
}

// Função para criar transação PIX
export async function createPixTransaction(
  data: CreatePixTransactionRequest,
  apiKey: string,
): Promise<CreatePixTransactionResponse> {
  const response = await fetch(
    "https://api.freepaybrasil.com/v1/payment-transaction/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${btoa(apiKey + ":")}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Erro ao criar transação: ${response.status}`,
    );
  }

  return response.json();
}
