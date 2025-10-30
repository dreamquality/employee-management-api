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

    // Try to check if the URL is reachable
    try {
      // For demonstration, we'll simulate a check
      // In production, you might want to use a backend endpoint to check URL reachability
      const response = await fetch(projectUrl, { 
        mode: 'no-cors',
        method: 'HEAD',
      });
      
      // If we get here without error, open the link
      window.open(projectUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      // If unreachable, show completed modal
      setShowModal(true);
    }
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
