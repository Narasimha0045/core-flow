const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
    <div className="panel w-full max-w-2xl">
      <div className="flex items-center justify-between border-b border-slate-300 px-6 py-4 dark:border-slate-700">
        <h2 className="text-lg font-bold text-gradient">{title}</h2>
        <button className="rounded-lg px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-smooth" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export default Modal;
