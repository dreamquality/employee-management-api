import React, { useState, useEffect, useRef } from 'react';
import { projectService } from '../services/projectService';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Loader2 } from 'lucide-react';

export default function ProjectAutocomplete({ value, onChange, disabled }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProjects = async () => {
      if (query.length < 1) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const results = await projectService.searchProjects(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to search projects:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProjects, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
  };

  const handleSelectSuggestion = (projectName) => {
    setQuery(projectName);
    onChange(projectName);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Input
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setShowSuggestions(true)}
          disabled={disabled}
          placeholder="Start typing to search projects..."
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-auto shadow-lg">
          <div className="py-1">
            {suggestions.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => handleSelectSuggestion(project.name)}
                className="w-full px-4 py-2 text-left hover:bg-accent transition-colors"
              >
                <div className="font-medium">{project.name}</div>
                {project.description && (
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {project.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}

      {showSuggestions && !loading && query && suggestions.length === 0 && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg">
          <div className="px-4 py-3 text-sm text-muted-foreground">
            No projects found. Type to create a new one.
          </div>
        </Card>
      )}
    </div>
  );
}
