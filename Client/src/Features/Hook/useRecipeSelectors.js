import {useSelector} from "react-redux";

export function useRecipeSelectors() {
    return useSelector((state) => state.recipeFormulator);
}