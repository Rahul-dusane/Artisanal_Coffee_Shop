import React from "react";
import { Provider } from "react-redux";
import {store} from "./Store/store.js";
import RecipeFormulator from "./Features/Page/RecipeFormulator.jsx";

export default function App(){
    return (
        <Provider store={store}>
            <RecipeFormulator />
        </Provider>
    );
}