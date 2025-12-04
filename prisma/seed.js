import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: "founder@acmesolar.com" },
    update: {},
    create: {
      email: "founder@acmesolar.com",
      name: "Founder Demo",
    },
  });

  const company = await prisma.companyProfile.upsert({
    where: { cnpj: "12.345.678/0001-90" },
    update: {
      ownerId: demoUser.id,
      name: "Acme Solar",
    },
    create: {
      name: "Acme Solar",
      cnpj: "12.345.678/0001-90",
      industry: "Energia Solar",
      contactEmail: "contato@acmesolar.com",
      contactPhone: "+55 11 4002-8922",
      ownerId: demoUser.id,
    },
  });

  const opportunity = await prisma.opportunity.create({
    data: {
      title: "Usina fotovoltaica 75kWp",
      description: "Proposta inicial para cliente corporativo.",
      status: "IN_PROGRESS",
      estimatedValue: new Prisma.Decimal("250000.00"),
      ownerId: demoUser.id,
      companyId: company.id,
    },
  });

  await prisma.creditPurchase.create({
    data: {
      creditAmount: 500,
      totalValue: new Prisma.Decimal("15000.00"),
      currency: "BRL",
      companyId: company.id,
      buyerId: demoUser.id,
      opportunityId: opportunity.id,
    },
  });
}

main()
  .catch((e) => {
    console.error("Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
