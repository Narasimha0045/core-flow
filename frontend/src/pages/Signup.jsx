import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/formatters.js';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(form);
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
        <div className="text-gradient text-3xl font-bold">Create account</div>
      </div>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">Start a collaborative workspace in under a minute.</p>
      {error && <div className="mb-4 rounded-lg bg-danger-50 p-4 text-sm font-semibold text-danger-700 dark:bg-danger-950 dark:text-danger-200">{error}</div>}
      <form className="grid gap-4" onSubmit={submit}>
        <label className="grid gap-2 text-sm font-semibold">
          Name
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Email
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Password
          <input className="input" type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
        </label>
        <button className="btn-primary mt-2 gap-2" disabled={loading}>
          <UserPlus className="h-4 w-4" />
          {loading ? 'Creating...' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account? <Link className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300" to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default Signup;
