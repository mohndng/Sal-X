import React from 'react';
import ThemeToggle from './ThemeToggle';
import { UserProfile } from '../types';
import useTypingEffect from '../hooks/useTypingEffect';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    userProfile: UserProfile;
    onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, userProfile, onProfileClick }) => {
  const isPersonalized = userProfile.name && userProfile.name !== 'Sal-X User';

  // Determine which texts to use
  const nameToType = isPersonalized ? `${userProfile.name}!` : '';
  const subheadingToType = isPersonalized ? "Let's manage your finances." : 'Your Personal Salary & Expense Tracker';

  // Apply typing effect hooks
  const [typedName, isNameTyping] = useTypingEffect(nameToType, 120);
  const [typedSubheading, isSubheadingTyping] = useTypingEffect(subheadingToType, 40);

  return (
    <>
      <header className="py-6 md:py-8 relative flex items-center justify-between">
          <div className="absolute top-4 left-0">
              <button 
                  onClick={onProfileClick}
                  className="p-0 w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition-all duration-300 overflow-hidden"
                  aria-label="Open user profile"
                  title="View Profile"
              >
                  {userProfile.profilePictureUrl ? (
                      <img src={userProfile.profilePictureUrl} alt="User Profile" className="w-full h-full object-cover" />
                  ) : (
                      <i className="fas fa-user"></i>
                  )}
              </button>
          </div>
          <div className="text-center flex-grow">
            {isPersonalized ? (
                 <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white h-12 md:h-16 flex items-center justify-center">
                    <span>Hi,&nbsp;</span>
                    <span className="text-green-500 dark:text-green-400">{typedName}</span>
                    {isNameTyping && <span className="blinking-cursor text-green-500 dark:text-green-400 text-4xl md:text-5xl">|</span>}
                 </h1>
            ) : (
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white h-12 md:h-16 flex items-center justify-center">
                    Sal
                    <span className="text-green-500 dark:text-green-400">-</span>
                    X
                </h1>
            )}
           
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm md:text-base h-6 md:h-7">
                {isPersonalized ? (
                  <>
                    {typedSubheading}
                    {isSubheadingTyping && <span className="blinking-cursor">|</span>}
                  </>
                ) : (
                  subheadingToType
                )}
            </p>
          </div>
          <div className="absolute top-4 right-0">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
      </header>
       <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
        .blinking-cursor {
          font-weight: 300;
          animation: blink 1s step-end infinite;
          position: relative;
          top: -0.05em;
        }
      `}</style>
    </>
  );
};

export default Header;
