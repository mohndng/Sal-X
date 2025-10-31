import React from 'react';

interface InstallPWA_ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
}

const InstallPWA_Modal: React.FC<InstallPWA_ModalProps> = ({ isOpen, onClose, onInstall }) => {
    if (!isOpen) return null;

    return (
    <div 
      className="fixed inset-0 bg-gray-900/75 dark:bg-black/75 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in-up border border-gray-200 dark:border-gray-700">
        <h3 id="dialog-title" className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <i className="fas fa-download text-green-500 dark:text-green-400 mr-3"></i>
            Install Sal-X App
        </h3>
        <div className="text-gray-600 dark:text-gray-300 mb-6 space-y-2">
            <p>For the best experience, add Sal-X to your home screen.</p>
            <p className="font-semibold">It's fast, works offline, and feels just like a regular app!</p>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md font-semibold bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white transition-colors"
          >
            Later
          </button>
          <button
            onClick={onInstall}
            className="px-4 py-2 rounded-md font-semibold text-white transition-colors bg-green-600 hover:bg-green-700"
          >
            <i className="fas fa-rocket mr-2"></i>Install
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default InstallPWA_Modal;
