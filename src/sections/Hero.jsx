import { MagneticButton } from '../components/MagneticButton';
import { HeroGraphic } from '../components/HeroGraphic';
import { profile } from '../data/profile';
import './Hero.css';

export const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero">
      <HeroGraphic />
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title stagger">
              {profile.tagline}
            </h1>
            
            <div className="hero-bio stagger">
              {profile.bio.map((paragraph, index) => (
                <p key={index} className="hero-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="hero-actions stagger">
              <MagneticButton 
                className="btn btn-primary btn-lg"
                onClick={scrollToContact}
              >
                Get in touch
              </MagneticButton>
              
              <a 
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                View GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
