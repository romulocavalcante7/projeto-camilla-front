//@ts-nocheck
'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Heading } from '@/components/ui/heading';
import { Order } from '@/services/types/entities';
import { Subscription } from '@/services/userService';
interface OrdersTableProps {
  orders: Order[];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  const [activeTab, setActiveTab] = useState<'pedidos' | 'assinaturas'>(
    'pedidos'
  );

  return (
    <div className="mt-8">
      <Heading
        title="Pedidos e Assinaturas"
        description="Visualize os pedidos e assinaturas deste usuário"
      />

      <div className="mt-4 flex space-x-4 border-b border-gray-200 dark:border-gray-800 ">
        <Tab
          label="Pedidos"
          isActive={activeTab === 'pedidos'}
          onClick={() => setActiveTab('pedidos')}
        />
        <Tab
          label="Assinaturas"
          isActive={activeTab === 'assinaturas'}
          onClick={() => setActiveTab('assinaturas')}
        />
      </div>

      <div className="mt-4">
        {activeTab === 'pedidos' ? (
          <PedidosTable orders={orders} />
        ) : (
          <AssinaturasTable orders={orders} />
        )}
      </div>
    </div>
  );
};

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );
};

interface PedidosTableProps {
  orders: Order[];
}

const PedidosTable: React.FC<PedidosTableProps> = ({ orders }) => {
  return (
    <div className="overflow-x-auto">
      <table className="mt-4 min-w-full divide-y divide-gray-200 dark:divide-gray-500">
        <thead className="bg-gray-50 dark:bg-zinc-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Referência do Pedido
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Tipo de Produto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Método de Pagamento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Cartão
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Data de Criação
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Data de Aprovação
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Reembolsado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-500 dark:bg-zinc-900">
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={12}
                className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500"
              >
                Nenhum pedido encontrado.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                {/* Referência do Pedido */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {order.orderRef}
                </td>

                {/* Status */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.orderStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : order.orderStatus === 'waiting_payment'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.orderStatus === 'refused'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {formatOrderStatus(order.orderStatus)}
                  </span>
                </td>

                {/* Tipo de Produto */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {capitalizeFirstLetter(order.product.name)}
                </td>

                {/* Método de Pagamento */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {capitalizeFirstLetter(order.paymentMethod)}
                </td>

                {/* Cartão */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {capitalizeFirstLetter(order.cardType)} ****{' '}
                  {order.cardLast4Digits}
                </td>

                {/* Data de Criação */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                </td>

                {/* Data de Aprovação */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {order.approvedDate
                    ? format(new Date(order.approvedDate), 'dd/MM/yyyy HH:mm')
                    : '---'}
                </td>

                {/* Reembolsado */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {order.refundedAt
                    ? format(new Date(order.refundedAt), 'dd/MM/yyyy HH:mm')
                    : '---'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

interface AssinaturasTableProps {
  orders: Order[];
}

const AssinaturasTable: React.FC<AssinaturasTableProps> = ({ orders }) => {
  // Extrair assinaturas únicas das ordens
  const assinaturas: Subscription[] = orders
    .map((order) => order.subscription)
    .filter(
      (subscription, index, self) =>
        subscription &&
        self.findIndex((s) => s.id === subscription.id) === index
    ) as Subscription[];

  return (
    <div className="overflow-x-auto">
      <table className="mt-4 min-w-full divide-y divide-gray-200 dark:divide-gray-500">
        <thead className="bg-gray-50 dark:bg-zinc-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              ID da Assinatura
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500  dark:text-gray-100">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Data de Início
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Próximo Pagamento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Plano
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Data de Criação
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100">
              Data de Atualização
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-500 dark:bg-zinc-900">
          {assinaturas.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500"
              >
                Nenhuma assinatura encontrada.
              </td>
            </tr>
          ) : (
            assinaturas.map((subscription) => (
              <tr key={subscription.id}>
                {/* ID da Assinatura */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {subscription.id}
                </td>

                {/* Status */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      subscription.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : subscription.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {capitalizeFirstLetter(
                      subscription.status === 'active' ? 'Ativo' : 'Inativo'
                    )}
                  </span>
                </td>

                {/* Data de Início */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {format(new Date(subscription.startDate), 'dd/MM/yyyy HH:mm')}
                </td>

                {/* Próximo Pagamento */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {format(
                    new Date(subscription.nextPayment),
                    'dd/MM/yyyy HH:mm'
                  )}
                </td>

                {/* Plano */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {subscription.plan.name}
                </td>

                {/* Data de Criação */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {format(new Date(subscription.createdAt), 'dd/MM/yyyy HH:mm')}
                </td>

                {/* Data de Atualização */}
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {format(new Date(subscription.updatedAt), 'dd/MM/yyyy HH:mm')}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const formatOrderStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    paid: 'Pago',
    waiting_payment: 'Aguardando Pagamento',
    refused: 'Pagamento Recusado',
    refunded: 'Reembolsado',
    chargedback: 'Chargeback',
    refund_requested: 'Solicitação de Reembolso',
    canceled: 'Cancelado',
    active: 'Ativa',
    inactive: 'Inativa'
  };

  return statusMap[status] || capitalizeFirstLetter(status);
};

const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
};

export default OrdersTable;
