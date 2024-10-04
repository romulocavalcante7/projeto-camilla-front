import { Subscription } from '@/services/userService';

export interface Attachment {
  id: string;
  filename: string;
  filetype: string;
  filesize: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export enum PaymentStatusEnum {
  Paid = 'paid',
  WaitingPayment = 'waiting_payment',
  Refused = 'refused',
  Refunded = 'refunded',
  Chargeback = 'chargedback'
}

export interface Order {
  id: string;
  orderRef: string;
  orderStatus: string;
  productType: string;
  paymentMethod: string;
  storeId: string;
  paymentMerchantId: string;
  installments: number;
  cardType: string;
  cardLast4Digits: string;
  cardRejectionReason: string | null;
  boletoURL: string | null;
  boletoBarcode: string | null;
  boletoExpiryDate: string | null;
  pixCode: string | null;
  pixExpiration: string | null;
  saleType: string;
  createdAt: string;
  updatedAt: string;
  approvedDate: string;
  refundedAt: string | null;
  webhookEventType: string;
  productId: string;
  customerId: string;
  commissionId: string;
  subscriptionId: string;
  accessURL: string | null;
  userId: string;
  subscription: Subscription;
  product: Product;
  customer: Customer;
  commission: Commission;
}

export interface Product {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  mobile: string;
  cpf: string;
  ip: string;
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  chargeAmount: number;
  productBasePrice: number;
  kiwifyFee: number;
  currency: string;
  myCommission: number;
  fundsStatus: string;
  estimatedDepositDate: string | null;
  depositDate: string | null;
  createdAt: string;
  updatedAt: string;
}
