interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeMap: Record<string, { width: string; height: string; border: string }> = {
  sm: { width: '1.25rem', height: '1.25rem', border: '2px' },
  md: { width: '2.5rem', height: '2.5rem', border: '3px' },
  lg: { width: '4rem', height: '4rem', border: '4px' },
};

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const s = sizeMap[size];
  return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-3 p-4">
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: s.width, height: s.height, borderWidth: s.border }}
      />
      {text && <span className="text-muted">{text}</span>}
    </div>
  );
}
