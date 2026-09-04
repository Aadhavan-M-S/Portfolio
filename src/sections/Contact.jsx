import { Reveal } from '../components/Reveal';
import { MagneticButton } from '../components/MagneticButton';
import { SectionHeading } from '../components/SectionHeading';
import { profile } from '../data/profile';
import './Contact.css';

export const Contact = () => {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal>
          <SectionHeading 
            subtitle="Get in Touch"
            title="Let's work together"
            centered
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="contact-content">
            <p className="contact-text">
              I'm currently exploring opportunities in AI engineering and product development. 
              If you're working on intelligent systems or early-stage products, let's talk.
            </p>

            <div className="contact-links">
              <a 
                href={`mailto:${profile.email}`}
                className="contact-link"
              >
                <span className="contact-label">Email</span>
                <span className="contact-value">{profile.email}</span>
              </a>

              <a 
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <span className="contact-label">LinkedIn</span>
                <span className="contact-value">Aadhavan M S</span>
              </a>

              <a 
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <span className="contact-label">GitHub</span>
                <span className="contact-value">Aadhavan-M-S</span>
              </a>
            </div>

            <div className="contact-cta">
              <MagneticButton 
                className="btn btn-primary btn-lg"
                onClick={() => window.location.href = `mailto:${profile.email}`}
              >
                Send an email
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
