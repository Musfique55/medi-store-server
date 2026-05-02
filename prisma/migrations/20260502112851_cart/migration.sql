-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItems" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "CartItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
