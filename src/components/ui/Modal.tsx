import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<string, string> = {
  sm: 'modal-sm',
  md: '',
  lg: 'modal-lg',
};

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className={`modal-dialog modal-dialog-centered ${sizeClasses[size]}`} role="document">
          <div className="modal-content border-0 shadow">
            {title && (
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">{title}</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
              </div>
            )}
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
