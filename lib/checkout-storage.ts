/**
 * Hook e utilitários para gerenciar dados de checkout e transações
 */

export interface CheckoutData {
  transactionId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerCpf?: string;
  customerPhone?: string;
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
  paymentDate: string;
}

/**
 * Armazena dados de checkout em localStorage
 */
export function storeCheckoutData(data: CheckoutData) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("lastCheckoutData", JSON.stringify(data));
      localStorage.setItem("lastCheckoutTime", new Date().toISOString());
    }
  } catch (error) {
    console.error("Erro ao armazenar dados de checkout:", error);
  }
}

/**
 * Recupera dados de checkout do localStorage
 */
export function getStoredCheckoutData(): CheckoutData | null {
  try {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("lastCheckoutData");
      if (data) {
        return JSON.parse(data);
      }
    }
  } catch (error) {
    console.error("Erro ao recuperar dados de checkout:", error);
  }
  return null;
}

/**
 * Limpa dados de checkout armazenados
 */
export function clearStoredCheckoutData() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("lastCheckoutData");
      localStorage.removeItem("lastCheckoutTime");
    }
  } catch (error) {
    console.error("Erro ao limpar dados de checkout:", error);
  }
}

/**
 * Converte dados do PixCheckout para CheckoutData
 */
export function convertPixCheckoutToCheckoutData(
  transactionId: string,
  fullName: string,
  userEmail: string,
  userCpf: string,
  userPhone: string,
  items: Array<{ title: string; unit_price: number; quantity: number }>,
  shippingAddress: {
    street: string;
    street_number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code?: string;
  },
  shippingMethod: string,
  amount: number,
): CheckoutData {
  return {
    transactionId,
    amount,
    customerName: fullName,
    customerEmail: userEmail,
    customerCpf: userCpf,
    customerPhone: userPhone,
    items: items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.unit_price,
    })),
    shippingAddress: {
      street: shippingAddress.street,
      number: shippingAddress.street_number,
      complement: shippingAddress.complement,
      district: shippingAddress.neighborhood,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip_code: shippingAddress.zip_code,
    },
    shippingMethod,
    paymentDate: new Date().toISOString(),
  };
}
