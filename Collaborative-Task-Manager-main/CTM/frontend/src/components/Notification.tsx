export const Notification = ({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm rounded-2xl border border-sky-100 bg-white shadow-xl shadow-sky-100/50 px-4 py-3 text-sm text-slate-800">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow-inner shadow-sky-200" />
        <div className="flex-1">
          <p className="font-semibold text-slate-900">New assignment</p>
          <p className="text-slate-600">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};
