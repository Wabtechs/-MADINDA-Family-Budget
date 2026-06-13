import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useEntityStore from './store/entityStore';

import PublicLayout from './components/layouts/PublicLayout';
import AppLayout from './components/layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

import HomePage from './pages/public/Home';
import FeaturesPage from './pages/public/Features';
import HowItWorksPage from './pages/public/HowItWorks';
import ContactPage from './pages/public/Contact';

import DashboardPage from './pages/app/Dashboard';
import IncomesPage from './pages/app/Incomes';
import ExpensesPage from './pages/app/Expenses';
import AccountsPage from './pages/app/Accounts';
import TransfersPage from './pages/app/Transfers';
import BudgetsPage from './pages/app/Budgets';
import GoalsPage from './pages/app/Goals';
import DebtsPage from './pages/app/Debts';
import DocumentsPage from './pages/app/Documents';
import ReportsPage from './pages/app/Reports';
import ProfilePage from './pages/app/Profile';
import NotificationsPage from './pages/app/Notifications';

function App() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);
  const fetchEntities = useEntityStore((s) => s.fetchEntities);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (token) {
      fetchEntities();
    }
  }, [token, fetchEntities]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="incomes" element={<IncomesPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="transfers" element={<TransfersPage />} />
        <Route path="budgets" element={<BudgetsPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="debts" element={<DebtsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
