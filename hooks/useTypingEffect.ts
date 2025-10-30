import { useState, useEffect } from 'react';

const useTypingEffect = (text: string, speed: number = 100): [string, boolean] => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) {
        setDisplayedText('');
        setIsTyping(false);
        return;
    };
    
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        // Use substring for a more robust state update that doesn't rely on the 'prev' value.
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
      setIsTyping(false); 
    };
  }, [text, speed]);

  return [displayedText, isTyping];
};

export default useTypingEffect;
