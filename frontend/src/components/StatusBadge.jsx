import { priorityColor, statusColor } from '../utils/formatters.js';

const StatusBadge = ({ children, type = 'status' }) => {
  const palette = type === 'priority' ? priorityColor : statusColor;
  return (
    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${palette[children]}`}>
      {children}
    </span>
  );
};

export default StatusBadge;
