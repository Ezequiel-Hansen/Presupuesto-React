import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import useAuth from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './components/Login';
import Home from './components/Home';
import CreateBudgetForm from './components/CreateBudgetForm';
import BudgetsByYear from './components/BudgetsByYear';

const queryClient = new QueryClient();

function BudgetsByYearPage() {
  const { year } = useParams();
  return <BudgetsByYear year={year} />;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/years/:year"
        element={
          <Layout>
            <BudgetsByYearPage />
          </Layout>
        }
      />
      <Route
        path="/budgets/new"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateBudgetForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
