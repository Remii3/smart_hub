import { createPortal } from 'react-dom';
import CloseIcon from '../../../assets/icons/CloseIcon';

function Modal({
  isOpen,
  children,
  onClose,
}: {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-30 bg-dark opacity-70"
        onClick={() => onClose()}
        aria-hidden="true"
      />
      <div className="fixed left-1/2 top-1/3 z-30 min-h-[15vh] -translate-x-1/2 -translate-y-1/2 rounded-md border bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Close modal button"
            onClick={() => onClose()}
            className="rounded text-gray-600 transition ease-out hover:text-gray-700 focus:ring focus:ring-gray-400 active:text-gray-800 dark:hover:text-gray-500  dark:active:text-gray-400"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </>,
    document.getElementById('overlay') as HTMLElement
  );
}

export default Modal;
