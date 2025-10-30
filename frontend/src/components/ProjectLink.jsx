import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import ProjectCompletedModal from './ProjectCompletedModal';

export default function ProjectLink({ projectName, projectUrl }) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    
    if (!projectUrl) {
      // No URL provided, show completed modal
      setShowModal(true);
      return;
    }

    // Open the link if a URL is provided
    window.open(projectUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <a
        href={projectUrl || '#'}
        onClick={handleClick}
        className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
      >
        {projectName}
        <ExternalLink className="h-3 w-3" />
      </a>
      
      {showModal && (
        <ProjectCompletedModal
          projectName={projectName}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
