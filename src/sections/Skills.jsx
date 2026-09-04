import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { skills } from '../data/skills';
import './Skills.css';

export const Skills = () => {
  return (
    <section id="skills" className="section skills">
      <div className="container">
        <Reveal>
          <SectionHeading 
            subtitle="Technical Expertise"
            title="Technologies"
          />
        </Reveal>

        <div className="skills-grid">
          {skills.map((skillGroup, index) => (
            <Reveal key={skillGroup.category} delay={index * 100}>
              <div className="skill-group">
                <h3 className="skill-category">{skillGroup.category}</h3>
                <div className="skill-items">
                  {skillGroup.items.map((skill) => (
                    <span key={skill} className="skill-item">{skill}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
