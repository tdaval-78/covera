import { LucideIcon, Package } from 'lucide-react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  const Icon: LucideIcon = icon || Package;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mb-5 shadow-sm">
        <Icon size={36} className="text-indigo-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary mt-6 px-6 py-3 rounded-xl font-semibold text-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function LoadingSpinner({ size = 24, text = '' }: { size?: number; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className="rounded-full border-2 border-indigo-200 border-t-indigo-600"
        style={{
          width: size,
          height: size,
          animation: 'spin 0.7s linear infinite',
        }}
      />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
}

export function Toast({
  message,
  type = 'success',
  onClose,
}: {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`toast flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[type]} shadow-lg`}>
      <p className="text-sm font-medium">{message}</p>
      {onClose && (
        <button onClick={onClose} className="ml-auto opacity-60 hover:opacity-100 text-lg leading-none">&times;</button>
      )}
    </div>
  );
}
