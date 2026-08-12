import { API_BASE } from './utils';

const TOKEN_KEY = 'smg_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: AuthUser }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request('/api/v1/auth/logout', { method: 'POST' }),
  me: () => request<AuthUser>('/api/v1/auth/me'),
  dashboardStats: () => request<DashboardStats>('/api/v1/admin/dashboard/stats'),
  getCmsSections: () => request<CmsSection[]>('/api/v1/admin/cms/homepage'),
  getCmsSection: (key: string) => request<CmsSection>(`/api/v1/admin/cms/homepage/${key}`),
  updateCmsSection: (key: string, data: { contentEn: object; contentBn: object }) =>
    request<CmsSection>(`/api/v1/admin/cms/homepage/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getFounderModal: () => request<CmsSection | null>('/api/v1/admin/cms/founder-modal'),
  updateFounderModal: (data: { contentEn: object; contentBn: object }) =>
    request<CmsSection>('/api/v1/admin/cms/founder-modal', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getCategories: () => request<GalleryCategory[]>('/api/v1/admin/gallery/categories'),
  createCategory: (data: Partial<GalleryCategory>) =>
    request<GalleryCategory>('/api/v1/admin/gallery/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, data: Partial<GalleryCategory>) =>
    request<GalleryCategory>(`/api/v1/admin/gallery/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: string) =>
    request(`/api/v1/admin/gallery/categories/${id}`, { method: 'DELETE' }),
  getGalleryItems: (category?: string) => {
    const q = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    return request<GalleryItemRow[]>(`/api/v1/admin/gallery/items${q}`);
  },
  createGalleryItem: (data: object) =>
    request('/api/v1/admin/gallery/items', { method: 'POST', body: JSON.stringify(data) }),
  updateGalleryItem: (id: string, data: object) =>
    request(`/api/v1/admin/gallery/items/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteGalleryItem: (id: string) =>
    request(`/api/v1/admin/gallery/items/${id}`, { method: 'DELETE' }),
  signUpload: (folder?: string) =>
    request<UploadSignature>('/api/v1/admin/media/sign-upload', {
      method: 'POST',
      body: JSON.stringify({ folder }),
    }),
  getUsers: () => request<AuthUser[]>('/api/v1/admin/users'),
  createUser: (data: object) =>
    request('/api/v1/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string, data: object) =>
    request(`/api/v1/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteUser: (id: string) =>
    request(`/api/v1/admin/users/${id}`, { method: 'DELETE' }),
};

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'media_manager';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive?: boolean;
};

export type DashboardStats = {
  galleryItems: number;
  categories: number;
  cmsSections: number;
  users: number;
  lastCmsUpdate: string | null;
};

export type CmsSection = {
  sectionKey: string;
  contentEn: Record<string, unknown>;
  contentBn: Record<string, unknown>;
  updatedAt: string;
};

export type GalleryCategory = {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  sortOrder: number;
  isActive: boolean;
};

export type GalleryItemRow = {
  item: {
    id: string;
    type: 'photo' | 'video';
    url: string;
    titleEn: string;
    titleBn: string;
    descriptionEn: string;
    descriptionBn: string;
    videoUrl?: string;
    categoryId: string;
    isPublished: boolean;
  };
  category: GalleryCategory;
};

export type UploadSignature = {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  folder: string;
};
