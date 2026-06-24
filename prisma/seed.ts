import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Master user
  const masterPassword = await hash("master123", 12);
  const masterUser = await prisma.user.upsert({
    where: { email: "master@yumyland.co.mz" },
    update: {},
    create: {
      email: "master@yumyland.co.mz",
      name: "Admin Master",
      password: masterPassword,
      role: "MASTER",
    },
  });
  console.log("Master user created:", masterUser.email);

  // Create Companies
  const company1 = await prisma.company.upsert({
    where: { slug: "restaurante-tropical" },
    update: {},
    create: {
      name: "Restaurante Tropical",
      ownerName: "Carlos Machel",
      email: "carlos@tropical.co.mz",
      phone: "+258841234567",
      type: "restaurant",
      plan: "professional",
      status: "active",
      slug: "restaurante-tropical",
    },
  });

  const company2 = await prisma.company.upsert({
    where: { slug: "cafe-maputo" },
    update: {},
    create: {
      name: "Cafe Maputo",
      ownerName: "Ana Silva",
      email: "ana@cafemaputo.co.mz",
      phone: "+258851234567",
      type: "cafe",
      plan: "basic",
      status: "active",
      slug: "cafe-maputo",
    },
  });

  const company3 = await prisma.company.upsert({
    where: { slug: "pizza-beira" },
    update: {},
    create: {
      name: "Pizza Beira",
      ownerName: "Joao Fernandes",
      email: "joao@pizzabeira.co.mz",
      phone: "+258861234567",
      type: "pizzeria",
      plan: "premium",
      status: "active",
      slug: "pizza-beira",
    },
  });

  console.log("Companies created:", company1.name, company2.name, company3.name);

  // Create Owner users for companies
  const ownerPassword = await hash("owner123", 12);

  await prisma.user.upsert({
    where: { email: "carlos@tropical.co.mz" },
    update: {},
    create: {
      email: "carlos@tropical.co.mz",
      name: "Carlos Machel",
      password: ownerPassword,
      role: "OWNER",
      companyId: company1.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "ana@cafemaputo.co.mz" },
    update: {},
    create: {
      email: "ana@cafemaputo.co.mz",
      name: "Ana Silva",
      password: ownerPassword,
      role: "OWNER",
      companyId: company2.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "joao@pizzabeira.co.mz" },
    update: {},
    create: {
      email: "joao@pizzabeira.co.mz",
      name: "Joao Fernandes",
      password: ownerPassword,
      role: "OWNER",
      companyId: company3.id,
    },
  });

  console.log("Owner users created");

  // Create Categories for company1
  const cat1 = await prisma.category.create({
    data: {
      name: "Pratos Principais",
      description: "Pratos tradicionais mocambicanos",
      productCount: 3,
      companyId: company1.id,
    },
  });

  const cat2 = await prisma.category.create({
    data: {
      name: "Bebidas",
      description: "Sumos naturais e refrigerantes",
      productCount: 2,
      companyId: company1.id,
    },
  });

  const cat3 = await prisma.category.create({
    data: {
      name: "Sobremesas",
      description: "Doces e sobremesas da casa",
      productCount: 2,
      companyId: company1.id,
    },
  });

  // Create Categories for company2
  const cat4 = await prisma.category.create({
    data: {
      name: "Cafes",
      description: "Cafes especiais e tradicionais",
      productCount: 2,
      companyId: company2.id,
    },
  });

  const cat5 = await prisma.category.create({
    data: {
      name: "Lanches",
      description: "Lanches rapidos e saborosos",
      productCount: 2,
      companyId: company2.id,
    },
  });

  console.log("Categories created");

  // Create Products for company1
  await prisma.product.createMany({
    data: [
      {
        name: "Matapa com Camarao",
        description: "Prato tradicional de folhas de mandioca com camarao fresco",
        price: 850,
        categoryId: cat1.id,
        stock: 20,
        available: true,
        isPromotion: false,
        isCombo: false,
        companyId: company1.id,
      },
      {
        name: "Frango Grelhado com Xima",
        description: "Frango grelhado acompanhado de xima e salada",
        price: 650,
        categoryId: cat1.id,
        stock: 30,
        available: true,
        isPromotion: true,
        promotionPrice: 550,
        isCombo: false,
        companyId: company1.id,
      },
      {
        name: "Caril de Caranguejo",
        description: "Caril de caranguejo com arroz de coco",
        price: 1200,
        categoryId: cat1.id,
        stock: 10,
        available: true,
        isPromotion: false,
        isCombo: false,
        companyId: company1.id,
      },
      {
        name: "Sumo de Manga",
        description: "Sumo natural de manga fresca",
        price: 150,
        categoryId: cat2.id,
        stock: 50,
        available: true,
        isPromotion: false,
        isCombo: false,
        companyId: company1.id,
      },
      {
        name: "Agua de Coco",
        description: "Agua de coco natural gelada",
        price: 100,
        categoryId: cat2.id,
        stock: 40,
        available: true,
        isPromotion: false,
        isCombo: false,
        companyId: company1.id,
      },
      {
        name: "Bolo de Coco",
        description: "Bolo caseiro de coco",
        price: 200,
        categoryId: cat3.id,
        stock: 15,
        available: true,
        isPromotion: false,
        isCombo: false,
        companyId: company1.id,
      },
      {
        name: "Pudim de Leite",
        description: "Pudim cremoso de leite condensado",
        price: 250,
        categoryId: cat3.id,
        stock: 12,
        available: true,
        isPromotion: false,
        isCombo: false,
        companyId: company1.id,
      },
    ],
  });

  // Create Products for company2
  await prisma.product.createMany({
    data: [
      {
        name: "Espresso",
        description: "Cafe espresso forte e encorpado",
        price: 80,
        categoryId: cat4.id,
        stock: 100,
        available: true,
        isPromotion: false,
        isCombo: false,
        companyId: company2.id,
      },
      {
        name: "Cappuccino",
        description: "Cappuccino cremoso com canela",
        price: 150,
        categoryId: cat4.id,
        stock: 80,
        available: true,
        isPromotion: false,
        isCombo: false,
        companyId: company2.id,
      },
      {
        name: "Croissant de Chocolate",
        description: "Croissant fresco recheado com chocolate",
        price: 120,
        categoryId: cat5.id,
        stock: 25,
        available: true,
        isPromotion: true,
        promotionPrice: 95,
        isCombo: false,
        companyId: company2.id,
      },
      {
        name: "Sanduiche Mista",
        description: "Sanduiche com queijo, fiambre e salada",
        price: 200,
        categoryId: cat5.id,
        stock: 20,
        available: true,
        isPromotion: false,
        isCombo: false,
        companyId: company2.id,
      },
    ],
  });

  console.log("Products created");

  // Create Customers
  await prisma.customer.createMany({
    data: [
      {
        name: "Maria Joaquim",
        email: "maria@email.co.mz",
        phone: "+258841111111",
        points: 250,
        level: "silver",
        totalSpent: 12500,
        companyId: company1.id,
      },
      {
        name: "Pedro Santos",
        email: "pedro@email.co.mz",
        phone: "+258842222222",
        points: 500,
        level: "gold",
        totalSpent: 35000,
        companyId: company1.id,
      },
      {
        name: "Fatima Abreu",
        email: "fatima@email.co.mz",
        phone: "+258843333333",
        points: 100,
        level: "bronze",
        totalSpent: 5000,
        companyId: company1.id,
      },
      {
        name: "Luis Mondlane",
        email: "luis@email.co.mz",
        phone: "+258844444444",
        points: 1000,
        level: "diamond",
        totalSpent: 85000,
        companyId: company2.id,
      },
      {
        name: "Rosa Chissano",
        email: "rosa@email.co.mz",
        phone: "+258845555555",
        points: 150,
        level: "bronze",
        totalSpent: 7500,
        companyId: company2.id,
      },
    ],
  });

  console.log("Customers created");

  // Create Reservations
  await prisma.reservation.createMany({
    data: [
      {
        customerName: "Maria Joaquim",
        customerPhone: "+258841111111",
        date: "2024-12-20",
        time: "19:00",
        guests: 4,
        status: "confirmed",
        notes: "Aniversario - mesa decorada",
        prepaid: true,
        amount: 2500,
        companyId: company1.id,
      },
      {
        customerName: "Pedro Santos",
        customerPhone: "+258842222222",
        date: "2024-12-21",
        time: "20:30",
        guests: 2,
        status: "pending",
        prepaid: false,
        companyId: company1.id,
      },
      {
        customerName: "Luis Mondlane",
        customerPhone: "+258844444444",
        date: "2024-12-22",
        time: "15:00",
        guests: 6,
        status: "confirmed",
        notes: "Reuniao de negocios",
        prepaid: true,
        amount: 5000,
        companyId: company1.id,
      },
    ],
  });

  console.log("Reservations created");

  // Create Subscriptions
  await prisma.subscription.createMany({
    data: [
      {
        companyId: company1.id,
        companyName: "Restaurante Tropical",
        plan: "professional",
        status: "active",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-01-01"),
        amount: 2500,
        paymentMethod: "mpesa",
      },
      {
        companyId: company2.id,
        companyName: "Cafe Maputo",
        plan: "basic",
        status: "active",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2025-06-01"),
        amount: 1500,
        paymentMethod: "emola",
      },
      {
        companyId: company3.id,
        companyName: "Pizza Beira",
        plan: "premium",
        status: "active",
        startDate: new Date("2024-03-15"),
        endDate: new Date("2025-03-15"),
        amount: 5000,
        paymentMethod: "visa",
      },
    ],
  });

  console.log("Subscriptions created");

  // Create some Payments
  await prisma.payment.createMany({
    data: [
      {
        amount: 2500,
        currency: "MZN",
        method: "mpesa",
        status: "completed",
        reference: "PAY-001",
        transactionId: "TXN-MPESA-001",
        companyId: company1.id,
      },
      {
        amount: 1500,
        currency: "MZN",
        method: "emola",
        status: "completed",
        reference: "PAY-002",
        transactionId: "TXN-EMOLA-001",
        companyId: company2.id,
      },
      {
        amount: 5000,
        currency: "MZN",
        method: "visa",
        status: "completed",
        reference: "PAY-003",
        transactionId: "TXN-STRIPE-001",
        companyId: company3.id,
      },
      {
        amount: 850,
        currency: "MZN",
        method: "mpesa",
        status: "pending",
        reference: "PAY-004",
        companyId: company1.id,
      },
    ],
  });

  console.log("Payments created");

  console.log("Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
