import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '9830234950';

export async function GET() {
  // Product listing is public — used by shop & product pages
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Admin-only route
  try {
    const session = await getSession();
    if (!session || session.mobile !== ADMIN_MOBILE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();

    if (!json.name || json.price === undefined || json.mrp === undefined) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: json.name,
        category: json.category || 'Modular Boxes',
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
        inStock: json.inStock ?? true,
        showInBanner: json.showInBanner ?? false,
        bulkDiscount: Number(json.bulkDiscount) || 5.0,
        imageUrl: json.imageUrl,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}
