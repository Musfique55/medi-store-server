import {Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateOrderInput } from "../../types/order";

const newOrder = async (data : CreateOrderInput) => {
    try {
        const ordered = await prisma.order.create({
            data : {
                customer_id : data.customer_id,
                total_amount : new Prisma.Decimal(data.total_amount),
                shipping_address : data.shipping_address,
                delivery_method : data.delivery_method || "Cash on Delivery",
                order_items : {
                    create : data.order_items.map(item => ({
                        product_id : item.product_id,
                        quantity : item.quantity,
                        unit_price : new Prisma.Decimal(item.unit_price),
                    })),
                }
            },
            include : {
                order_items : true
            }
        })

        return ordered;
    } catch (error) {
        throw error;
    }
}

export const orderServices = {
    newOrder
}