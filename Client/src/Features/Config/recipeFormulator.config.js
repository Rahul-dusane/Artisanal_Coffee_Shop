export const VIBE_OPTIONS = [
    { id: "quick", label: "Quick Snack", emoji: "⚡" },
    { id: "Comfort", label: "Comfort Food", emoji: "🥞" },
    { id: "healthy", label: "Healthy Fix", emoji: "🥗" },
];

export const FORMULATOR_INITIAL_STATE = {
    ingredientsInput: '',
    selectedVibe: 'comfort',
    uiState: 'input', // 'input' | 'loading' | 'recipe'
    recipeOutput: null,
    errorMessage: null,
    inputFieldError: false
}