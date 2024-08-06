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
