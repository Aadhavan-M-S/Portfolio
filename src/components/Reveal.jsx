import { useReveal } from '../hooks/useReveal';

export const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, isVisible] = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
