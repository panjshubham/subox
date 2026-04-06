import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const product = await prisma.product.create({
      data: {
        name: json.name,
        moduleSize: json.moduleSize,
        material: json.material,
        primaryUse: json.primaryUse,
        dimensions: json.dimensions,
        price: Number(json.price),
        mrp: Number(json.mrp),
        thickness: json.thickness,
        coating: json.coating,
        features: json.features,
        hsnCode: json.hsnCode || '8538',
        description: json.description,
        inStock: json.inStock,
        bulkDiscount: Number(json.bulkDiscount),
        imageUrl: json.imageUrl,
      }
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}
