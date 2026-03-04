"use client";

import { useEffect, useState, useTransition } from "react";
import { CheckCircle2, Package, Clock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PaymentSuccessData {
  transactionId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  items: Array<{
    title: string;
    quantity: number;
  }>;
  estimatedDelivery: string;
}

export default function PaymentSuccessPage() {
  const [successData, setSuccessData] = useState<PaymentSuccessData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Tentar recuperar dados da URL ou localStorage
    const params = new URLSearchParams(globalThis.location.search);
    const transactionId = params.get("id");

    if (transactionId) {
      // Verificar status da transação
      fetch(`/api/webhook/freepay?id=${transactionId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Transaction data:", data);
          startTransition(() => setSuccessData(data));
        })
        .catch((err) => console.error("Erro ao buscar dados:", err))
        .finally(() => setLoading(false));
    } else {
      // Recuperar do localStorage
      const stored = globalThis.localStorage?.getItem("lastTransaction");
      if (stored) {
        startTransition(() => {
          setSuccessData(JSON.parse(stored));
          setLoading(false);
        });
      } else {
        startTransition(() => setLoading(false));
      }
    }
  }, [startTransition]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const calculateDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000);
    return deliveryDate.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#8B4513] to-[#D2691E]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header com checkmark */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse"></div>
              <div className="relative bg-green-500 rounded-full p-4">
                <CheckCircle2 size={48} className="text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Pagamento Confirmado! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            Seu pedido foi recebido com sucesso
          </p>
        </div>

        {/* Card de resumo */}
        <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-lg space-y-6">
          {/* Informações da transação */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-muted-foreground">ID do Pedido</span>
              <span className="font-mono font-semibold text-foreground">
                {successData?.transactionId || "Carregando..."}
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-muted-foreground">Total Pago</span>
              <span className="text-3xl font-bold text-[#2d9b3a]">
                {successData
                  ? formatCurrency(successData.amount)
                  : "Carregando..."}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cliente</span>
              <span className="font-semibold text-foreground">
                {successData?.customerName || "..."}
              </span>
            </div>
          </div>

          {/* Divisor */}
          <div className="h-px bg-border"></div>

          {/* Itens do pedido */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Itens do Pedido</h3>
            {successData?.items && successData.items.length > 0 ? (
              <div className="space-y-2">
                {successData.items.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between text-sm bg-muted p-3 rounded-lg"
                  >
                    <span className="text-foreground">{item.title}</span>
                    <span className="text-muted-foreground">
                      Qtd: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Carregando itens...
              </p>
            )}
          </div>
        </div>

        {/* Cards de info com ícones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Email enviado */}
          <div className="bg-white rounded-xl border-2 border-border p-6 text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Mail className="text-blue-600" size={24} />
              </div>
            </div>
            <h4 className="font-semibold text-foreground">Email Enviado</h4>
            <p className="text-xs text-muted-foreground">
              {successData?.customerEmail || "seu email"}
            </p>
          </div>

          {/* Prazo de entrega */}
          <div className="bg-white rounded-xl border-2 border-border p-6 text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="text-orange-600" size={24} />
              </div>
            </div>
            <h4 className="font-semibold text-foreground">Até 8 dias úteis</h4>
            <p className="text-xs text-muted-foreground">Entrega estimada</p>
          </div>

          {/* Rastreamento */}
          <div className="bg-white rounded-xl border-2 border-border p-6 text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="text-green-600" size={24} />
              </div>
            </div>
            <h4 className="font-semibold text-foreground">Rastreamento</h4>
            <p className="text-xs text-muted-foreground">
              Você receberá por email
            </p>
          </div>
        </div>

        {/* Timeline de próximos passos */}
        <div className="bg-white rounded-2xl border-2 border-border p-8 space-y-6">
          <h3 className="text-xl font-bold text-foreground">Próximas Etapas</h3>

          <div className="space-y-4">
            {/* Passo 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="bg-[#8B4513] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="w-px h-12 bg-border mt-2"></div>
              </div>
              <div className="pb-8">
                <h4 className="font-semibold text-foreground">
                  Confirmação Enviada
                </h4>
                <p className="text-sm text-muted-foreground">
                  Verifique seu email para confirmar os dados da compra
                </p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="bg-[#8B4513] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="w-px h-12 bg-border mt-2"></div>
              </div>
              <div className="pb-8">
                <h4 className="font-semibold text-foreground">
                  Preparação do Pedido
                </h4>
                <p className="text-sm text-muted-foreground">
                  Seu produto será preparado com cuidado
                </p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="bg-[#8B4513] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="w-px h-12 bg-border mt-2"></div>
              </div>
              <div className="pb-8">
                <h4 className="font-semibold text-foreground">
                  Envio em Trânsito
                </h4>
                <p className="text-sm text-muted-foreground">
                  Você receberá código de rastreamento
                </p>
              </div>
            </div>

            {/* Passo 4 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="bg-[#2d9b3a] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  4
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  Entrega na Sua Casa
                </h4>
                <p className="text-sm text-muted-foreground">
                  Estimado para{" "}
                  <span className="font-semibold">
                    {calculateDeliveryDate()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="https://www.ofertinhas.site"
            className="flex-1 bg-[#8B4513] hover:bg-[#6b3410] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Voltar à Loja
            <ArrowRight size={20} />
          </Link>
          <button
            onClick={() => globalThis.print?.()}
            className="flex-1 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/5 font-bold py-4 rounded-xl transition-colors"
          >
            Imprimir Recibo
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            Qualquer dúvida sobre seu pedido, entre em contato com nosso suporte
          </p>
          <p>📧 contato@cacaushow.com.br</p>
        </div>
      </div>
    </div>
  );
}
