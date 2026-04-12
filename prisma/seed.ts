import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    name: 'GI Modular Box 1M',
    category: 'Modular Boxes',
    moduleSize: '1M',
    material: 'G.I.',
    primaryUse: 'Residential & Light Commercial Wiring',
    dimensions: '3 x 3',
    mrp: 60,
    price: 45,
    thickness: '1.0mm (Standard)',
    coating: 'Pre-Galvanized Zinc',
    features: 'Weldless folded design, Earth screw provision, ISI grade material, Corrosion resistant coating',
    hsnCode: '8538',
    description: 'Premium quality single module G.I. modular electrical box. Manufactured from high-grade galvanized iron for maximum rust resistance. Ideal for residential and light commercial wiring installations.',
    inStock: true,
    showInBanner: true,
    bulkDiscount: 10,
    imageUrl: null,
  },
  {
    name: 'GI Modular Box 2M',
    category: 'Modular Boxes',
    moduleSize: '2M',
    material: 'G.I.',
    primaryUse: 'Residential & Commercial Wiring',
    dimensions: '3 x 6',
    mrp: 95,
    price: 75,
    thickness: '1.0mm (Standard)',
    coating: 'Pre-Galvanized Zinc',
    features: 'Double module capacity, Earth screw provision, ISI grade material, Weldless design',
    hsnCode: '8538',
    description: 'High-quality double module G.I. modular electrical box. Perfect for dual switch/socket installations in homes, offices, and commercial establishments.',
    inStock: true,
    showInBanner: true,
    bulkDiscount: 10,
    imageUrl: null,
  },
  {
    name: 'GI Modular Box 4M',
    category: 'Modular Boxes',
    moduleSize: '4M',
    material: 'G.I.',
    primaryUse: 'Commercial & Industrial Wiring',
    dimensions: '3 x 12',
    mrp: 165,
    price: 130,
    thickness: '1.2mm (Heavy)',
    coating: 'Pre-Galvanized Zinc',
    features: '4-module capacity, Heavy-duty construction, Earth screw provision, ISI grade material',
    hsnCode: '8538',
    description: 'Industrial-grade 4 module G.I. electrical box designed for commercial and industrial environments. Heavy-duty galvanized iron construction ensures longevity and safety.',
    inStock: true,
    showInBanner: true,
    bulkDiscount: 12,
    imageUrl: null,
  },
  {
    name: 'GI Modular Box 8M',
    category: 'Modular Boxes',
    moduleSize: '8M',
    material: 'G.I.',
    primaryUse: 'Industrial & High-Load Installations',
    dimensions: '3 x 24',
    mrp: 280,
    price: 220,
    thickness: '1.2mm (Heavy)',
    coating: 'Pre-Galvanized Zinc',
    features: '8-module capacity, Industrial grade, Earth screw provision, Rust resistant coating, Factory tested',
    hsnCode: '8538',
    description: 'Large 8 module G.I. electrical enclosure for heavy-duty industrial and high-load installations. Manufactured with precision engineering for maximum reliability.',
    inStock: true,
    showInBanner: false,
    bulkDiscount: 15,
    imageUrl: null,
  },
  {
    name: 'MS Modular Box 2M',
    category: 'Modular Boxes',
    moduleSize: '2M',
    material: 'M.S.',
    primaryUse: 'Industrial Wiring & Panels',
    dimensions: '3 x 6',
    mrp: 100,
    price: 80,
    thickness: '1.2mm (Standard)',
    coating: 'Powder Coated',
    features: 'Mild steel construction, Powder coated finish, Earth screw provision, High strength',
    hsnCode: '8538',
    description: 'Mild steel double module electrical box with powder coated finish. Superior strength for industrial panel wiring applications. Suitable for heavy-duty switching operations.',
    inStock: true,
    showInBanner: false,
    bulkDiscount: 10,
    imageUrl: null,
  },
  {
    name: 'MS Modular Box 4M',
    category: 'Modular Boxes',
    moduleSize: '4M',
    material: 'M.S.',
    primaryUse: 'Industrial & Manufacturing Units',
    dimensions: '3 x 12',
    mrp: 185,
    price: 145,
    thickness: '1.5mm (Heavy)',
    coating: 'Powder Coated',
    features: '4-module M.S. enclosure, Heavy powder coat, Earth screw, Anti-vibration design, Factory tested',
    hsnCode: '8538',
    description: 'Robust 4 module mild steel electrical enclosure. Heavy gauge powder coated finish for harsh industrial environments. Ideal for manufacturing units and heavy electrical installations.',
    inStock: true,
    showInBanner: true,
    bulkDiscount: 12,
    imageUrl: null,
  },
  {
    name: 'MS Modular Box 8M HD',
    category: 'Modular Boxes',
    moduleSize: '8M',
    material: 'M.S.',
    primaryUse: 'Heavy Industrial & Factory Panels',
    dimensions: '3 x 24',
    mrp: 360,
    price: 280,
    thickness: '2.0mm (Ultra Heavy Duty)',
    coating: 'Epoxy Powder Coated',
    features: 'Heavy duty 8M M.S. box, 2mm thick steel, Epoxy coat, Anti-corrosion, Factory direct',
    hsnCode: '8538',
    description: 'Heavy-duty 8 module mild steel enclosure for major industrial and factory panel applications. Ultra-thick 2mm M.S. with epoxy powder coating for maximum durability in extreme environments.',
    inStock: true,
    showInBanner: false,
    bulkDiscount: 15,
    imageUrl: null,
  },
  {
    name: 'GI Floor Box 4M',
    category: 'Floor Boxes',
    moduleSize: '4M',
    material: 'G.I.',
    primaryUse: 'Floor-Mount Wiring & Offices',
    dimensions: '4 x 12',
    mrp: 240,
    price: 190,
    thickness: '1.5mm (Heavy)',
    coating: 'Pre-Galvanized Zinc + Powder Coat',
    features: 'Floor mount design, 4 module capacity, Anti-slip base, IP44 protection, Heavy-duty lid',
    hsnCode: '8538',
    description: 'Specialized 4 module G.I. floor-mount electrical box. Anti-slip base with heavy-duty lid for floor-level switch and socket installations in offices, showrooms, and industrial floors.',
    inStock: true,
    showInBanner: false,
    bulkDiscount: 10,
    imageUrl: null,
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Upsert StoreSettings so admin dashboard works
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      businessName: 'Shubham Enterprise',
      brandName: 'SHUBOX',
      gstin: '19EAOPP6239Q1ZH',
      address: '41, Tangra Road, Kolkata - 700 015',
      phoneOne: '+91 9830234950',
      phoneTwo: '+91 6290754634',
      email: '93.shubhampanjiyara@gmail.com',
      bankName: 'Bandhan Bank',
      bankBranch: 'C I T Road',
      accountNo: '10220004937961',
      ifscCode: 'BDBL0001843',
    },
  });
  console.log('✅ StoreSettings seeded');

  // Seed products
  let count = 0;
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: count + 1 },
      update: product,
      create: product,
    });
    count++;
    console.log(`✅ Seeded: ${product.name}`);
  }

  console.log(`\n🎉 Done! ${count} products seeded successfully.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
