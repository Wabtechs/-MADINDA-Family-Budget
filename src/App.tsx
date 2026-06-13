import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import HomePage from './public-pages/Home/HomePage';
import AboutPage from './public-pages/About/AboutPage';
import PricingPage from './public-pages/Pricing/PricingPage';
import DownloadPage from './public-pages/Download/DownloadPage';
import BlogPage from './public-pages/Blog/BlogPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ExpensesPage from './pages/Expenses/ExpensesPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import ReportsPage from './pages/Reports/ReportsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import './public-pages/styles/public.css';
import './styles/app.css';

function PublicLayout() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="/*" element={<PublicLayout />} />
    </Routes>
  );
}

export default App;
