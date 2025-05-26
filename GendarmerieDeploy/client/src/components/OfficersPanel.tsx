import { useState } from "react";
import OfficerCard from "./OfficerCard";
import type { Officer } from "@shared/schema";

interface OfficersPanelProps {
  availableOfficers: Officer[];
  corg: Officer | null;
  onDragStart: (officer: Officer) => void;
  onDragEnd: () => void;
  onDropCorg: () => void;
  onRemoveCorg: () => void;
  draggedOfficer: Officer | null;
}

export default function OfficersPanel({
  availableOfficers,
  corg,
  onDragStart,
  onDragEnd,
  onDropCorg,
  onRemoveCorg,
  draggedOfficer
}: OfficersPanelProps) {
  const [isDragOverCorg, setIsDragOverCorg] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCorg(true);
  };

  const handleDragLeave = () => {
    setIsDragOverCorg(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCorg(false);
    onDropCorg();
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-users mr-2 text-[hsl(var(--police-blue))]"></i>
          Gendarmes Disponibles
        </h2>
        
        <div className="space-y-3 mb-6">
          {availableOfficers.map((officer) => (
            <OfficerCard
              key={officer.id}
              officer={officer}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggedOfficer?.id === officer.id}
            />
          ))}
        </div>

        <div className="border-t pt-6">
          <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
            <i className="fas fa-star mr-2 text-amber-500"></i>
            CORG (Coordinateur)
          </h3>
          <div 
            className={`min-h-20 border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              isDragOverCorg 
                ? 'border-amber-400 bg-amber-100' 
                : 'border-amber-300 bg-amber-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {corg ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  <span>{corg.initials}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{corg.name}</div>
                  <div className="text-sm text-gray-500">{corg.badge}</div>
                </div>
                <button 
                  onClick={onRemoveCorg}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : (
              <div className="text-amber-600">
                <i className="fas fa-hand-point-up mb-2"></i>
                <p className="text-sm">Glissez un gendarme ici pour le désigner comme CORG</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
