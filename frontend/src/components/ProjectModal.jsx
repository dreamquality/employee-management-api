import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FolderOpen, X, AlertCircle } from 'lucide-react';

export default function ProjectModal({ project, isActive, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isActive ? (
                <>
                  <FolderOpen className="h-6 w-6 text-blue-500" />
                  <CardTitle>Project Details</CardTitle>
                </>
              ) : (
                <>
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                  <CardTitle>Project Inactive</CardTitle>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {isActive ? (
            <>
              <div className="mb-3">
                <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                {project.description && (
                  <CardDescription className="text-base">
                    {project.description}
                  </CardDescription>
                )}
              </div>
              {!project.description && (
                <CardDescription className="text-base mb-3">
                  No description available for this project.
                </CardDescription>
              )}
            </>
          ) : (
            <CardDescription className="text-base mb-3">
              The project <span className="font-semibold text-foreground">"{project.name}"</span> is no longer active or has been removed from the system.
            </CardDescription>
          )}
          <div className="mt-6">
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
