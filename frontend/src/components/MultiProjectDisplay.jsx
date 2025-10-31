import React, { useState } from "react";
import { Star, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectLink from "./ProjectLink";

/**
 * MultiProjectDisplay - Component to display multiple projects with primary indicator
 * Shows up to displayLimit projects, with a "show more" button if there are more
 * 
 * @param {Array} projects - Array of project objects with { id, name, isPrimary, project: { name, description } }
 * @param {number} displayLimit - Maximum number of projects to show initially (default: 3)
 */
export default function MultiProjectDisplay({ projects = [], displayLimit = 3 }) {
  const [showAll, setShowAll] = useState(false);

  if (!projects || projects.length === 0) {
    return <p className="text-gray-500">No projects assigned</p>;
  }

  // Sort projects so primary is first
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return 0;
  });

  const displayedProjects = showAll ? sortedProjects : sortedProjects.slice(0, displayLimit);
  const hasMore = sortedProjects.length > displayLimit;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {displayedProjects.map((userProject) => {
          const projectName = userProject.project?.name || userProject.name || "Unknown Project";
          const isPrimary = userProject.isPrimary;

          return (
            <div
              key={userProject.id || userProject.projectId}
              className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-md px-3 py-1"
            >
              {isPrimary && (
                <Star
                  className="w-4 h-4 text-yellow-500 fill-yellow-500"
                  title="Primary Project"
                />
              )}
              <ProjectLink projectName={projectName} />
            </div>
          );
        })}
      </div>

      {hasMore && !showAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(true)}
          className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
        >
          <ChevronDown className="w-4 h-4 mr-1" />
          Show {sortedProjects.length - displayLimit} more
        </Button>
      )}

      {showAll && hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(false)}
          className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
        >
          <ChevronUp className="w-4 h-4 mr-1" />
          Show less
        </Button>
      )}
    </div>
  );
}
