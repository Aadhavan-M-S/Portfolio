import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { ProjectCard } from '../components/ProjectCard';
import { projects } from '../data/projects';
import './Projects.css';

export const Projects = () => {
  return (
    <section id="projects" className="section projects">
      <div className="container">
        <Reveal>
          <SectionHeading 
            subtitle="Selected Work"
            title="Projects"
          />
        </Reveal>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 100}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
