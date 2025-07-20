import { AlertTriangle, CheckCircle2, Circle, Clock3, Users } from 'lucide-react';
import api from '../api/axios.js';
import PageHeader from '../components/PageHeader.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { formatDate } from '../utils/formatters.js';

const Dashboard = () => {
  const { data, loading, error } = useAsync(async () => {
    const response = await api.get('/dashboard');
    return response.data;
  }, []);

  if (loading) return <div className="text-slate-500">Loading dashboard...</div>;
  if (error) return <div className="rounded-md bg-rose-50 p-4 text-rose-700">{error}</div>;

  const cards = [
    { label: 'Total tasks', value: data.totalTasks, icon: Circle },
    { label: 'To Do', value: data.byStatus['To Do'], icon: Clock3 },
    { label: 'In Progress', value: data.byStatus['In Progress'], icon: AlertTriangle },
    { label: 'Done', value: data.byStatus.Done, icon: CheckCircle2 }
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="A quick overview of your assigned and created work." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="panel p-6 hover:shadow-lg transition-smooth hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{label}</p>
              <Icon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="mt-4 text-4xl font-bold bg-gradient-to-r from-primary-600 to-brand-500 bg-clip-text text-transparent">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="panel p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-primary-100 p-2 dark:bg-primary-900">
              <Users className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="font-bold text-lg">Tasks per user</h2>
          </div>
          <div className="grid gap-3">
            {data.tasksPerUser.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No assigned tasks yet.</p>}
            {data.tasksPerUser.map((item) => (
              <div key={item.userId} className="flex items-center justify-between rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 p-4 dark:from-slate-800 dark:to-slate-900">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{item.email}</div>
                </div>
                <div className="rounded-full bg-primary-100 px-3 py-1 text-lg font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-200">{item.count}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="panel p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-danger-100 p-2 dark:bg-danger-900">
              <AlertTriangle className="h-5 w-5 text-danger-600" />
            </div>
            <h2 className="font-bold text-lg">Overdue tasks</h2>
          </div>
          <div className="grid gap-3">
            {data.overdueTasks.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">Nothing overdue.</p>}
            {data.overdueTasks.map((task) => (
              <div key={task._id} className="rounded-lg border border-danger-200 bg-danger-50 p-4 dark:border-danger-800 dark:bg-danger-900/20">
                <div className="font-semibold text-danger-900 dark:text-danger-100">{task.title}</div>
                <div className="mt-1 text-sm text-danger-700 dark:text-danger-200">
                  {task.project?.name} · {task.assignedTo?.name} · due {formatDate(task.dueDate)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
