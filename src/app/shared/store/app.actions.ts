import { createActionGroup, props } from "@ngrx/store";

export const AppActions = createActionGroup({
  source: "App",
  events: {
    "Set Search Term": props<{ searchTerm: string }>(),
  },
});
