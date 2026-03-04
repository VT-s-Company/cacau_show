"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import * as XLSX from "xlsx";

interface Transaction {
  transactionId: string;
  amount: number;
  status: string;
  paymentDate: string;
  customerName: string;
  customerEmail: string;
  address: string;
  shippingMethod: string;
  checkoutData?: {
    customerName: string;
    customerEmail: string;
    customerCpf?: string;
    customerPhone?: string;
    shippingAddress: {
      street: string;
      number: string;
      complement?: string;
      district: string;
      city: string;
      state: string;
      zip_code?: string;
    };
    items: Array<{
      title: string;
      quantity: number;
      unitPrice: number;
    }>;
  };
}

interface DashboardPageProps {
  params: {
    hash: string;
  };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth();
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth");
      if (!response.ok) {
        router.push(`/admin/${params.hash}/login`);
      }
    } catch {
      router.push(`/admin/${params.hash}/login`);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/transactions");

      if (!response.ok) {
        throw new Error("Erro ao carregar transações");
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      setError("Erro ao carregar transações");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push(`/admin/${params.hash}/login`);
    } catch {
      router.push(`/admin/${params.hash}/login`);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === transactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map((t) => t.transactionId)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;

    const confirmed = confirm(
      `Tem certeza que deseja deletar ${selectedIds.size} transação(ões)?`,
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/admin/transactions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar transações");
      }

      setSelectedIds(new Set());
      await loadTransactions();
    } catch (err) {
      alert("Erro ao deletar transações");
      console.error(err);
    }
  };

  const handleExportExcel = () => {
    if (transactions.length === 0) {
      alert("Nenhuma transação para exportar");
      return;
    }

    // Preparar dados para exportação
    const exportData = transactions.map((t) => ({
      "ID Transação": t.transactionId,
      Status: t.status,
      "Data/Hora": new Date(t.paymentDate).toLocaleString("pt-BR"),
      "Nome Cliente": t.checkoutData?.customerName || "N/A",
      Email: t.checkoutData?.customerEmail || "N/A",
      CPF: t.checkoutData?.customerCpf || "N/A",
      Telefone: t.checkoutData?.customerPhone || "N/A",
      Valor: `R$ ${(t.amount / 100).toFixed(2)}`,
      CEP: t.checkoutData?.shippingAddress?.zip_code || "N/A",
      Rua: t.checkoutData?.shippingAddress?.street || "N/A",
      Número: t.checkoutData?.shippingAddress?.number || "N/A",
      Complemento: t.checkoutData?.shippingAddress?.complement || "",
      Bairro: t.checkoutData?.shippingAddress?.district || "N/A",
      Cidade: t.checkoutData?.shippingAddress?.city || "N/A",
      Estado: t.checkoutData?.shippingAddress?.state || "N/A",
      Itens:
        t.checkoutData?.items
          ?.map((item) => `${item.quantity}x ${item.title}`)
          .join(", ") || "N/A",
    }));

    // Criar planilha
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transações");

    // Exportar arquivo
    const fileName = `transacoes_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { color: string; icon: React.ReactNode; label: string }
    > = {
      PAID: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Pago",
      },
      CONFIRMED: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Confirmado",
      },
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="w-4 h-4" />,
        label: "Pendente",
      },
      REFUSED: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="w-4 h-4" />,
        label: "Recusado",
      },
      FAILED: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="w-4 h-4" />,
        label: "Falhou",
      },
    };

    const statusInfo = statusMap[status] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <Clock className="w-4 h-4" />,
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
      >
        {statusInfo.icon}
        {statusInfo.label}
      </span>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Administrativo
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Cacau Show - Gerenciamento de Transações
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total de Transações</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {transactions.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Pagas</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {
                transactions.filter((t) =>
                  ["PAID", "CONFIRMED"].includes(t.status),
                ).length
              }
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Pendentes</div>
            <div className="text-2xl font-bold text-yellow-600 mt-1">
              {transactions.filter((t) => t.status === "PENDING").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Recusadas</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {
                transactions.filter((t) =>
                  ["REFUSED", "FAILED"].includes(t.status),
                ).length
              }
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadTransactions}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar Excel
            </button>
            <button
              onClick={handleDelete}
              disabled={selectedIds.size === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Deletar Selecionados ({selectedIds.size})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Carregando transações...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhuma transação encontrada
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.size > 0 &&
                          selectedIds.size === transactions.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Transação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPF
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CEP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endereço
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.transactionId}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(transaction.transactionId)}
                          onChange={() =>
                            handleSelectOne(transaction.transactionId)
                          }
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {transaction.transactionId.slice(0, 12)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.checkoutData?.customerName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.checkoutData?.customerEmail || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.checkoutData?.customerCpf || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.checkoutData?.shippingAddress?.zip_code ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.paymentDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {transaction.checkoutData?.shippingAddress
                          ? `${transaction.checkoutData.shippingAddress.street}, ${transaction.checkoutData.shippingAddress.number} - ${transaction.checkoutData.shippingAddress.city}/${transaction.checkoutData.shippingAddress.state}`
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
