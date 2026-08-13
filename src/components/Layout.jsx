import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import { AccountOutlineIcon } from '../utils/icons.js';

export default function Layout({ children }) {
  const [showMenu, setShowMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    setShowMenu(false);
    setMobileOpen(false);
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="relative bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <img src="/favicon.svg" alt="Presupuesto Logo" className='h-10' />
            <h1 className='font-extrabold text-2xl'>Presupuesto</h1>
          </Link>

          <Link
            to="/years/2026"
            className="hidden md:block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            2026
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                >
                  <AccountOutlineIcon height='24'/>
                  {user?.name || user?.email}
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-1">
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        {user?.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Cerrar sesion
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xl cursor-pointer"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMobileOpen(false)} />
            <div className="absolute top-full left-0 right-0 z-20 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <Link
                to="/years/2026"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                2026
              </Link>

              <button
                onClick={() => { toggle(); setMobileOpen(false); }}
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
              >
                {dark ? ' Modo oscuro: On' : ' Modo claro: Off'}
              </button>

              {isAuthenticated && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <AccountOutlineIcon height='20'/>
                    {user?.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                  >
                    ✕ Cerrar sesion
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}