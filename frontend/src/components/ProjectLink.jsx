import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import ProjectModal from './ProjectModal';
import { projectService } from '../services/projectService';

export default function ProjectLink({ projectName }) {
  const [showModal, setShowModal] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const handleClick = async (e) => {
    e.preventDefault();
    
    // Try to fetch the project from the API
    try {
      const projects = await projectService.searchProjects(projectName);
      const project = projects.find(p => p.name === projectName);
      
      if (project) {
        // Project exists and is active
        setProjectData(project);
        setIsActive(true);
      } else {
        // Project doesn't exist, it's inactive
        setProjectData({ name: projectName });
        setIsActive(false);
      }
      setShowModal(true);
    } catch (error) {
      // If API call fails, assume project is inactive
      setProjectData({ name: projectName });
      setIsActive(false);
      setShowModal(true);
    }
  };

  return (
    <>
      <a
        href="#"
        onClick={handleClick}
        className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
      >
        {projectName}
        <ExternalLink className="h-3 w-3" />
      </a>
      
      {showModal && projectData && (
        <ProjectModal
          project={projectData}
          isActive={isActive}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
