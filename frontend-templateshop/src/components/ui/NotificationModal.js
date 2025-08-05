import React, { useEffect } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const NotificationModal = ({ show, message, type = 'success', onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500); // Tự động đóng sau 2 giây
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-100' : 'bg-yellow-100';
  const iconColor = isSuccess ? 'text-green-500' : 'text-yellow-500';
  const IconComponent = isSuccess ? CheckCircleIcon : ExclamationTriangleIcon;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[100]">
      <div className={`flex flex-col items-center gap-4 p-8 rounded-2xl shadow-lg ${bgColor} max-w-sm mx-4 animate-fade-in-down`}>
        <IconComponent className={`h-16 w-16 ${iconColor}`} />
        <p className="text-center font-medium text-gray-800">{message}</p>
      </div>
    </div>
  );
};
export default NotificationModal;