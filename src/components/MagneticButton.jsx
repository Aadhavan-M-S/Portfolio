import { useMagnetic } from '../hooks/useMagnetic';

export const MagneticButton = ({ children, strength = 0.3, className = '', ...props }) => {
  const ref = useMagnetic(strength);

  return (
    <button ref={ref} className={`btn-magnetic ${className}`} {...props}>
      {children}
    </button>
  );
};
