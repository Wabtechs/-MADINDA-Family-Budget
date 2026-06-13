interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export default function Card({ title, subtitle, children, className = '', footer }: CardProps) {
  return (
    <div className={`card border-0 shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className="card-body pb-0">
          {title && <h5 className="card-title fw-bold mb-1">{title}</h5>}
          {subtitle && <h6 className="card-subtitle text-muted">{subtitle}</h6>}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && (
        <div className="card-footer bg-transparent border-top-0 pt-0">{footer}</div>
      )}
    </div>
  );
}
