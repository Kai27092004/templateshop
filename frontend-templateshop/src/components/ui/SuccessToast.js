import React, { useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SuccessToast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] bg-white shadow-lg rounded-lg p-4 flex items-center animate-fade-in-down">
      <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
      <p className="text-sm text-gray-800">{message}</p>
      <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
export default SuccessToast;