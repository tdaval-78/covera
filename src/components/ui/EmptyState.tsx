import { LucideIcon } from 'lucide-react';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'var(--brand-light)' }}
      >
        {Icon && <Icon size={28} style={{ color: 'var(--brand)' }} />}
      </div>
      <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn btn-brand btn-lg mt-6">
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
        className="rounded-full"
        style={{
          width: size,
          height: size,
          border: '2px solid rgba(91,76,245,0.2)',
          borderTopColor: 'var(--brand)',
          animation: 'spin 0.65s linear infinite',
        }}
      />
      {text && <p className="text-sm">{text}</p>}
    </div>
  );
}
