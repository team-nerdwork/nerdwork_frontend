export type ApiResult<T> = {
  success: boolean;
  data?: T;
  status?: number;
  message?: string;
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
};

export type Paginated<T> = {
  data: T[];
  pagination: Pagination;
};

export type AdminOverviewResponse = {
  summary: {
    totalUsers: number;
    totalCreators: number;
    monthlyRevenue: number;
    nftSales7d: number;
  };
  charts: {
    revenueAndUsers: { month: string; revenue: number; users: number }[];
    nftSales: { day: string; sales: number }[];
  };
  topCreators: { id: string; name: string; revenue: number; nfts: number }[];
  systemStatus: { name: string; status: string }[];
};

export type AdminUser = {
  id: string;
  email: string;
  username?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  createdAt?: string | null;
  isActive?: boolean;
  lockedUntil?: string | null;
  nftsOwned?: number;
  spent?: number;
};

export type AdminCreator = {
  id: string;
  name: string;
  email?: string | null;
  status: "pending" | "verified" | "rejected" | string;
  works?: number;
  revenue?: number;
  rating?: number | null;
};

export type AdminComic = {
  id: string;
  title: string;
  slug?: string | null;
  creator?: string | null;
  status: "draft" | "pending" | "published" | "flagged" | string;
  submitted?: string | null;
  chapters?: number;
  genre?: string | null;
  views?: number;
  sales?: number;
  revenue?: number;
};

export type MarketplaceSummary = {
  totalNftsMinted: number;
  sales7d: number;
  volume7d: number;
};

export type FinanceSummary = {
  platformRevenue: number;
  pendingPayouts: number;
  completedPayouts: number;
  platformFeePercent: number;
};

export type AdminPayout = {
  id: string;
  creator?: string | null;
  amount?: number;
  status?: string;
  date?: string | null;
};

export type AdminAuditLog = {
  id: string;
  action: string;
  status: string;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: { email?: string; [key: string]: unknown } | null;
  createdAt?: string | null;
  adminId?: string | null;
};
