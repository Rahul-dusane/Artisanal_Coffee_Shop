import React, { memo } from 'react';
import { VIBE_OPTIONS } from '../Config/recipeFormulator.config';

const VibeSelector = memo(({ activeVibe, onVibeChange }) => {
  return (
    <div className="craving-selector">
      <label className="selector-label">Choose Your Vibe</label>
      <div className="craving-options">
        {VIBE_OPTIONS.map((option) => {
          // Explicit boolean check
          const isSelected = activeVibe === option.id;
          
          return (
            <button
              key={option.id}
              type="button"
              className={`craving-pill ${isSelected ? 'active' : ''}`}
              onClick={() => onVibeChange(option.id)}
            >
              <span className="pill-icon">{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

VibeSelector.displayName = "VibeSelector";
export default VibeSelector;