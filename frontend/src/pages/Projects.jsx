import { FolderKanban, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import RoleBadge from '../components/RoleBadge.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getErrorMessage } from '../utils/formatters.js';

const Projects = () => {
  const { data: projectsData, setData, loading, error } = useAsync(async () => {
    const response = await api.get('/projects');
    return response.data;
  }, []);
  const projects = projectsData || [];
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');

  const createProject = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/projects', form);
      setData([data, ...projects]);
      setModalOpen(false);
      setForm({ name: '', description: '' });
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  return (
    <>
      <PageHeader
        title="Projects"
        description="Create projects and invite teammates by email."
        action={<button className="btn-primary" onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />New project</button>}
      />
      {loading && <div className="text-slate-600 dark:text-slate-400">Loading projects...</div>}
      {error && <div className="rounded-lg bg-danger-50 p-4 text-danger-700 dark:bg-danger-950 dark:text-danger-200 font-semibold">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link key={project._id} className="panel p-6 transition-smooth hover:-translate-y-1 hover:shadow-xl group cursor-pointer border-l-4 border-l-primary-500" to={`/projects/${project._id}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h2 className="text-lg font-bold group-hover:text-primary-600 transition-smooth">{project.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{project.description || 'No description added.'}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <RoleBadge role={project.role} />
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-200">{project.members.length} members</span>
              </div>
            </div>
            <div className="mt-5 border-t border-slate-200 pt-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">Admin: <span className="font-semibold">{project.admin?.name}</span></div>
          </Link>
        ))}
      </div>
      {!loading && projects.length === 0 && <div className="panel p-12 text-center">
        <div className="grid justify-items-center gap-3">
          <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
            <FolderKanban className="h-6 w-6 text-slate-500" />
          </div>
          <div>
            <p className="font-semibold">No projects yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Create your first project to get started</p>
          </div>
        </div>
      </div>}
      {modalOpen && (
        <Modal title="Create project" onClose={() => setModalOpen(false)}>
          {formError && <div className="mb-4 rounded-lg bg-danger-50 p-4 text-sm font-semibold text-danger-700 dark:bg-danger-950 dark:text-danger-200">{formError}</div>}
          <form className="grid gap-5" onSubmit={createProject}>
            <label className="grid gap-2 text-sm font-semibold">
              Project Name
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter project name" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Description
              <textarea className="input min-h-32 resize-none rounded-lg" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your project..." />
            </label>
            <button className="btn-primary">Create project</button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default Projects;
