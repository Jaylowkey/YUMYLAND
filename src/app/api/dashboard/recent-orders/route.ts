import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const companyId = session.user.companyId;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // If user is MASTER without a company, return recent payments from all companies
    if (!companyId) {
      const payments = await prisma.payment.findMany({
        where: { status: "completed" },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          company: { select: { name: true } },
        },
      });

      const orders = payments.map((p) => ({
        id: p.id,
        customer: p.company.name,
        items: `Pagamento via ${p.method}`,
        total: p.amount,
        time: new Date(p.createdAt).toLocaleTimeString("pt-MZ", { hour: "2-digit", minute: "2-digit" }),
      }));

      return NextResponse.json(orders);
    }

    // For company owners, return orders or recent payments
    const payments = await prisma.payment.findMany({
      where: { companyId, status: "completed" },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // If there are orders in the DB, show them; otherwise show payments
    const orders = await prisma.order.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        customer: {
          select: { name: true },
        },
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (orders.length > 0) {
      const formattedOrders = orders.map((order) => ({
        id: order.id,
        customer: order.customer?.name || "Cliente",
        items: order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ") || "Pedido",
        total: order.total,
        time: new Date(order.createdAt).toLocaleTimeString("pt-MZ", { hour: "2-digit", minute: "2-digit" }),
      }));
      return NextResponse.json(formattedOrders);
    }

    // Fallback: show recent payments as orders
    const formattedPayments = payments.map((p) => ({
      id: p.id,
      customer: `Pagamento #${p.reference?.slice(-6) || p.id.slice(-6)}`,
      items: `${p.method.toUpperCase()} - ${p.reference || ""}`,
      total: p.amount,
      time: new Date(p.createdAt).toLocaleTimeString("pt-MZ", { hour: "2-digit", minute: "2-digit" }),
    }));

    return NextResponse.json(formattedPayments);
  } catch (error: any) {
    if (error.message === "Unauthorized: No active session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Recent orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
