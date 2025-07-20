import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-50 to-blue-50 p-6 dark:from-slate-950 dark:to-slate-900">
    <div className="text-center">
      <div className="text-6xl font-bold text-gradient">404</div>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">That page does not exist.</p>
      <Link className="btn-primary mt-8 inline-block" to="/dashboard">Go to dashboard</Link>
    </div>
  </main>
);

export default NotFound;
