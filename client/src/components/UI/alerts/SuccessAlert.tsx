import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

export default function SuccessAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-gray-100 bg-white p-4 shadow-xl"
    >
      <div className="flex items-start gap-4">
        <span className="text-green-600">
          <CheckCircleIcon className="h-6 w-6" />
        </span>

        <div className="flex-1">
          <strong className="block font-medium text-gray-900">
            Changes saved
          </strong>

          <p className="mt-1 text-sm text-gray-700">
            Your product changes have been saved.
          </p>
        </div>

        <button
          type="button"
          className="text-gray-500 transition hover:text-gray-600"
        >
          <span className="sr-only">Dismiss popup</span>
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
