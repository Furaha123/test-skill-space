import { createReducer, on } from "@ngrx/store";
import { AppActions } from "./app.actions";
import { initialAppState } from "./app.state";

export const appReducer = createReducer(
  initialAppState,
  on(AppActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),
);
