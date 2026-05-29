import { BarChart3, ClipboardList, FolderKanban, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ClipboardList }
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-300 bg-gradient-to-b from-white to-slate-50 p-5 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gradient text-xl font-bold">Core Flow</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Collaborative workspace</div>
        </div>
        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-smooth" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="mt-8 grid gap-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-smooth ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md dark:from-primary-600 dark:to-primary-500'
                  : 'text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-slate-300 pt-5 dark:border-slate-700">
        <div className="mb-4 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
          <div className="font-semibold text-slate-900 dark:text-white">{user?.name}</div>
          <div className="truncate text-xs text-slate-600 dark:text-slate-400">{user?.email}</div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex-1" onClick={() => setDark((value) => !value)} aria-label="Toggle theme" title="Toggle dark mode">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="btn-secondary flex-1" onClick={handleLogout} title="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 transition-smooth">
      <div className="lg:hidden">
        <header className="flex items-center justify-between border-b border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 shadow-sm">
          <div className="text-gradient font-bold">Core Flow</div>
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-smooth" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
        </header>
      </div>
      <div className="flex">
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex">{sidebar}</div>
        {open && <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} />}
        {open && <div className="fixed inset-y-0 left-0 z-50 lg:hidden">{sidebar}</div>}
        <main className="w-full p-4 sm:p-6 lg:ml-72 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
