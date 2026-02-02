import { Prisma } from "../generated/prisma/client";

type OrderItemInput = {
  product_id: string;
  quantity: number;
  unit_price: number | Prisma.Decimal;
};

export type CreateOrderInput = {
  customer_id: string;
  shipping_address: string;
  delivery_method?: string;
  total_amount: number | Prisma.Decimal;
  order_items: OrderItemInput[];
};