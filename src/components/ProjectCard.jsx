import { useState } from 'react';
import './ProjectCard.css';

export const ProjectCard = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="project-card">
      <div className="project-card-header">
        <div className="project-card-meta">
          <span className="project-year">{project.year}</span>
          {project.featured && <span className="project-badge">Featured</span>}
        </div>
        
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-subtitle">{project.subtitle}</p>
      </div>

      <div className="project-card-body">
        <div className="project-section">
          <h4 className="project-label">Problem</h4>
          <p className="project-text">{project.problem}</p>
        </div>

        <div className="project-section">
          <h4 className="project-label">Solution</h4>
          <p className="project-text">{project.solution}</p>
        </div>

        {isExpanded && (
          <div className="project-expanded">
            <div className="project-section">
              <h4 className="project-label">Key Contributions</h4>
              <ul className="project-list">
                {project.impact.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="project-section">
              <h4 className="project-label">Technologies</h4>
              <div className="project-tags">
                {project.tech.map((tech) => (
                  <span key={tech} className="project-tag">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="project-card-footer">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-link"
        >
          {isExpanded ? 'Show less' : 'Read more'} →
        </button>
        
        <a 
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm"
        >
          View on GitHub
        </a>
      </div>
    </article>
  );
};
