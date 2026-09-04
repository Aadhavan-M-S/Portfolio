import { useScrollDepth } from '../hooks/useScrollDepth';
import './ScrollProgress.css';

export const ScrollProgress = () => {
  const scrollDepth = useScrollDepth();

  return (
    <div className="scroll-progress">
      <div 
        className="scroll-progress-bar"
        style={{ transform: `scaleX(${scrollDepth / 100})` }}
      />
    </div>
  );
};
