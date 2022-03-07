-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(150) NOT NULL,
    "last_name" VARCHAR(150) NOT NULL,
    "contact_number" VARCHAR(15) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "address" VARCHAR(200) NOT NULL,
    "city" VARCHAR(150) NOT NULL,
    "province" VARCHAR(150) NOT NULL,
    "zip_code" INTEGER,
    "position" VARCHAR(150) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "company_name" VARCHAR(200),
    "first_name" VARCHAR(150) NOT NULL,
    "last_name" VARCHAR(150) NOT NULL,
    "contact_number" VARCHAR(15),
    "email" VARCHAR(200),
    "website" VARCHAR(200),
    "address" VARCHAR(200),
    "city" VARCHAR(150) NOT NULL,
    "province" VARCHAR(150) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "bar_code" VARCHAR(200),
    "stocks" INTEGER NOT NULL,
    "price" DECIMAL(12,5) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(200) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDetails" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(150) NOT NULL,
    "unit" VARCHAR(50),
    "num_value" DECIMAL(12,5),
    "text_value" VARCHAR(200),
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "ProductDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "payment_type" VARCHAR(100) NOT NULL,
    "vat" DECIMAL(5,3),
    "discount" DECIMAL(12,5),
    "total_price" DECIMAL(12,5) NOT NULL,
    "amount_due" DECIMAL(12,5) NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderWithProduct" (
    "product_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" DECIMAL(12,5) NOT NULL,

    CONSTRAINT "OrderWithProduct_pkey" PRIMARY KEY ("product_id","order_id")
);

-- CreateTable
CREATE TABLE "Sales" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "date_paid" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "amount_paid" DECIMAL(12,5) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "company_name" VARCHAR(200),
    "first_name" VARCHAR(150) NOT NULL,
    "last_name" VARCHAR(150) NOT NULL,
    "contact_number" VARCHAR(15),
    "email" VARCHAR(200),
    "website" VARCHAR(200),
    "address" VARCHAR(200),
    "city" VARCHAR(150),
    "province" VARCHAR(150),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(12,5) NOT NULL,
    "payment_type" VARCHAR(100) NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurcahseWithProduct" (
    "product_id" INTEGER NOT NULL,
    "purchase_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" DECIMAL(12,5) NOT NULL,

    CONSTRAINT "PurcahseWithProduct_pkey" PRIMARY KEY ("product_id","purchase_id")
);

-- CreateTable
CREATE TABLE "Payables" (
    "id" SERIAL NOT NULL,
    "purchase_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "amount_paid" DECIMAL(12,5) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_employee_id_key" ON "Account"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "Sales_order_id_key" ON "Sales"("order_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDetails" ADD CONSTRAINT "ProductDetails_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderWithProduct" ADD CONSTRAINT "OrderWithProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderWithProduct" ADD CONSTRAINT "OrderWithProduct_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurcahseWithProduct" ADD CONSTRAINT "PurcahseWithProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurcahseWithProduct" ADD CONSTRAINT "PurcahseWithProduct_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payables" ADD CONSTRAINT "Payables_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payables" ADD CONSTRAINT "Payables_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
