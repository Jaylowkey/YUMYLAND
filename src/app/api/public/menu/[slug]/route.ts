import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const company = await prisma.company.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        logo: true,
        status: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    if (company.status === "suspended") {
      return NextResponse.json(
        { error: "This restaurant is currently unavailable" },
        { status: 403 }
      );
    }

    const categories = await prisma.category.findMany({
      where: { companyId: company.id },
      orderBy: { name: "asc" },
      include: {
        products: {
          where: { available: true },
          orderBy: { name: "asc" },
        },
      },
    });

    return NextResponse.json({
      company: {
        name: company.name,
        slug: company.slug,
        type: company.type,
        logo: company.logo,
      },
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        products: cat.products.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          photo: product.photo,
          available: product.available,
          isPromotion: product.isPromotion,
          promotionPrice: product.promotionPrice,
          isCombo: product.isCombo,
          comboItems: product.comboItems,
        })),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
