import { AppRootState } from "./app.state";
import { selectAppState, selectSearchTerm } from "./app.selectors";

describe("App Selectors", () => {
  const initialState: AppRootState = {
    searchTerm: "test search",
  };

  describe("selectAppState", () => {
    it("should select the app state", () => {
      const result = selectAppState({
        app: initialState,
      });

      expect(result).toBe(initialState);
    });
  });

  describe("selectSearchTerm", () => {
    it("should select the search term from app state", () => {
      const result = selectSearchTerm({
        app: initialState,
      });

      expect(result).toBe("test search");
    });

    it("should handle empty search term", () => {
      const stateWithEmptySearch: AppRootState = {
        searchTerm: "",
      };

      const result = selectSearchTerm({
        app: stateWithEmptySearch,
      });

      expect(result).toBe("");
    });
  });
});
