import { prisma } from "../../lib/prisma";

const getSellersAnalytics = async (userId: string) => {
  try {
    const stats = await prisma.$queryRaw`
    WITH monthly_metrics AS (
        SELECT 
    -- Current Month Accumulators (From the 1st of this month until now)
    COUNT(DISTINCT CASE WHEN o.created_at >= DATE_TRUNC('month',NOW()) THEN p.id END)::int AS curr_products,
    COUNT(DISTINCT CASE WHEN o.created_at >= DATE_TRUNC('month',NOW()) THEN oi.id END)::int AS curr_orders,
    COALESCE(SUM(CASE WHEN o.created_at >= DATE_TRUNC('month',NOW()) THEN oi.quantity * oi.unit_price END),0)::float AS curr_revenue,

    -- Previous month accumulators
    COUNT(DISTINCT CASE WHEN o.created_at >= DATE_TRUNC('month',NOW() - INTERVAL '1 month') AND o.created_at < DATE_TRUNC('month', NOW()) THEN p.id END)::int AS prev_products,
    COUNT(DISTINCT CASE WHEN o.created_at >= DATE_TRUNC('month',NOW() - INTERVAL '1 month') AND o.created_at < DATE_TRUNC('month',NOW()) THEN oi.id END)::int AS prev_orders,
    COALESCE(SUM(CASE WHEN o.created_at >= DATE_TRUNC('month',NOW() - INTERVAL '1 month') AND o.created_at < DATE_TRUNC('month',NOW()) THEN oi.quantity * oi.unit_price END),0)::float AS prev_revenue

  FROM "user" u 
  LEFT JOIN "medicine" p ON p.seller_id = u.id
  LEFT JOIN "order_items" oi ON oi.product_id = p.id
  LEFT JOIN "order" o ON o.id = oi.order_id
  WHERE u.id = ${userId} AND u.role = 'SELLER'
  GROUP BY u.id
    )
    SELECT 
    curr_products AS total_products,
    curr_orders AS total_orders,
    curr_revenue AS total_revenue,

    -- Percentage change calculation
    ROUND(COALESCE
    (((curr_products - prev_products) / NULLIF(prev_products,0)) * 100,0):: numeric,2
    )::float AS product_change_pct,
    ROUND(COALESCE(((curr_orders - prev_orders) / NULLIF(prev_orders,0)) * 100,0)::numeric,2)::float AS order_change_pct,
    ROUND(COALESCE(((curr_revenue - prev_revenue) / NULLIF(prev_revenue,0)) * 100,0)::numeric,2)::float AS revenue_change_pct
  FROM monthly_metrics;
    `;
    return (
      stats[0] || {
        total_products: 0,
        total_orders: 0,
        total_revenue: 0,
        product_change_pct: 0,
        order_change_pct: 0,
        revenue_change_pct: 0,
      }
    );
  } catch (error) {
    throw error;
  }
};

export const analyticsServices = {
  getSellersAnalytics,
};
