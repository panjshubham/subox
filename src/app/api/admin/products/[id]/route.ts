import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const json = await request.json();
    const updated = await prisma.product.update({
      where: { id },
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
        hsnCode: json.hsnCode,
        description: json.description,
        inStock: json.inStock,
        bulkDiscount: Number(json.bulkDiscount),
        imageUrl: json.imageUrl,
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    await prisma.product.delete({
      where: { id }
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
  }
}
