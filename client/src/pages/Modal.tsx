import { useRef, useEffect, ReactNode } from 'react';
import './Modal.css';

type Props = {
  children: ReactNode;
  isOpen: boolean | undefined;
  onClose: () => void;
};

export function Modal({ children, isOpen, onClose }: Props) {
  const modal = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      modal.current?.showModal();
    } else {
      modal.current?.close();
    }
  }, [isOpen]);

  if (!isOpen) return null; // Don't render the modal or overlay if it's not open

  return (
    <div className="modal-overlay">
      <dialog className="journal-card" onClose={onClose} ref={modal}>
        {children}
      </dialog>
    </div>
  );
}
