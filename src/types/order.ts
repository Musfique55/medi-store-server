import {
  DeliveryMethods,
  PaymentStatus,
  Prisma,
} from "../generated/prisma/client";

export type OrderItemInput = {
  catalog_id: string;
  catalog_name: string;
  quantity: number;
  unit_price: number;
};

export type CreateOrderInput = {
  customer_id: string;
  order_number: string;
  shipping_address: string;
  tax: number;
  delivery_method: DeliveryMethods;
  payment_status: PaymentStatus;
  total_amount: number | Prisma.Decimal;
  subtotal: number | Prisma.Decimal;
  order_items: OrderItemInput[];
};
