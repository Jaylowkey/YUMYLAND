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

    const product = await prisma.product.findFirst({
      where: { id: params.id, companyId },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
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

    const existing = await prisma.product.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, price, categoryId, photo, stock, available, isPromotion, promotionPrice, isCombo, comboItems } = body;

    // If category is changing, verify the new category belongs to the same company
    if (categoryId && categoryId !== existing.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, companyId },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }

      // Update old category count
      await prisma.category.update({
        where: { id: existing.categoryId },
        data: { productCount: { decrement: 1 } },
      });

      // Update new category count
      await prisma.category.update({
        where: { id: categoryId },
        data: { productCount: { increment: 1 } },
      });
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(categoryId && { categoryId }),
        ...(photo !== undefined && { photo }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(available !== undefined && { available }),
        ...(isPromotion !== undefined && { isPromotion }),
        ...(promotionPrice !== undefined && { promotionPrice: promotionPrice ? parseFloat(promotionPrice) : null }),
        ...(isCombo !== undefined && { isCombo }),
        ...(comboItems !== undefined && { comboItems }),
      },
      include: { category: true },
    });

    return NextResponse.json(product);
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

    const existing = await prisma.product.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: params.id } });

    // Update category product count
    await prisma.category.update({
      where: { id: existing.categoryId },
      data: { productCount: { decrement: 1 } },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const existing = await prisma.product.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Toggle availability
    const product = await prisma.product.update({
      where: { id: params.id },
      data: { available: !existing.available },
      include: { category: true },
    });

    return NextResponse.json(product);
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
