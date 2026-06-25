import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Public API: Returns active premium companies for the landing page showcase.
 * No authentication required.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get("plan") || "premium";
    const limit = parseInt(searchParams.get("limit") || "10");

    const companies = await prisma.company.findMany({
      where: {
        status: "active",
        plan: plan as any,
      },
      select: {
        id: true,
        name: true,
        type: true,
        slug: true,
        logo: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // Also get all active companies for the carousel
    const allPartners = await prisma.company.findMany({
      where: { status: "active" },
      select: {
        id: true,
        name: true,
        type: true,
        slug: true,
        logo: true,
        plan: true,
      },
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      premium: companies,
      partners: allPartners,
    });
  } catch (error: any) {
    console.error("Public companies error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
