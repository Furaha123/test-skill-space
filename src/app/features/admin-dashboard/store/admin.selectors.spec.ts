// admin.selectors.spec.ts
import {
  selectAdminState,
  selectCompanies,
  selectIsLoading,
  selectError,
  selectCompanyById,
  selectPendingCompanies,
  selectApprovedCompanies,
  selectRejectedCompanies,
  selectTotalCompanies,
  selectPendingCount,
  selectApprovedCount,
  selectRejectedCount,
  selectSearchResults,
} from "./admin.selectors";
import { AdminState } from "./admin.state";
import { Company } from "../models/company.model";

describe("Admin Selectors", () => {
  const mockCompanies: Company[] = [
    {
      id: "1",
      name: "Tech Company",
      registrationDate: "2024-10-01",
      status: "pending",
      web: "www.tech.com",
      email: "tech@company.com",
      phone: "123-456-7890",
      certificateUrl: "cert1.jpg",
    },
    {
      id: "2",
      name: "Digital Solutions",
      registrationDate: "2024-10-02",
      status: "approved",
      web: "www.digital.com",
      email: "digital@solutions.com",
      phone: "123-456-7891",
      certificateUrl: "cert2.jpg",
    },
    {
      id: "3",
      name: "Innovation Labs",
      registrationDate: "2024-10-03",
      status: "rejected",
      web: "www.innovation.com",
      email: "info@innovation.com",
      phone: "123-456-7892",
      certificateUrl: "cert3.jpg",
    },
  ];

  const initialState: AdminState = {
    companies: mockCompanies,
    isLoading: false,
    error: null,
    selectedCompanyId: null,
  };

  // Mock root state
  const state = {
    admin: initialState,
  };

  describe("Base Selectors", () => {
    it("should select the admin state", () => {
      const result = selectAdminState(state);
      expect(result).toBe(state.admin);
    });

    it("should select companies", () => {
      const result = selectCompanies(state);
      expect(result).toBe(state.admin.companies);
    });

    it("should select loading state", () => {
      const result = selectIsLoading(state);
      expect(result).toBe(false);
    });

    it("should select error state", () => {
      const result = selectError(state);
      expect(result).toBeNull();
    });
  });

  describe("Company By ID Selector", () => {
    it("should select company by id", () => {
      const result = selectCompanyById("1")(state);
      expect(result).toEqual(mockCompanies[0]);
    });

    it("should return undefined for non-existent company id", () => {
      const result = selectCompanyById("999")(state);
      expect(result).toBeUndefined();
    });
  });

  describe("Status-based Selectors", () => {
    it("should select pending companies", () => {
      const result = selectPendingCompanies(state);
      expect(result).toEqual([mockCompanies[0]]);
      expect(result.length).toBe(1);
      expect(result[0].status).toBe("pending");
    });

    it("should select approved companies", () => {
      const result = selectApprovedCompanies(state);
      expect(result).toEqual([mockCompanies[1]]);
      expect(result.length).toBe(1);
      expect(result[0].status).toBe("approved");
    });

    it("should select rejected companies", () => {
      const result = selectRejectedCompanies(state);
      expect(result).toEqual([mockCompanies[2]]);
      expect(result.length).toBe(1);
      expect(result[0].status).toBe("rejected");
    });

    it("should handle empty arrays for status filters", () => {
      const emptyState = {
        admin: {
          ...initialState,
          companies: [],
        },
      };

      expect(selectPendingCompanies(emptyState)).toEqual([]);
      expect(selectApprovedCompanies(emptyState)).toEqual([]);
      expect(selectRejectedCompanies(emptyState)).toEqual([]);
    });
  });

  describe("Count Selectors", () => {
    it("should select total companies count", () => {
      const result = selectTotalCompanies(state);
      expect(result).toBe(3);
    });

    it("should select pending companies count", () => {
      const result = selectPendingCount(state);
      expect(result).toBe(1);
    });

    it("should select approved companies count", () => {
      const result = selectApprovedCount(state);
      expect(result).toBe(1);
    });

    it("should select rejected companies count", () => {
      const result = selectRejectedCount(state);
      expect(result).toBe(1);
    });

    it("should handle empty state for counts", () => {
      const emptyState = {
        admin: {
          ...initialState,
          companies: [],
        },
      };

      expect(selectTotalCompanies(emptyState)).toBe(0);
      expect(selectPendingCount(emptyState)).toBe(0);
      expect(selectApprovedCount(emptyState)).toBe(0);
      expect(selectRejectedCount(emptyState)).toBe(0);
    });
  });

  describe("Search Selector", () => {
    it("should search by company name", () => {
      const result = selectSearchResults("tech")(state);
      expect(result).toEqual([mockCompanies[0]]);
    });

    it("should search by web address", () => {
      const result = selectSearchResults("digital.com")(state);
      expect(result).toEqual([mockCompanies[1]]);
    });

    it("should search by email", () => {
      const result = selectSearchResults("info@innovation")(state);
      expect(result).toEqual([mockCompanies[2]]);
    });

    it("should search by phone", () => {
      const result = selectSearchResults("123-456-7890")(state);
      expect(result).toEqual([mockCompanies[0]]);
    });

    it("should be case insensitive", () => {
      const result = selectSearchResults("TECH")(state);
      expect(result).toEqual([mockCompanies[0]]);
    });

    it("should return empty array for no matches", () => {
      const result = selectSearchResults("nonexistent")(state);
      expect(result).toEqual([]);
    });

    it("should handle empty search term", () => {
      const result = selectSearchResults("")(state);
      expect(result).toEqual(mockCompanies);
    });

    it("should handle null companies array", () => {
      const nullState = {
        admin: {
          ...initialState,
          companies: null,
        },
      };

      const result = selectSearchResults("tech")(nullState);
      expect(result).toEqual([]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined state", () => {
      const undefinedState = {
        admin: {
          ...initialState,
          companies: undefined,
        },
      };

      expect(selectCompanies(undefinedState)).toBeUndefined();
      expect(selectPendingCompanies(undefinedState)).toEqual([]);
      expect(selectSearchResults("test")(undefinedState)).toEqual([]);
    });

    it("should handle malformed company data", () => {
      const malformedState = {
        admin: {
          ...initialState,
          companies: [
            { id: "1" } as Company, // Malformed company object
          ],
        },
      };

      expect(selectCompanies(malformedState)).toBeDefined();
      expect(selectSearchResults("test")(malformedState)).toEqual([]);
    });
  });

  describe("when companies is null/undefined", () => {
    const nullState = {
      admin: {
        ...initialState,
        companies: null,
      },
    };

    const undefinedState = {
      admin: {
        ...initialState,
        companies: undefined,
      },
    };

    it("should return empty array for approved companies when companies is null", () => {
      const result = selectApprovedCompanies(nullState);
      expect(result).toEqual([]);
    });

    it("should return empty array for approved companies when companies is undefined", () => {
      const result = selectApprovedCompanies(undefinedState);
      expect(result).toEqual([]);
    });

    it("should return empty array for rejected companies when companies is null", () => {
      const result = selectRejectedCompanies(nullState);
      expect(result).toEqual([]);
    });

    it("should return empty array for rejected companies when companies is undefined", () => {
      const result = selectRejectedCompanies(undefinedState);
      expect(result).toEqual([]);
    });
  });
});
