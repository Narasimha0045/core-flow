import { LoaderCircle } from 'lucide-react';

const Loader = ({
  text = 'Loading...',
  size = 32,
  fullScreen = false
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${
        fullScreen ? 'min-h-screen' : 'min-h-[220px]'
      }`}
    >
      <LoaderCircle
        className="animate-spin text-primary-500"
        size={size}
      />

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {text}
      </p>
    </div>
  );
};

export default Loader;