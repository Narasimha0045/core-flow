import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { formatDate } from '../utils/formatters.js';

const TaskTable = ({ tasks, canManage, onCreate, onEdit, onDelete, onStatusChange }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-300 dark:border-slate-700">
    <table className="w-full min-w-[760px] text-left text-sm">
      <thead className="border-b border-slate-300 bg-gradient-to-r from-slate-50 to-blue-50 text-xs font-bold uppercase text-slate-700 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-slate-300">
        <tr>
          <th className="px-5 py-4">Task</th>
          <th className="px-5 py-4">Assignee</th>
          <th className="px-5 py-4">Due</th>
          <th className="px-5 py-4">Priority</th>
          <th className="px-5 py-4">Status</th>
          {canManage && <th className="px-5 py-4 text-right">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id} className="border-b border-slate-200 transition-smooth hover:bg-blue-50/50 dark:border-slate-700 dark:hover:bg-slate-800/50">
            <td className="px-5 py-5">
              <div className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</div>
              <div className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{task.description}</div>
            </td>
            <td className="px-5 py-5 text-slate-700 dark:text-slate-300">{task.assignedTo?.name}</td>
            <td className="px-5 py-5 text-slate-700 dark:text-slate-300">{formatDate(task.dueDate)}</td>
            <td className="px-5 py-5"><StatusBadge type="priority">{task.priority}</StatusBadge></td>
            <td className="px-5 py-5">
              <select className="input w-40 text-sm" value={task.status} onChange={(e) => onStatusChange(task._id, e.target.value)}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </td>
            {canManage && (
              <td className="px-5 py-5">
                <div className="flex justify-end gap-2">
                  <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-smooth" onClick={() => onEdit(task)} aria-label="Edit task">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/30 transition-smooth" onClick={() => onDelete(task._id)} aria-label="Delete task">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
        {tasks.length === 0 && (
          <tr>
            <td className="px-5 py-12 text-center text-slate-500 dark:text-slate-400" colSpan={canManage ? 6 : 5}>
              <div className="grid justify-items-center gap-3">
                <span className="font-medium">No tasks found.</span>
                {canManage && onCreate && (
                  <button className="btn-primary" onClick={onCreate}>
                    Create first task
                  </button>
                )}
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default TaskTable;
