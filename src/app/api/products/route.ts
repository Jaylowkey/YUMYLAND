import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, getCurrentCompanyId } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";

    const skip = (page - 1) * limit;

    const where: any = { companyId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const body = await request.json();
    const { name, description, price, categoryId, photo, stock, available, isPromotion, promotionPrice, isCombo, comboItems } = body;

    if (!name || !description || price === undefined || !categoryId) {
      return NextResponse.json(
        { error: "Name, description, price, and categoryId are required" },
        { status: 400 }
      );
    }

    // Verify category belongs to the same company
    const category = await prisma.category.findFirst({
      where: { id: categoryId, companyId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        photo: photo || null,
        stock: stock ? parseInt(stock) : 0,
        available: available !== undefined ? available : true,
        isPromotion: isPromotion || false,
        promotionPrice: promotionPrice ? parseFloat(promotionPrice) : null,
        isCombo: isCombo || false,
        comboItems: comboItems || [],
        companyId,
      },
      include: { category: true },
    });

    // Update category product count
    await prisma.category.update({
      where: { id: categoryId },
      data: { productCount: { increment: 1 } },
    });

    return NextResponse.json(product, { status: 201 });
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
