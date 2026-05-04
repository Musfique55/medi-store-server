import { z } from "zod";
import { DeliveryMethods, PaymentStatus } from "../../generated/prisma/enums";

const orderItemSchema = z.object({
  customer_id: z.string().min(1),
  payment_status: z.nativeEnum(PaymentStatus),
  delivery_method: z.nativeEnum(DeliveryMethods),
  shipping_address: z.object({
    street_address: z.string().min(1),
    city: z.string().min(1),
    zip_code: z.string().min(1),
    apartment: z.string().optional(),
    special_instruction: z.string().optional(),
    fullName: z.string().min(1),
    email: z.string().min(1),
    phone: z.string().min(1),
  }),
  order_items: z
    .array(
      z.object({
        product_id: z.string().min(1),
        quantity: z.number().min(1),
      }),
    )
    .min(1),
});

export const orderValidator = {
  orderItemSchema,
};
