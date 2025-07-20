import { Plus, UserMinus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import RoleBadge from '../components/RoleBadge.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskTable from '../components/TaskTable.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getErrorMessage } from '../utils/formatters.js';

const ProjectDetails = () => {
  const { id } = useParams();
  const [taskModal, setTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [notice, setNotice] = useState('');

  const { data: project, setData: setProject, loading, error, refresh: refreshProject } = useAsync(async () => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  }, [id]);

  const { data: tasksData, setData: setTasks, refresh: refreshTasks } = useAsync(async () => {
    const response = await api.get(`/tasks/project/${id}`);
    return response.data;
  }, [id]);
  const tasks = tasksData || [];

  const isAdmin = project?.role === 'Admin';

  const addMember = async (event) => {
    event.preventDefault();
    setNotice('');
    try {
      const { data } = await api.put(`/projects/${id}/members`, { email: memberEmail });
      setProject({ ...project, members: data.members });
      setMemberEmail('');
    } catch (err) {
      setNotice(getErrorMessage(err));
    }
  };

  const removeMember = async (userId) => {
    const { data } = await api.delete(`/projects/${id}/members/${userId}`);
    setProject({ ...project, members: data.members });
    refreshTasks();
  };

  const saveTask = async (payload) => {
    if (editingTask) {
      const { data } = await api.put(`/tasks/${editingTask._id}`, payload);
      setTasks(tasks.map((task) => (task._id === data._id ? data : task)));
    } else {
      const { data } = await api.post('/tasks', payload);
      setTasks([data, ...tasks]);
      refreshProject();
    }
    setTaskModal(false);
    setEditingTask(null);
  };

  const updateStatus = async (taskId, status) => {
    const { data } = await api.patch(`/tasks/${taskId}/status`, { status });
    setTasks(tasks.map((task) => (task._id === data._id ? data : task)));
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    setTasks(tasks.filter((task) => task._id !== taskId));
    refreshProject();
  };

  if (loading) return <div className="text-slate-600 dark:text-slate-400">Loading project...</div>;
  if (error) return <div className="rounded-lg bg-danger-50 p-4 text-danger-700 dark:bg-danger-950 dark:text-danger-200 font-semibold">{error}</div>;

  return (
    <>
      <PageHeader
        title={project.name}
        description={`${project.members.length} members | ${project.taskCount} tasks`}
        action={isAdmin && <button className="btn-primary" onClick={() => setTaskModal(true)}><Plus className="h-4 w-4" />New task</button>}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="panel overflow-hidden">
          <div className="border-b border-slate-300 bg-gradient-to-r from-slate-50 to-blue-50 p-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold text-lg">Tasks</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-600 dark:text-slate-400">Your role:</span>
                <RoleBadge role={project.role} />
              </div>
            </div>
          </div>
          <TaskTable
            tasks={tasks}
            canManage={isAdmin}
            onCreate={() => setTaskModal(true)}
            onEdit={(task) => { setEditingTask(task); setTaskModal(true); }}
            onDelete={deleteTask}
            onStatusChange={updateStatus}
          />
        </section>
        <aside className="grid gap-6 content-start">
          <section className="panel p-6">
            <h2 className="font-bold mb-3">Description</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{project.description || 'No description added.'}</p>
          </section>
          <section className="panel p-6">
            <h2 className="font-bold mb-4">Members</h2>
            {notice && <div className="mb-4 rounded-lg bg-danger-50 p-3 text-sm font-semibold text-danger-700 dark:bg-danger-950 dark:text-danger-200">{notice}</div>}
            {isAdmin && (
              <form className="mb-4 flex gap-2" onSubmit={addMember}>
                <input className="input flex-1" type="email" placeholder="member@email.com" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required />
                <button className="btn-primary px-3" aria-label="Add member" title="Add member"><UserPlus className="h-4 w-4" /></button>
              </form>
            )}
            <div className="grid gap-2">
              {project.members.map((member) => (
                <div key={member._id} className="flex items-center justify-between rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 p-4 dark:from-slate-800 dark:to-slate-900">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-semibold">{member.name}</div>
                      <RoleBadge role={project.admin._id === member._id ? 'Admin' : 'Member'} />
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{member.email}</div>
                  </div>
                  {isAdmin && project.admin._id !== member._id && (
                    <button className="rounded-lg p-2 text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/30 transition-smooth" onClick={() => removeMember(member._id)} aria-label="Remove member" title="Remove member">
                      <UserMinus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
      {taskModal && (
        <Modal title={editingTask ? 'Edit task' : 'Create task'} onClose={() => { setTaskModal(false); setEditingTask(null); }}>
          <TaskForm
            members={project.members}
            projectId={project._id}
            initial={editingTask || {}}
            submitLabel={editingTask ? 'Update task' : 'Create task'}
            onSubmit={saveTask}
          />
        </Modal>
      )}
    </>
  );
};

export default ProjectDetails;
