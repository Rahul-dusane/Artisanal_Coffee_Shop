import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {FORMULATOR_INITIAL_STATE} from "../Config/recipeFormulator.config";

const BASE_URL = import.meta.env.BASE_URL;

export const formulateMealThank = createAsyncThunk(
    "recipeFormulator/formulateMeal",
    async({ ingredients, vibe }, { rejectWithValue}) => {
        try{
            const response = await axios.post(
                `http://localhost:5000/api/recipes/formulate`, 
                { ingredients, vibe }, 
                { withCredentials: true }
            );
            return response.data;
        }catch(error){
            return rejectWithValue(error.response?.data?.error || "Failed to cook the meal.");
        }
    }
);

const recipeSlice = createSlice({
    name: "recipeFormulator",
    initialState: FORMULATOR_INITIAL_STATE,
    reducers: {
        setIngredients: (state, action) => {
            state.ingredientsInput = action.payload;
        },
        setVibe: (state, action) => {
            state.selectedVibe = action.payload;
        },
        setInputError: (state, action) => {
            state.inputFieldError = action.payload;
        },
        resetFormulator: () => FORMULATOR_INITIAL_STATE
    },

    extraReducers: (builder) => {
        builder.addCase(formulateMealThank.pending, (state) => {
            state.uiState = "loading";
            state.errorMessage = null;
        })
        .addCase(formulateMealThank.fulfilled, (state, action) => {
            state.recipeOutput = action.payload;
            state.uiState = "recipe";
        })  
        .addCase(formulateMealThank.rejected, (state, action) => {
            state.uiState = "input";
            state.errorMessage = action.payload;
        });
    },
});

export const {setIngredients, setVibe, setInputError, resetFormulator} = recipeSlice.actions;
export default recipeSlice.reducer;