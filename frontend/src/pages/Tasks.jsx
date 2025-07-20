import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';
import PageHeader from '../components/PageHeader.jsx';
import RoleBadge from '../components/RoleBadge.jsx';
import TaskTable from '../components/TaskTable.jsx';
import { useAsync } from '../hooks/useAsync.js';

const Tasks = () => {
  const [projectId, setProjectId] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const { data: projectsData, loading: loadingProjects } = useAsync(async () => {
    const response = await api.get('/projects');
    return response.data;
  }, []);
  const projects = projectsData || [];

  useEffect(() => {
    if (!projectId && projects.length > 0) {
      setProjectId(projects[0]._id);
    }
  }, [projects, projectId]);

  const selectedProject = useMemo(() => projects.find((project) => project._id === projectId), [projects, projectId]);
  const currentUserId = JSON.parse(localStorage.getItem('user') || '{}')._id;
  const selectedRole = selectedProject?.admin?._id === currentUserId ? 'Admin' : 'Member';

  const query = new URLSearchParams();
  if (filters.status) query.set('status', filters.status);
  if (filters.priority) query.set('priority', filters.priority);
  if (filters.search) query.set('search', filters.search);

  const { data: tasksData, setData: setTasks, loading, refresh } = useAsync(async () => {
    if (!projectId) return [];
    const response = await api.get(`/tasks/project/${projectId}?${query.toString()}`);
    return response.data;
  }, [projectId, filters.status, filters.priority, filters.search]);
  const tasks = tasksData || [];

  const updateStatus = async (taskId, status) => {
    const { data } = await api.patch(`/tasks/${taskId}/status`, { status });
    setTasks(tasks.map((task) => (task._id === data._id ? data : task)));
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    setTasks(tasks.filter((task) => task._id !== taskId));
    refresh();
  };

  return (
    <>
      <PageHeader title="Tasks" description="Filter and update work across your projects." />
      <section className="panel mb-6 p-6">
        {selectedProject && (
          <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg bg-primary-50 p-3 text-sm dark:bg-primary-900/20">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Your role:</span>
            <RoleBadge role={selectedRole} />
          </div>
        )}
        <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_1.4fr]">
          <select className="input" value={projectId} onChange={(e) => setProjectId(e.target.value)} disabled={loadingProjects}>
            {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
          </select>
          <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <select className="input" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">All priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input className="input pl-9" placeholder="Search title" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </label>
        </div>
      </section>
      <section className="panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading tasks...</div>
        ) : (
          <TaskTable
            tasks={tasks}
            canManage={false}
            onEdit={() => {}}
            onDelete={deleteTask}
            onStatusChange={updateStatus}
          />
        )}
      </section>
    </>
  );
};

export default Tasks;
