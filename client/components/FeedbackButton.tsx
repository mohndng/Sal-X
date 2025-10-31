import React from 'react';

interface FeedbackButtonProps {
  onOpen: () => void;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center
                 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50
                 transition-all duration-300 transform hover:scale-110"
      title="Send Feedback"
      aria-label="Open feedback form"
    >
      <i className="fas fa-comment-dots fa-lg"></i>
    </button>
  );
};

export default FeedbackButton;
