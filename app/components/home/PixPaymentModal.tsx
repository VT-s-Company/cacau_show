"use client";

import { Copy, X, CheckCircle2, QrCode } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import PixDisplay from "./PixDisplay";

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixData: {
    qrCode: string;
    qrCodeBase64: string;
    amount: number;
    expiresAt: string;
    transactionId: string;
  } | null;
}

export default function PixPaymentModal({
  isOpen,
  onClose,
  pixData,
}: Readonly<PixPaymentModalProps>) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !pixData) return null;

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatExpiryDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-card border-2 border-border p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={24} />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#2d9b3a]/10 flex items-center justify-center">
              <QrCode size={32} className="text-[#2d9b3a]" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Pagamento PIX
            </h2>
            <p className="text-sm text-muted-foreground">
              Escaneie o QR Code ou copie o código abaixo
            </p>
          </div>

          {/* Valor */}
          <div className="text-center p-4 rounded-xl bg-muted">
            <p className="text-sm text-muted-foreground mb-1">Valor a pagar</p>
            <p className="text-3xl font-bold text-[#2d9b3a]">
              {formatCurrency(pixData.amount / 100)}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-xl">
              <PixDisplay
                code={pixData.qrCode}
                expiration={pixData.expiresAt}
              />
            </div>
          </div>

          {/* Código Copia e Cola */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Código PIX (Copia e Cola)
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={pixData.qrCode}
                readOnly
                className="flex-1 rounded-xl border-2 border-border px-4 py-3 bg-muted text-sm text-foreground font-mono"
              />
              <button
                onClick={handleCopyPixCode}
                className="px-4 py-3 rounded-xl bg-[#2d9b3a] text-white font-semibold hover:bg-[#258530] transition-colors flex items-center gap-2 shrink-0"
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={18} />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ID da Transação</span>
              <span className="text-foreground font-mono text-xs">
                {pixData.transactionId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Validade</span>
              <span className="text-foreground">
                {formatExpiryDate(pixData.expiresAt)}
              </span>
            </div>
          </div>

          {/* Instruções */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              <strong>Como pagar:</strong> Abra o app do seu banco, escolha
              pagar com PIX, escaneie o QR Code ou cole o código. O pagamento
              será confirmado automaticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
