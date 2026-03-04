"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Product } from "./storeTypes";
import TabletesSelect from "./TabletesSelect";
import { ChevronLeft } from "lucide-react";
import PixPaymentModal from "./PixPaymentModal";
import { createPixTransaction, type FreePayItem } from "@/lib/freepay-api";

interface PixCheckoutProps {
  product: Product;
  onBack: () => void;
  initialSelectedTablets?: boolean[];
}

interface CepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

type ShippingOption = "gratis" | "jadlog" | "pac";

const shippingOptions = [
  { id: "gratis", label: "Frete Grátis", price: 0, time: "7-10 dias úteis" },
  { id: "jadlog", label: "Jadlog", price: 15, time: "3-5 dias úteis" },
  { id: "pac", label: "Correios (PAC)", price: 20, time: "5-7 dias úteis" },
];

function onlyDigits(value: string) {
  return value.replaceAll(/\D/g, "");
}

function calculateShippingAdjustment(cep: string): number {
  const firstDigit = cep.charAt(0);

  // Região Sudeste (SP, RJ, ES, MG) - mais barato
  if (["0", "1", "2", "3"].includes(firstDigit)) {
    return -5;
  }

  // Região Norte, Nordeste, Centro-Oeste - mais caro
  if (["6", "7", "8"].includes(firstDigit)) {
    return 5;
  }

  // Região Sul e nordeste próximo - preço normal
  return 0;
}

function formatCep(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function PixCheckout({
  product,
  onBack,
  initialSelectedTablets = [false, false, false],
}: Readonly<PixCheckoutProps>) {
  const [selectedTablets, setSelectedTablets] = useState<boolean[]>(
    initialSelectedTablets,
  );
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [cepError, setCepError] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [shippingOption, setShippingOption] =
    useState<ShippingOption>("gratis");
  const [shippingAdjustment, setShippingAdjustment] = useState(0);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeBase64: string;
    amount: number;
    expiresAt: string;
    transactionId: string;
  } | null>(null);

  const cepDigits = useMemo(() => onlyDigits(cep), [cep]);

  const tabletsCount = selectedTablets.filter(Boolean).length;
  const tabletsPrice = tabletsCount * 10;
  const baseShippingPrice =
    shippingOptions.find((opt) => opt.id === shippingOption)?.price || 0;
  const shippingPrice = Math.max(0, baseShippingPrice + shippingAdjustment);
  const totalPrice = product.discountPrice + tabletsPrice + shippingPrice;

  const handleTabletChange = (index: number) => {
    const newSelectedTablets = [...selectedTablets];
    newSelectedTablets[index] = !newSelectedTablets[index];
    setSelectedTablets(newSelectedTablets);
  };

  const handleCepBlur = async () => {
    if (cepDigits.length !== 8) {
      setCepError("Digite um CEP válido com 8 números.");
      return;
    }

    setCepLoading(true);
    setCepError("");

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepDigits}/json/`,
      );
      if (!response.ok) {
        throw new Error("Falha ao consultar CEP.");
      }

      const data: CepResponse = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
        setStreet("");
        setDistrict("");
        setCity("");
        setState("");
        return;
      }

      setStreet(data.logradouro ?? "");
      setDistrict(data.bairro ?? "");
      setCity(data.localidade ?? "");
      setState(data.uf ?? "");

      // Calcula o ajuste de frete baseado na região do CEP
      const adjustment = calculateShippingAdjustment(cepDigits);
      setShippingAdjustment(adjustment);
    } catch {
      setCepError("Não foi possível buscar o CEP agora.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleFinishPurchase = async () => {
    if (
      !fullName ||
      !cpf ||
      !phone ||
      !cep ||
      !street ||
      !number ||
      !city ||
      !state
    ) {
      alert("Preencha os dados obrigatórios para finalizar a compra.");
      return;
    }

    setIsGeneratingPix(true);

    try {
      // Preparar items para a API
      const items: FreePayItem[] = [
        {
          title: product.name,
          unit_price: Math.round(product.discountPrice * 100), // converter para centavos
          quantity: 1,
          tangible: true,
        },
      ];

      // Adicionar tabletes selecionados
      const tabletNames = [
        "Tablete Pistache",
        "Tablete Morango",
        "Tablete Leite",
      ];
      selectedTablets.forEach((selected, index) => {
        if (selected) {
          items.push({
            title: tabletNames[index],
            unit_price: 1000, // R$ 10,00 em centavos
            quantity: 1,
            tangible: true,
          });
        }
      });

      // Adicionar frete se houver
      if (shippingPrice > 0) {
        const shippingLabel =
          shippingOptions.find((opt) => opt.id === shippingOption)?.label ||
          "Frete";
        items.push({
          title: shippingLabel,
          unit_price: Math.round(shippingPrice * 100),
          quantity: 1,
          tangible: false,
        });
      }

      // A chave da API deve ser fornecida nas variáveis de ambiente
      const apiKey = process.env.NEXT_PUBLIC_FREEPAY_API_KEY || "";

      if (!apiKey) {
        throw new Error(
          "Chave da API não configurada. Configure NEXT_PUBLIC_FREEPAY_API_KEY",
        );
      }

      const response = await createPixTransaction(
        {
          amount: Math.round(totalPrice * 100), // converter para centavos
          payment_method: "pix",
          postback_url: `${globalThis.location.origin}/api/webhook/freepay`,
          customer: {
            name: fullName,
            email: "cliente@example.com", // Você pode adicionar um campo de email
            document: onlyDigits(cpf),
            phone: onlyDigits(phone),
            address: {
              street,
              number,
              complement: complement || undefined,
              district,
              city,
              state,
              zipcode: cepDigits,
            },
          },
          items,
          pix: {
            expires_in: 3600, // 1 hora
          },
          metadata: {
            provider_name: "Cacau Show - Promoção Páscoa",
          },
        },
        apiKey,
      );

      // Preparar dados para o modal
      setPixData({
        qrCode: response.pix.qr_code,
        qrCodeBase64: response.pix.qr_code_base64,
        amount: response.amount,
        expiresAt: response.pix.expires_at,
        transactionId: response.id,
      });
      setShowPixModal(true);
    } catch (error) {
      console.error("Erro ao gerar PIX:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao gerar pagamento PIX. Tente novamente.",
      );
    } finally {
      setIsGeneratingPix(false);
    }
  };

  return (
    <div className="w-full max-w-6xl px-4 pb-10 pt-4">
      <nav className="mb-6 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-foreground transition-colors"
        >
          <ChevronLeft className="inline-block mr-1" size={16} />
          Voltar ao produto
        </button>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-serif italic text-foreground mb-5">
        Finalizar Compra
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <section className="space-y-5">
          {/* CARD DO PRODUTO */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-muted p-2">
              <Image
                src={`/assets${product.image}`}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-32 object-contain"
              />
            </div>
            <div className="p-3 space-y-2">
              <h3 className="text-sm font-bold text-foreground">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              <p className="text-xs text-muted-foreground">{product.weight}</p>
              <p className="text-sm font-bold text-accent">
                R$ {product.discountPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* DADOS PESSOAIS */}
          <div className="rounded-2xl border-2 border-border bg-card p-5 md:p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              Dados Pessoais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="checkout-fullname"
                  className="text-sm font-medium text-foreground"
                >
                  Nome completo
                </label>
                <input
                  id="checkout-fullname"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-border px-4 py-3 bg-background"
                  placeholder="Digite seu nome"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-cpf"
                  className="text-sm font-medium text-foreground"
                >
                  CPF
                </label>
                <input
                  id="checkout-cpf"
                  value={cpf}
                  onChange={(event) => setCpf(event.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-border px-4 py-3 bg-background"
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="text-sm font-medium text-foreground"
                >
                  Telefone
                </label>
                <input
                  id="checkout-phone"
                  value={phone}
                  onChange={(event) => {
                    setPhone(formatPhone(event.target.value));
                  }}
                  className="mt-1 w-full rounded-xl border-2 border-border px-4 py-3 bg-background"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>

          {/* ENDEREÇO DE ENTREGA */}
          <div className="rounded-2xl border-2 border-border bg-card p-5 md:p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              Endereço de Entrega
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="checkout-cep"
                  className="text-sm font-medium text-foreground"
                >
                  CEP
                </label>
                <input
                  id="checkout-cep"
                  value={cep}
                  onChange={(event) => {
                    setCep(formatCep(event.target.value));
                    if (cepError) setCepError("");
                  }}
                  onBlur={handleCepBlur}
                  className="mt-1 w-full rounded-xl border-2 border-border px-4 py-3 bg-background"
                  placeholder="00000-000"
                />
                {cepLoading && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Consultando CEP...
                  </p>
                )}
                {cepError && (
                  <p className="mt-1 text-xs text-red-500">{cepError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-number"
                  className="text-sm font-medium text-foreground"
                >
                  Número
                </label>
                <input
                  id="checkout-number"
                  value={number}
                  onChange={(event) => setNumber(event.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-border px-4 py-3 bg-background"
                  placeholder="123"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="checkout-street"
                  className="text-sm font-medium text-foreground"
                >
                  Logradouro
                </label>
                <input
                  id="checkout-street"
                  value={street}
                  readOnly
                  className="mt-1 w-full rounded-xl border-2 border-border px-4 py-3 bg-muted text-muted-foreground"
                  placeholder="Preenchido automaticamente pelo CEP"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-district"
                  className="text-sm font-medium text-foreground"
                >
                  Bairro
                </label>
                <input
                  id="checkout-district"
                  value={district}
                  readOnly
                  className="mt-1 w-full rounded-xl border-2 border-border px-4 py-3 bg-muted text-muted-foreground"
                  placeholder="Preenchido automaticamente"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-city-state"
                  className="text-sm font-medium text-foreground"
                >
                  Cidade/UF
                </label>
                <input
                  id="checkout-city-state"
                  value={city && state ? `${city}/${state}` : ""}
                  readOnly
                  className="mt-1 w-full rounded-xl border-2 border-border px-4 py-3 bg-muted text-muted-foreground"
                  placeholder="Preenchido automaticamente"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="checkout-complement"
                  className="text-sm font-medium text-foreground"
                >
                  Complemento
                </label>
                <input
                  id="checkout-complement"
                  value={complement}
                  onChange={(event) => setComplement(event.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-border px-4 py-3 bg-background"
                  placeholder="Apartamento, bloco, referência (opcional)"
                />
              </div>
            </div>
          </div>

          {/* TABLETES */}
          <div className="rounded-2xl border-2 border-border bg-card p-5 md:p-6">
            <TabletesSelect
              selectedTablets={selectedTablets}
              onTabletChange={handleTabletChange}
            />
          </div>

          {/* FRETE */}
          <div className="rounded-2xl border-2 border-border bg-card p-5 md:p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Frete</h2>

            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-border cursor-pointer hover:bg-muted transition-colors"
                  style={{
                    borderColor:
                      shippingOption === option.id
                        ? "var(--accent)"
                        : undefined,
                    backgroundColor:
                      shippingOption === option.id
                        ? "var(--accent)/10"
                        : undefined,
                  }}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={shippingOption === option.id}
                    onChange={(e) =>
                      setShippingOption(e.target.value as ShippingOption)
                    }
                    className="w-4 h-4 accent-accent shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {option.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {option.time}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#2d9b3a]">
                    {option.price === 0
                      ? "Grátis"
                      : `R$ ${Math.max(0, option.price + shippingAdjustment).toFixed(2)}`}
                  </p>
                </label>
              ))}
            </div>
          </div>

          {/* PAGAMENTO */}
          <div className="rounded-2xl border-2 border-border bg-card p-5 md:p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Pagamento</h2>

            <div className="p-4 rounded-xl border-2 border-accent bg-accent/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <span className="text-2xl">💳</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Transferência PIX
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Método de pagamento seguro e instantâneo
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishPurchase}
              disabled={isGeneratingPix}
              className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPix ? "Gerando PIX..." : "Finalizar compra via PIX"}
            </button>
          </div>
        </section>

        {/* RESUMO DO PEDIDO */}
        <aside className="rounded-2xl border-2 border-border bg-card p-5 h-fit space-y-4">
          <p className="text-sm text-muted-foreground">Resumo do pedido</p>

          {/* CARD DO PRODUTO */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-muted p-2">
              <Image
                src={`/assets${product.image}`}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-32 object-contain"
              />
            </div>
            <div className="p-3 space-y-2">
              <h3 className="text-sm font-bold text-foreground">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              <p className="text-xs text-muted-foreground">{product.weight}</p>
              <p className="text-sm font-bold text-accent">
                R$ {product.discountPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* RESUMO DE PREÇOS */}
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Produto</span>
              <span>R$ {product.discountPrice.toFixed(2)}</span>
            </div>

            {tabletsCount > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>
                  {tabletsCount} {tabletsCount === 1 ? "tablete" : "tabletes"}{" "}
                  (+R$ 10,00)
                </span>
                <span>R$ {tabletsPrice.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>Frete</span>
              <span>
                {shippingPrice === 0
                  ? "Grátis"
                  : `R$ ${shippingPrice.toFixed(2)}`}
              </span>
            </div>

            <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground">
              <span>Total</span>
              <span className="text-lg text-accent">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal de Pagamento PIX */}
      <PixPaymentModal
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        pixData={pixData}
      />
    </div>
  );
}
