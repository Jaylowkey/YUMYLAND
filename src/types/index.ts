export interface Company {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  type: BusinessType;
  plan: Plan;
  status: "active" | "suspended" | "trial";
  createdAt: string;
  logo?: string;
  slug: string;
}

export type BusinessType =
  | "restaurant"
  | "snackbar"
  | "cafe"
  | "bakery"
  | "pizzeria"
  | "bar"
  | "foodtruck";

export type Plan = "basic" | "professional" | "premium";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName?: string;
  photo?: string;
  stock: number;
  available: boolean;
  isPromotion: boolean;
  promotionPrice?: number;
  isCombo: boolean;
  comboItems?: string[];
  companyId: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  companyId: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  prepaid: boolean;
  amount?: number;
  companyId: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  level: LoyaltyLevel;
  totalSpent: number;
  joinDate: string;
  companyId: string;
  digitalCardId?: string;
}

export type LoyaltyLevel = "bronze" | "silver" | "gold" | "diamond";

export interface Subscription {
  id: string;
  companyId: string;
  companyName: string;
  plan: Plan;
  status: "active" | "suspended" | "cancelled" | "trial";
  startDate: string;
  endDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export type PaymentMethod = "mpesa" | "emola" | "visa" | "mastercard";

export interface DashboardStats {
  salesToday: number;
  reservationsToday: number;
  activeClients: number;
  monthlyRevenue: number;
}

export interface MasterStats {
  totalCompanies: number;
  totalCustomers: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
}
