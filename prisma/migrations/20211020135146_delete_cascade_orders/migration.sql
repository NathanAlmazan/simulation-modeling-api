-- DropForeignKey
ALTER TABLE "OrderWithProduct" DROP CONSTRAINT "OrderWithProduct_order_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderWithProduct" DROP CONSTRAINT "OrderWithProduct_product_id_fkey";

-- AddForeignKey
ALTER TABLE "OrderWithProduct" ADD CONSTRAINT "OrderWithProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderWithProduct" ADD CONSTRAINT "OrderWithProduct_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
