import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/formatters.js';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel w-full max-w-md bg-white p-8 dark:bg-slate-900">
      <div className="mb-2">
        <div className="text-gradient text-3xl font-bold">Welcome back</div>
      </div>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">Sign in to manage team work and collaborate.</p>
      {error && <div className="mb-4 rounded-lg bg-danger-50 p-4 text-sm font-semibold text-danger-700 dark:bg-danger-950 dark:text-danger-200">{error}</div>}
      <form className="grid gap-4" onSubmit={submit}>
        <label className="grid gap-2 text-sm font-semibold">
          Email
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Password
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
        </label>
        <button className="btn-primary mt-2 gap-2" disabled={loading}>
          <LogIn className="h-4 w-4" />
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        New here? <Link className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300" to="/signup">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
