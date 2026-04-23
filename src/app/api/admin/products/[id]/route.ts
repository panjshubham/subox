import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '9830234950';

// Allowed fields for PATCH to prevent arbitrary Prisma field injection
const ALLOWED_PATCH_FIELDS = new Set([
  'name', 'category', 'moduleSize', 'material', 'primaryUse', 'dimensions',
  'price', 'mrp', 'thickness', 'coating', 'features', 'hsnCode', 'description',
  'inStock', 'showInBanner', 'bulkDiscount', 'imageUrl', 'imageGallery',
]);

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.mobile !== ADMIN_MOBILE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await props.params;
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });

    const json = await request.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: json.name,
        category: json.category,
        moduleSize: json.moduleSize,
        material: json.material,
        primaryUse: json.primaryUse,
        dimensions: json.dimensions,
        price: Number(json.price),
        mrp: Number(json.mrp),
        thickness: json.thickness,
        coating: json.coating,
        features: json.features,
        hsnCode: json.hsnCode,
        description: json.description,
        inStock: json.inStock,
        showInBanner: json.showInBanner,
        bulkDiscount: Number(json.bulkDiscount),
        imageUrl: json.imageUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.mobile !== ADMIN_MOBILE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await props.params;
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });

    const json = await request.json();

    // Sanitise: only allow known fields to prevent arbitrary Prisma field injection
    const safeData: Record<string, unknown> = {};
    for (const key of Object.keys(json)) {
      if (ALLOWED_PATCH_FIELDS.has(key)) {
        safeData[key] = json[key];
      }
    }

    if (Object.keys(safeData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: safeData,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Failed to partially update product:', error);
    return NextResponse.json({ error: 'Error partially updating product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.mobile !== ADMIN_MOBILE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await props.params;
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });

    await prisma.product.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
  }
}
