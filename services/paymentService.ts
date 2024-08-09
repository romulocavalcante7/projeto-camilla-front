import Api from './api';

const prefix = 'v1/payment';

export interface PaymentStatus {
  startDate: string;
  nextPayment: string;
  status: string;
  planType: string;
  totalCharges: number;
}

export const getUserPaymentStatus = async (
  userId: string
): Promise<PaymentStatus[]> => {
  const response = await Api.get<PaymentStatus[]>(
    `${prefix}/user/${userId}/payment-status`
  );
  return response.data;
};
