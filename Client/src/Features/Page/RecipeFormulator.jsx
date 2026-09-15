import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRecipeSelectors } from "../Hook/useRecipeSelectors.js";
import { setIngredients, setVibe, setInputError, resetFormulator, formulateMealThank } from "../Slice/recipeSlice.js";

import VibeSelector from "../Components/VibeSelector.jsx";
import LoadingView from "../Components/LoadingView.jsx";
import RecipeCanvas from "../Components/RecipeCanvas.jsx";

import "../Style/RecipeFormulator.css";

export default function RecipeFormulator() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  // FIXED: Changed selectVibe to selectedVibe to match your Redux state property
  const { ingredientsInput, selectedVibe, uiState, recipeOutput, inputFieldError } = useRecipeSelectors();

  useEffect(() => {
    if (uiState === "input" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [uiState]);

  const handleFormulateClick = () => {
    const targetString = ingredientsInput.trim();

    if (!targetString) {
      if (inputRef.current) inputRef.current.focus();
      dispatch(setInputError(true));
      setTimeout(() => dispatch(setInputError(false)), 1000);
      return;
    }
    // FIXED: Using selectedVibe payload here
    dispatch(formulateMealThank({ ingredients: targetString, vibe: selectedVibe }));
  };

  return (
    <div className="cravingcraft-body-wrapper">
      {/* Floating Ambient Sticker Assets */}
      {['🍕', '🍔', '🍳', '🥪', '🥗', '🍜'].map((emoji, idx) => (
        <div key={idx} className="food-sticker">{emoji}</div>
      ))}

      {/* Profile Header Block */}
      <div className="user-profile-container">
        <div className="user-profile">
          <div className="user-avatar">👨‍🍳</div>
          <span className="user-name">Jhon Dev</span>
          <svg className="user-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      <div className="main-container">
        <div className="container-decoration decoration-1">🍴</div>
        <div className="container-decoration decoration-2">🥘</div>            
      
        {uiState === 'input' && (
          <div id="inputStation">
            <div className="header">
              <h1 className="brand-title">
                <span className="brand-icon">🍽️</span> CravingCraft
              </h1>
              <p className="subtitle">What's on your kitchen counter right now?</p>
            </div>

            <div className="input-group">
              <input 
                ref={inputRef}
                type="text"
                className={`input-field ${inputFieldError ? 'input-field-error' : ''}`}
                placeholder="e.g., bread, cheese, chili, eggs, butter..."
                value={ingredientsInput}
                onChange={(e) => dispatch(setIngredients(e.target.value))}
                autoComplete="off"
              />
            </div>
            
            {/* FIXED: Passing selectedVibe down cleanly */}
            <VibeSelector activeVibe={selectedVibe} onVibeChange={(id) => dispatch(setVibe(id))} />

            <button onClick={handleFormulateClick} className="action-button">
              Formulate Midnight Meal
            </button>
          </div>
        )}

        {uiState === 'loading' && <LoadingView />}

        {uiState === 'recipe' && recipeOutput && (
          <RecipeCanvas 
            recipe={recipeOutput}
            activeVibe={selectedVibe}
            onBack={() => dispatch(resetFormulator())}
          />
        )}
      </div>
    </div>
  );
}