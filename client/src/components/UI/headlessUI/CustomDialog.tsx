import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '../Btns/Button';

type CustomDialogTypes = {
  children: React.ReactNode;
  isOpen: boolean;
  changeIsOpen: () => void;
  title?: string | null;
  description?: string | null;
  isLoading?: boolean;
  hasFailed?: boolean;
  changeHasFailed?: () => void | null;
  isSuccess?: boolean;
};

const defaultPropsValues = {
  title: null,
  description: null,
  isLoading: false,
  hasFailed: false,
  changeHasFailed: null,
  isSuccess: false,
};

export default function CustomDialog({
  children,
  isOpen,
  changeIsOpen,
  title,
  description,
  isLoading,
  hasFailed,
  changeHasFailed,
  isSuccess,
}: CustomDialogTypes) {
  const changeHasFailedHandler = () => {
    if (changeHasFailed) {
      changeHasFailed();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        onClose={changeIsOpen}
        className="fixed inset-0 z-40 w-screen"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-transparentGray" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="relative left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-3 py-4 pt-7">
            <button
              type="button"
              className="absolute right-[10px] top-[10px] text-gray-500 transition hover:text-gray-600"
              onClick={changeIsOpen}
            >
              <span className="sr-only">Dismiss popup</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {isLoading && <div>Loading...</div>}
            {hasFailed && (
              <div>
                <Dialog.Title className="m-0 text-lg font-medium text-red-500 ">
                  Failed!
                </Dialog.Title>
                <Dialog.Description className="mb-6 mt-3 text-[16px] leading-normal text-gray-600">
                  Press &quot;Try again&quot; to go back to form.
                </Dialog.Description>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="primary"
                    onClick={() => changeHasFailedHandler()}
                  >
                    Try again
                  </Button>

                  <div className="flex justify-center">
                    <Button variant="danger" onClick={() => changeIsOpen()}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {isSuccess && (
              <div>
                <h5>Success!</h5>
                <div className="flex justify-center">
                  <Button variant="primary" onClick={() => changeIsOpen()}>
                    Close
                  </Button>
                </div>
              </div>
            )}
            {!isLoading && !hasFailed && !isSuccess && (
              <>
                {title && (
                  <Dialog.Title className="m-0 text-lg font-medium text-dark">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="mb-4 mt-2 text-[16px] leading-normal text-gray-600">
                    {description}
                  </Dialog.Description>
                )}
                <div className="h-full max-h-[65vh] w-full overflow-y-auto overflow-x-hidden pl-1 pr-3">
                  {children}
                </div>
              </>
            )}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

CustomDialog.defaultProps = defaultPropsValues;
