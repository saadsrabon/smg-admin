import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import GalleryPage from '@/pages/GalleryPage';
import CategoriesPage from '@/pages/CategoriesPage';
import HomepageCmsPage from '@/pages/HomepageCmsPage';
import FounderModalPage from '@/pages/FounderModalPage';
import PreviewPage from '@/pages/PreviewPage';
import UsersPage from '@/pages/UsersPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/media/gallery" element={<GalleryPage />} />
              <Route path="/media/categories" element={<CategoriesPage />} />
              <Route path="/cms/homepage" element={<HomepageCmsPage />} />
              <Route path="/cms/founder-modal" element={<FounderModalPage />} />
              <Route path="/cms/preview" element={<PreviewPage />} />
              <Route path="/users" element={<UsersPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
