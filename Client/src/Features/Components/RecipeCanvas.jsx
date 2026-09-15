import React, { memo } from "react";
import { VIBE_OPTIONS } from "../Config/recipeFormulator.config";

const RecipeCanvas = memo(({ recipe, activeVibe, onBack }) => {
  const currentVibeInfo = VIBE_OPTIONS.find(v => v.id === activeVibe);

  const finalIngredients =
    recipe.ingredientsUtilized ||
    recipe.ingredients ||
    recipe.usedIngredients ||
    [];
  const finalInstructions = recipe.instructions || [];

  return (
    <div className="recipe-canvas active">
      <div className="recipe-header">
        <h2 className="recipe-title">{recipe.dishName}</h2>
        <div className="recipe-metadata">
          <span className="metadata-badge">
            <span className="badge-icon">⏱️</span>
            <span>{recipe.prepTime || recipe.preTime}</span>
          </span>
          <span className="metadata-badge">
            <span className="badge-icon">📊</span>
            <span>{recipe.difficulty}</span>
          </span>
          <span className="metadata-badge">
            <span className="badge-icon">{currentVibeInfo?.emoji || '🍽️'}</span>
            <span>{recipe.cravingMatch || currentVibeInfo?.label}</span>
          </span>                    
        </div>
      </div>

      <div className="recipe-section">
        <h3 className="section-title">Ingredients Used</h3>
        <ul className="ingredients-list">
          {finalIngredients.map((ingredient, idx) => (
            <li key={idx}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h3 className="section-title">Preparation Steps</h3>
        <ol className="instructions-list">
          {finalInstructions.map((instruction, idx) => (
            <li key={idx}>{instruction}</li>
          ))}
        </ol>
      </div>

      <button onClick={onBack} className="back-button">Create Another Recipe</button>
    </div>
  );
});

RecipeCanvas.displayName = "RecipeCanvas";
export default RecipeCanvas;