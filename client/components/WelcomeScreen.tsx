import React, { useState, useMemo } from 'react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnterClick = () => {
    setIsExiting(true);
    setTimeout(onEnter, 800);
  };

  const plusSigns = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 8}s`,
      animationDelay: `${Math.random() * 8}s`,
      fontSize: `${Math.random() * 16 + 8}px`,
    }));
  }, []);

  return (
    <>
      <div 
        className={`fixed inset-0 z-50 transition-all duration-1000 ease-in-out
                    ${isExiting ? 'blur-2xl opacity-0' : 'blur-0 opacity-100'}`}
      >
        <div className="absolute inset-0 bg-gray-900 overflow-hidden">
          {plusSigns.map(sign => (
            <span
              key={sign.id}
              className="absolute text-green-500/50 animate-move-up"
              style={{
                left: sign.left,
                fontSize: sign.fontSize,
                animationDuration: sign.animationDuration,
                animationDelay: sign.animationDelay,
              }}
            >
              <i className="fa-solid fa-plus"></i>
            </span>
          ))}
        </div>

        <div className="relative z-10 flex flex-col h-full p-8 text-center text-white">
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="animate-fade-in-down">
              <h1 className="text-7xl md:text-9xl font-bold">
                Sal
                <span className="text-green-500">-</span>
                X
              </h1>
              <p className="text-gray-400 mt-4 text-lg md:text-xl">
                Your Personal Salary & Expense Tracker
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 animate-fade-in-up">
            <button
              onClick={handleEnterClick}
              className="w-full max-w-md mx-auto p-4 bg-green-600 rounded-lg text-xl font-bold
                         hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50
                         transition-all duration-300 transform hover:scale-105"
            >
              Budget Now
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes move-up {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          10%, 90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-10vh);
            opacity: 0;
          }
        }
        .animate-move-up {
          animation: move-up linear infinite;
        }

        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 1s 0.5s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
};
export default WelcomeScreen;