import { ActionType } from "@/generated/prisma/enums";
import { z } from "zod";

export const updateInventorySchemaDTO = z.object({
  quantity: z.number().positive(),
  actionType: z.nativeEnum(ActionType),
});

export type IUpdateInventory = z.infer<typeof updateInventorySchemaDTO>;
