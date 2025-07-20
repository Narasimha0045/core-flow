const RoleBadge = ({ role }) => {
  const isAdmin = role === 'Admin';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
        isAdmin
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
      }`}
    >
      {role}
    </span>
  );
};

export default RoleBadge;
