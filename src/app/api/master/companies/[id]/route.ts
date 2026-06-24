import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole("MASTER");

    const company = await prisma.company.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { users: true, products: true, customers: true, orders: true, reservations: true },
        },
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message?.includes("Requires MASTER role")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    await requireRole("MASTER");

    const existing = await prisma.company.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, ownerName, email, phone, type, plan, slug } = body;

    // Check for duplicate slug if it's being changed
    if (slug && slug !== existing.slug) {
      const duplicateSlug = await prisma.company.findUnique({
        where: { slug },
      });
      if (duplicateSlug) {
        return NextResponse.json(
          { error: "A company with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const company = await prisma.company.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(ownerName && { ownerName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(type && { type }),
        ...(plan && { plan }),
        ...(slug && { slug }),
      },
    });

    return NextResponse.json(company);
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message?.includes("Requires MASTER role")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    await requireRole("MASTER");

    const existing = await prisma.company.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses = ["active", "suspended", "trial"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: active, suspended, trial" },
        { status: 400 }
      );
    }

    const company = await prisma.company.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(company);
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message?.includes("Requires MASTER role")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
