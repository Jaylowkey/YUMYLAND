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

    const customer = await prisma.customer.findFirst({
      where: { id: params.id, companyId },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { items: { include: { product: true } } },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
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

    const existing = await prisma.customer.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, email, phone, level, points } = body;

    // Check for duplicate email within the same company (exclude current customer)
    if (email && email !== existing.email) {
      const duplicate = await prisma.customer.findFirst({
        where: { email, companyId, NOT: { id: params.id } },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "A customer with this email already exists" },
          { status: 400 }
        );
      }
    }

    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(level && { level }),
        ...(points !== undefined && { points: parseInt(points) }),
      },
    });

    return NextResponse.json(customer);
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

    const existing = await prisma.customer.findFirst({
      where: { id: params.id, companyId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    await prisma.customer.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Customer deleted successfully" });
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
