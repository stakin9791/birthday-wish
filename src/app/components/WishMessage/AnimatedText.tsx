import { useState, useEffect, useRef } from 'react';

export function AnimatedText({ text = '', speed = 50, onComplete }: { text?: string; speed?: number; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    completedRef.current = false;
  }, [text]);

  useEffect(() => {
    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (!text) return;
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (!completedRef.current) {
      completedRef.current = true;
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }
  }, [currentIndex, text, speed]);

  return (
    <span className="inline-block">
      {displayedText}
      <span className={`inline-block w-0.5 h-[1.2em] bg-current ml-1 align-middle transition-opacity ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
    </span>
  );
}
