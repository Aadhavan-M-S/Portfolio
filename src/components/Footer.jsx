import { profile } from '../data/profile';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-links">
            <a 
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              LinkedIn
            </a>
            <a 
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              GitHub
            </a>
            <a 
              href={`mailto:${profile.email}`}
              className="footer-link"
            >
              Email
            </a>
          </div>
          
          <p className="footer-copy">
            © {new Date().getFullYear()} {profile.name}. Built with React.
          </p>
        </div>
      </div>
    </footer>
  );
};
