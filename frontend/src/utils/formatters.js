export const formatDate = (value) => {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(value)
  );
};

export const toInputDate = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
};

export const getErrorMessage = (error) => {
  const details = error.response?.data?.errors;
  if (details?.length) return details[0].message;
  return error.response?.data?.message || error.message || 'Something went wrong';
};

export const statusColor = {
  'To Do': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 font-semibold',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 font-semibold',
  Done: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 font-semibold'
};

export const priorityColor = {
  Low: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100 font-semibold',
  Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 font-semibold',
  High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 font-semibold'
};
