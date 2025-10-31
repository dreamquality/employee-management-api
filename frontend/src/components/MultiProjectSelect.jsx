import React, { useState, useEffect, useRef } from 'react';
import { X, Star, StarOff, Search } from 'lucide-react';
import { projectService } from '../services/projectService';
import { Button } from '@/components/ui/button';

export default function MultiProjectSelect({ value = [], primaryProjectId, onChange, onPrimaryChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch suggestions when search term changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await projectService.searchProjects(searchTerm);
        // Filter out already selected projects
        const filtered = response.filter(p => !value.find(v => v.id === p.id));
        setSuggestions(filtered);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (project) => {
    const newValue = [...value, project];
    onChange(newValue);
    setSearchTerm('');
    setSuggestions([]);
    setShowDropdown(false);
    
    // If this is the first project, make it primary
    if (newValue.length === 1 && onPrimaryChange) {
      onPrimaryChange(project.id);
    }
  };

  const handleRemove = (projectId) => {
    const newValue = value.filter(p => p.id !== projectId);
    onChange(newValue);
    
    // If removing primary project, set first project as primary
    if (primaryProjectId === projectId && newValue.length > 0 && onPrimaryChange) {
      onPrimaryChange(newValue[0].id);
    } else if (newValue.length === 0 && onPrimaryChange) {
      onPrimaryChange(null);
    }
  };

  const handleSetPrimary = (projectId) => {
    if (onPrimaryChange) {
      onPrimaryChange(projectId);
    }
  };

  return (
    <div className="space-y-2">
      {/* Selected Projects */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((project) => (
            <div
              key={project.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${
                project.id === primaryProjectId
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <button
                type="button"
                onClick={() => handleSetPrimary(project.id)}
                className="hover:scale-110 transition-transform"
                title={project.id === primaryProjectId ? 'Primary project' : 'Set as primary'}
              >
                {project.id === primaryProjectId ? (
                  <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                ) : (
                  <StarOff className="h-4 w-4 text-gray-400" />
                )}
              </button>
              <span className="text-sm font-medium">{project.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(project.id)}
                className="hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search and add projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dropdown */}
        {showDropdown && (searchTerm.length >= 2) && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
            ) : suggestions.length > 0 ? (
              suggestions.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => handleSelect(project)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <div className="font-medium text-sm">{project.name}</div>
                  {project.description && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {project.description}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                {searchTerm.length < 2 ? 'Type at least 2 characters...' : 'No projects found'}
              </div>
            )}
          </div>
        )}
      </div>

      {value.length === 0 && (
        <p className="text-sm text-gray-500">No projects assigned. Search to add projects.</p>
      )}
      {value.length > 0 && (
        <p className="text-xs text-gray-500">
          <Star className="inline h-3 w-3 text-blue-500 fill-blue-500" /> indicates primary project
        </p>
      )}
    </div>
  );
}
