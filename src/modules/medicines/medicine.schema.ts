import z from "zod";
import { discountType } from "../../generated/prisma/enums";

export const catalogCreateDTO = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    retails_price: z.number().min(0, "Retails price is required"),
    purchase_price: z.number().min(0, "Purchase price is required"),
    image_url: z.array(z.string()).min(1, "Image url is required"),
    stock: z.number().min(0, "Stock is required"),
    discount_type: z
      .nativeEnum(discountType)
      .optional()
      .default(discountType.NONE),
    discount_value: z.number().optional().default(0),
    category_id: z.string().min(1, "Category id is required"),
    manufacturer_id: z.string().min(1, "Manufacturer id is required"),
    seller_id: z.string().min(1, "Seller id is required"),
  })
  .superRefine((data, ctx) => {
    const requiredDiscountType =
      data.discount_type === discountType.FIXED ||
      data.discount_type === discountType.PERCENTAGE;

    if (requiredDiscountType) {
      if (!data.discount_value || data.discount_value === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Discount value must be greater than 0 when discount type is percentage or fixed",
          path: ["discount_value"],
        });
      }
    }
  });

export const catalogUpdateDTO = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  retails_price: z.number().min(0, "Retails price is required"),
  purchase_price: z.number().min(0, "Purchase price is required"),
  image_url: z.string().min(1, "Image url is required"),
  stock: z.number().min(0, "Stock is required"),
  discount_type: z.nativeEnum(discountType),
  discount_value: z.number().optional(),
  category_id: z.string().min(1, "Category id is required"),
  manufacturer_id: z.string().min(1, "Manufacturer id is required"),
  seller_id: z.string().min(1, "Seller id is required"),
});

export type Catalog = z.infer<typeof catalogCreateDTO>;
