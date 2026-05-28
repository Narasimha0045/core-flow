import { useState } from 'react';
import { toInputDate } from '../utils/formatters.js';

const TaskForm = ({ members = [], initial = {}, projectId, onSubmit, submitLabel = 'Save task', loading }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    dueDate: toInputDate(initial.dueDate) || '',
    priority: initial.priority || 'Medium',
    status: initial.status || 'To Do',
    assignedTo: initial.assignedTo?._id || initial.assignedTo || members[0]?._id || '',
    project: projectId || initial.project?._id || initial.project || ''
  });

  const setValue = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
      <label className="grid gap-2 text-sm font-semibold">
        Task Title
        <input className="input" value={form.title} onChange={(e) => setValue('title', e.target.value)} placeholder="What needs to be done?" required />
      </label>

      <label className="grid gap-2 text-sm font-semibold">
        Description
        <textarea className="input min-h-24 resize-none rounded-lg" value={form.description} onChange={(e) => setValue('description', e.target.value)} placeholder="Add more details about this task..." />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Due date
          <input className="input" type="date" value={form.dueDate} onChange={(e) => setValue('dueDate', e.target.value)} required />
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Assign to
          <select className="input" value={form.assignedTo} onChange={(e) => setValue('assignedTo', e.target.value)} required>
            {members.map((member) => (
              <option key={member._id} value={member._id}>{member.name}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Priority
          <select className="input" value={form.priority} onChange={(e) => setValue('priority', e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Status
          <select className="input" value={form.status} onChange={(e) => setValue('status', e.target.value)}>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </label>
      </div>

      <button className="btn-primary" disabled={loading || members.length === 0}>
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Saving...
          </span>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
};

export default TaskForm;