import * as fromSelectors from "./admin.selectors";
import { AdminState } from "./admin.state";

describe("Admin Selectors", () => {
  const initialState: AdminState = {
    companies: [
      {
        id: "1",
        name: "Company 1",
        registrationDate: "2024-01-01",
        status: "pending",
        websiteUrl: "https://company1.com",
        email: "contact@company1.com",
        phoneNumber: "+1234567890",
        certificates: ["https://company1.com/certificate"],
        logoUrl: "logo.jpg",
      },
      {
        id: "2",
        name: "Company 2",
        registrationDate: "2024-01-02",
        status: "approved",
        websiteUrl: "https://company2.com",
        email: "contact@company2.com",
        phoneNumber: "+1234567891",
        certificates: ["https://company2.com/certificate"],
        logoUrl: "logo.jpg",
      },
    ],
    selectedCompanyId: null,
    isLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 5,
      totalItems: 25,
      pageSize: 5,
      hasNext: true,
      hasPrevious: false,
    },
    isSearching: false,
  };

  describe("selectAdminState", () => {
    it("should select the admin state", () => {
      const result = fromSelectors.selectAdminState.projector(initialState);
      expect(result).toBe(initialState);
    });
  });

  describe("selectCompanies", () => {
    it("should select all companies", () => {
      const result = fromSelectors.selectCompanies.projector(initialState);
      expect(result).toEqual(initialState.companies);
      expect(result.length).toBe(2);
    });
  });

  describe("selectPagination", () => {
    it("should select pagination state", () => {
      const result = fromSelectors.selectPagination.projector(initialState);
      expect(result).toEqual(initialState.pagination);
    });
  });

  describe("selectIsLoading", () => {
    it("should select loading state", () => {
      const result = fromSelectors.selectIsLoading.projector(initialState);
      expect(result).toBeFalsy();
    });
  });

  describe("selectError", () => {
    it("should select error state", () => {
      const result = fromSelectors.selectError.projector(initialState);
      expect(result).toBeNull();
    });

    it("should select error message when present", () => {
      const stateWithError = {
        ...initialState,
        error: "Test error message",
      };
      const result = fromSelectors.selectError.projector(stateWithError);
      expect(result).toBe("Test error message");
    });
  });

  describe("selectTotalItems", () => {
    it("should select total items from pagination", () => {
      const result = fromSelectors.selectTotalItems.projector(
        initialState.pagination,
      );
      expect(result).toBe(25);
    });
  });

  describe("selectCurrentPage", () => {
    it("should select current page from pagination", () => {
      const result = fromSelectors.selectCurrentPage.projector(
        initialState.pagination,
      );
      expect(result).toBe(1);
    });
  });

  describe("selectPageSize", () => {
    it("should select page size from pagination", () => {
      const result = fromSelectors.selectPageSize.projector(
        initialState.pagination,
      );
      expect(result).toBe(5);
    });
  });

  describe("selectIsSearching", () => {
    it("should select searching state", () => {
      const result = fromSelectors.selectIsSearching.projector(initialState);
      expect(result).toBeFalsy();
    });
  });

  describe("selectCompanyById", () => {
    it("should select company by id when exists", () => {
      const result = fromSelectors
        .selectCompanyById("1")
        .projector(initialState.companies);
      expect(result).toEqual(initialState.companies[0]);
    });

    it("should return undefined when company does not exist", () => {
      const result = fromSelectors
        .selectCompanyById("999")
        .projector(initialState.companies);
      expect(result).toBeUndefined();
    });

    it("should handle case-sensitive id matching", () => {
      const result = fromSelectors
        .selectCompanyById("2")
        .projector(initialState.companies);
      expect(result).toEqual(initialState.companies[1]);
    });
  });

  // Test selector composition
  describe("Composed Selectors", () => {
    it("should compose selectors correctly for pagination data", () => {
      const paginationResult =
        fromSelectors.selectPagination.projector(initialState);
      const totalItemsResult =
        fromSelectors.selectTotalItems.projector(paginationResult);
      const currentPageResult =
        fromSelectors.selectCurrentPage.projector(paginationResult);
      const pageSizeResult =
        fromSelectors.selectPageSize.projector(paginationResult);

      expect(totalItemsResult).toBe(25);
      expect(currentPageResult).toBe(1);
      expect(pageSizeResult).toBe(5);
    });
  });

  // Test edge cases
  describe("Edge Cases", () => {
    it("should handle empty companies array", () => {
      const emptyState = {
        ...initialState,
        companies: [],
      };
      const result = fromSelectors.selectCompanies.projector(emptyState);
      expect(result).toEqual([]);
    });

    it("should handle null pagination values", () => {
      const stateWithNullPagination = {
        ...initialState,
        pagination: {
          currentPage: 0,
          totalPages: 0,
          totalItems: 0,
          pageSize: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };
      const result = fromSelectors.selectPagination.projector(
        stateWithNullPagination,
      );
      expect(result.totalItems).toBe(0);
      expect(result.currentPage).toBe(0);
    });
  });
});
