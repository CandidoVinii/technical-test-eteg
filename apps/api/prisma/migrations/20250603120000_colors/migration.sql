-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "hex" VARCHAR(7) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Color_hex_key" ON "Color"("hex");

-- Seed arco-íris (ids 1–7 via SERIAL / nextval)
INSERT INTO "Color" ("label", "hex") VALUES
    ('Vermelho', '#EF4444'),
    ('Laranja', '#F97316'),
    ('Amarelo', '#EAB308'),
    ('Verde', '#22C55E'),
    ('Azul', '#3B82F6'),
    ('Anil', '#6366F1'),
    ('Violeta', '#A855F7');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN "colorId" INTEGER;

UPDATE "Client" SET "colorId" = 1 WHERE "colorId" IS NULL;

ALTER TABLE "Client" DROP COLUMN "color",
DROP COLUMN "note";

ALTER TABLE "Client" ALTER COLUMN "colorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
