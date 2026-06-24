import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, getCurrentCompanyId } from "@/lib/auth-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const category = await prisma.category.findFirst({
      where: { id: params.id, companyId },
      include: {
        products: true,
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...category,
      productCount: category._count.products,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const existing = await prisma.category.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const existing = await prisma.category.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: params.id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing products. Remove or reassign products first." },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
