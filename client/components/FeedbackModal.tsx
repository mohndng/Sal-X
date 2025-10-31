import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, userProfile }) => {
  const [name, setName] = useState(userProfile.name !== 'Sal-X User' ? userProfile.name : '');
  const [email, setEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Pre-fill name if it's not the default, otherwise leave it empty for the user to fill
      setName(userProfile.name !== 'Sal-X User' ? userProfile.name : '');
      // Reset other fields
      setEmail('');
      setFeedbackType('General Inquiry');
      setMessage('');
      setError('');
    }
  }, [isOpen, userProfile]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('The message field cannot be empty.');
      return;
    }
    setError('');

    const recipient = 'monding.torneado@gmail.com';
    const subject = `Sal-X Feedback: ${feedbackType}`;
    const body = `
Hello,

${message.trim()}

--------------------------------
From: ${name || 'Not Provided'}
Email: ${email || 'Not Provided'}
App Version: Sal-X v1.0
    `;

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.trim())}`;
    
    // Open the user's default email client
    window.location.href = mailtoLink;

    // Close the modal after attempting to open the email client
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/75 dark:bg-black/75 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-dialog-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 animate-fade-in-up border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
            <h3 id="feedback-dialog-title" className="text-xl font-bold text-gray-900 dark:text-white">Send Feedback</h3>
            <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" aria-label="Close feedback form">
                <i className="fas fa-times fa-lg"></i>
            </button>
        </div>

        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jane Doe"
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your Email (Optional)</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="For a direct reply"
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Feedback Type</label>
            <select
              id="feedbackType"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            >
              <option>General Inquiry</option>
              <option>Bug Report</option>
              <option>Feature Request</option>
              <option>Compliment</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me what you think..."
              rows={5}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              required
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md font-semibold bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md font-semibold text-white transition-colors bg-green-600 hover:bg-green-700"
            >
              <i className="fas fa-paper-plane mr-2"></i>Send Feedback
            </button>
          </div>
        </form>
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
};

export default FeedbackModal;
