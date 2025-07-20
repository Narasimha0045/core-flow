import { CheckCircle2 } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <main className="grid min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 lg:grid-cols-[0.9fr_1.1fr] dark:from-slate-950 dark:to-slate-900">
    <section className="hidden bg-gradient-to-br from-primary-700 to-primary-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
      <div>
        <div className="text-2xl font-bold">Team Tasks</div>
        <h1 className="mt-16 max-w-xl text-5xl font-bold leading-tight">Plan projects, assign work, and keep teams moving.</h1>
      </div>
      <div className="grid gap-4 text-sm text-primary-100">
        {['Project member management', 'Admin and member permissions', 'Task progress dashboard'].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success-400" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
    <section className="flex items-center justify-center p-6">
      <Outlet />
    </section>
  </main>
);

export default AuthLayout;
