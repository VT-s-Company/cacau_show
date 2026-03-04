// Tipos para a API FreePay Brasil
export interface FreePayItemRequest {
  title: string;
  unit_price: number; // em centavos
  quantity: number;
  tangible: boolean;
  external_ref?: string;
}

export interface FreePayShippingAddress {
  street: string;
  street_number: string;
  complement?: string;
  zip_code: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

export interface FreePayShipping {
  fee: number; // em centavos
  address: FreePayShippingAddress;
}

export interface CreatePixTransactionRequest {
  amount: number; // em centavos
  payment_method: "pix";
  customer: {
    name: string;
    email: string;
    document: {
      type: "cpf" | "cnpj";
      number: string;
    };
    phone: string;
  };
  items: FreePayItemRequest[];
  shipping: FreePayShipping;
  pix?: {
    expires_in_days?: number;
  };
  metadata: Record<string, string>;
  ip?: string;
  installments?: number;
  postback_url: string;
}

export interface FreePayPixObject {
  qr_code: string;
  qr_code_base64: string;
  expiration_date: string;
  expires_at?: string;
}

export interface CreatePixTransactionResponse {
  id: string;
  status: string;
  amount: number;
  payment_method: string;
  pix: FreePayPixObject | FreePayPixObject[];
  created_at: string;
  updated_at: string;
  data?: {
    pix: FreePayPixObject[];
  };
}
