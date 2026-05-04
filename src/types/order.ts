import {
  DeliveryMethods,
  PaymentStatus,
  Prisma,
} from "../generated/prisma/client";

export type OrderItemInput = {
  product_id: string;
  quantity: number;
  unit_price: number | Prisma.Decimal;
};

export type CreateOrderInput = {
  customer_id: string;
  order_number: string;
  shipping_address: string;
  delivery_method: DeliveryMethods;
  payment_status: PaymentStatus;
  total_amount: number | Prisma.Decimal;
  subtotal: number | Prisma.Decimal;
  order_items: OrderItemInput[];
};
