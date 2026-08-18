const API_BASE = "/api/admin";

interface ApiOptions {
  method?: string;
  body?: unknown;
}

async function adminFetch<T = any>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body } = options;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    adminFetch("/auth/login", { method: "POST", body: { email, password } }),

  logout: () => adminFetch("/auth/logout", { method: "POST" }),

  me: () => adminFetch<{ user: { id: number; email: string; name: string; role: string } }>("/auth/me"),
};

// ─── Posts ────────────────────────────────────────────────────────────────────

export const postsApi = {
  list: (params?: { search?: string; category?: string; published?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.category) qs.set("category", params.category);
    if (params?.published) qs.set("published", params.published);
    const query = qs.toString();
    return adminFetch(`/posts${query ? `?${query}` : ""}`);
  },
  get: (id: number) => adminFetch(`/posts/${id}`),
  create: (data: any) => adminFetch("/posts", { method: "POST", body: data }),
  update: (id: number, data: any) =>
    adminFetch(`/posts/${id}`, { method: "PUT", body: data }),
  delete: (id: number) =>
    adminFetch(`/posts/${id}`, { method: "DELETE" }),
};

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviewsApi = {
  list: () => adminFetch("/reviews"),
  updateStatus: (id: number, status: string) =>
    adminFetch(`/reviews/${id}/status`, { method: "PATCH", body: { status } }),
  delete: (id: number) =>
    adminFetch(`/reviews/${id}`, { method: "DELETE" }),
};

// ─── Events ──────────────────────────────────────────────────────────────────

export const eventsApi = {
  list: () => adminFetch("/events"),
  get: (id: number) => adminFetch(`/events/${id}`),
  create: (data: any) => adminFetch("/events", { method: "POST", body: data }),
  update: (id: number, data: any) =>
    adminFetch(`/events/${id}`, { method: "PUT", body: data }),
  delete: (id: number) =>
    adminFetch(`/events/${id}`, { method: "DELETE" }),
};

// ─── Members ─────────────────────────────────────────────────────────────────

export const membersApi = {
  list: (params?: { tier?: string; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.tier) qs.set("tier", params.tier);
    if (params?.status) qs.set("status", params.status);
    const query = qs.toString();
    return adminFetch(`/members${query ? `?${query}` : ""}`);
  },
  updateStatus: (id: number, status: string) =>
    adminFetch(`/members/${id}/status`, { method: "PATCH", body: { status } }),
};

// ─── Team ────────────────────────────────────────────────────────────────────

export const teamApi = {
  list: () => adminFetch("/team"),
  get: (id: number) => adminFetch(`/team/${id}`),
  create: (data: any) => adminFetch("/team", { method: "POST", body: data }),
  update: (id: number, data: any) =>
    adminFetch(`/team/${id}`, { method: "PUT", body: data }),
  delete: (id: number) =>
    adminFetch(`/team/${id}`, { method: "DELETE" }),
};

// ─── Stats ───────────────────────────────────────────────────────────────────

export const statsApi = {
  list: () => adminFetch("/stats"),
  update: (id: number, data: any) =>
    adminFetch(`/stats/${id}`, { method: "PUT", body: data }),
};

// ─── Seed ────────────────────────────────────────────────────────────────────

export const seedApi = {
  seed: () => adminFetch("/seed", { method: "POST" }),
};
