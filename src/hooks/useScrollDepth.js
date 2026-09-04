import { useEffect, useState } from 'react';

export const useScrollDepth = () => {
  const [scrollDepth, setScrollDepth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const maxScroll = documentHeight - windowHeight;
      const depth = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      
      setScrollDepth(Math.min(100, Math.max(0, depth)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollDepth;
};
