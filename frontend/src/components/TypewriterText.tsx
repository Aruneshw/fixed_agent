import React, { useState, useEffect, useRef } from 'react';

/**
 * TypewriterText — Text appears one character at a time, pauses,
 * then clears and retypes the next phrase in a loop.
 */

interface TypewriterTextProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorColor?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  phrases,
  typingSpeed = 60,
  deletingSpeed = 35,
  pauseDuration = 2000,
  className = '',
  cursorColor = '#f2b968',
}) => {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    const tick = () => {
      if (!isDeleting) {
        // Typing forward
        const nextText = currentPhrase.slice(0, displayText.length + 1);
        setDisplayText(nextText);

        if (nextText === currentPhrase) {
          // Finished typing — pause before deleting
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration);
          return;
        }
        timeoutRef.current = setTimeout(tick, typingSpeed + Math.random() * 40);
      } else {
        // Deleting backward
        const nextText = currentPhrase.slice(0, displayText.length - 1);
        setDisplayText(nextText);

        if (nextText === '') {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          timeoutRef.current = setTimeout(tick, typingSpeed);
          return;
        }
        timeoutRef.current = setTimeout(tick, deletingSpeed);
      }
    };

    timeoutRef.current = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayText, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      <span
        className="inline-block w-[2px] h-[1em] ml-[2px] align-text-bottom animate-[cursor-blink_0.8s_steps(2)_infinite]"
        style={{ backgroundColor: cursorColor }}
      />
    </span>
  );
};

export default TypewriterText;
