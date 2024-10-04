export const OrderStatus = {
  paid: 'Pago',
  waiting_payment: 'Aguardando Pagamento',
  refused: 'Pagamento Recusado',
  refunded: 'Reembolsado',
  chargedback: 'Chargeback'
} as const;
