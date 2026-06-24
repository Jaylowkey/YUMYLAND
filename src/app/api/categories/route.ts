import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, getCurrentCompanyId } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = await getCurrentCompanyId();

    const categories = await prisma.category.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Map to include product count from relation count
    const categoriesWithCounts = categories.map((cat) => ({
      ...cat,
      productCount: cat._count.products,
    }));

    return NextResponse.json(categoriesWithCounts);
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
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        companyId,
      },
    });

    return NextResponse.json(category, { status: 201 });
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
