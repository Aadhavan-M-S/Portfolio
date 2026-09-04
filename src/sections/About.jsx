import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { about } from '../data/about';
import './About.css';

export const About = () => {
  return (
    <section id="about" className="section about">
      <div className="container">
        <Reveal>
          <SectionHeading 
            subtitle="Background"
            title="About"
          />
        </Reveal>

        <div className="about-content">
          <Reveal delay={100}>
            <div className="about-intro">
              {about.intro.map((paragraph, index) => (
                <p key={index} className="about-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <div className="about-areas">
            {about.areas.map((area, index) => (
              <Reveal key={area.title} delay={200 + index * 100}>
                <div className="about-area">
                  <h3 className="about-area-title">{area.title}</h3>
                  <ul className="about-area-list">
                    {area.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
