const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = [
    { 
      name: '8 Module G.I. Box', 
      moduleSize: '8M', 
      material: 'G.I.', 
      primaryUse: 'Large Switch Plates',
      dimensions: '8x2', 
      mrp: 60, 
      price: 30,
      thickness: '1.2mm (Heavy Duty)',
      coating: 'Pre-Galvanized Zinc',
      features: 'Weldless folded design, Earth screw provision, and 100-hour salt spray tested.',
      description: 'Manufactured from high-grade galvanized iron sheets for maximum rust resistance and a lifespan of 20+ years. Features a unique weldless folded design that ensures perfect alignment for front plates and switches, reducing installation time for electricians. Equipped with dedicated earthing screw provisions to meet all Indian electrical safety standards.',
      inStock: true,
      bulkDiscount: 10.0
    },
    { 
      name: '12 Module G.I. Box', 
      moduleSize: '12M', 
      material: 'G.I.', 
      primaryUse: 'Multi-point Junctions',
      dimensions: '3x10', 
      mrp: 56, 
      price: 28,
      thickness: '1.2mm (Heavy Duty)',
      coating: 'Pre-Galvanized Zinc',
      features: 'Weldless folded design, Earth screw provision, and 100-hour salt spray tested.',
      description: 'Manufactured from high-grade galvanized iron sheets for maximum rust resistance and a lifespan of 20+ years. Designed for complex multi-point junctions with optimal wiring space.',
      inStock: true,
      bulkDiscount: 10.0
    },
    { 
      name: '6 Module G.I. Box', 
      moduleSize: '6M', 
      material: 'G.I.', 
      primaryUse: 'Standard Room Switch',
      dimensions: '3x6', 
      mrp: 50, 
      price: 25,
      thickness: '1.0mm (Standard)',
      coating: 'Pre-Galvanized Zinc',
      features: 'Weldless folded design, Earth screw provision, and 100-hour salt spray tested.',
      description: 'Manufactured from high-grade galvanized iron sheets. The industry standard for single-room switchboards, providing a fast, wobble-free installation every time.',
      inStock: true,
      bulkDiscount: 5.0
    },
    { 
      name: '4 Module M.S. Box', 
      moduleSize: '4M', 
      material: 'M.S.', 
      primaryUse: 'Power Sockets',
      dimensions: '4x4', 
      mrp: 36, 
      price: 18,
      thickness: '1.0mm (Standard)',
      coating: 'Powder Coated',
      features: 'Weldless folded design, Earth screw provision',
      description: 'Built with durable Mild Steel and powder-coated for interior longevity. Perfect for A/C, geyser, or heavy appliance power sockets.',
      inStock: true,
      bulkDiscount: 5.0
    },
    { 
      name: '12 Module Horizontal M.S. Box', 
      moduleSize: '12M', 
      material: 'M.S.', 
      primaryUse: 'Slimline Horizontal',
      dimensions: '4x12', 
      mrp: 40, 
      price: 20,
      thickness: '1.2mm (Heavy Duty)',
      coating: 'Powder Coated',
      features: 'Weldless folded design, Earth screw provision',
      description: 'Built with durable Mild Steel and powder-coated. The slimline horizontal alignment is ideal for sleek, modern interior TV unit layouts or kitchen islands.',
      inStock: true,
      bulkDiscount: 10.0
    }
  ];

  for (const p of products) {
    await prisma.product.create({
      data: p,
    });
  }
  console.log('Database seeded with precise technical specifications and professional descriptions.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
