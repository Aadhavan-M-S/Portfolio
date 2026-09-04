import './SectionHeading.css';

export const SectionHeading = ({ title, subtitle, centered = false }) => {
  return (
    <div className={`section-heading ${centered ? 'centered' : ''}`}>
      {subtitle && <span className="section-subtitle">{subtitle}</span>}
      <h2 className="section-title">{title}</h2>
    </div>
  );
};
