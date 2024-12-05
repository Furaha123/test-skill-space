import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { CompanyApprovalComponent } from "./company-approval.component";
import { AdminActions, AppActions } from "../../store/admin.actions";
import {
  selectCompanies,
  selectIsLoading,
  selectPageSize,
  selectTotalItems,
  selectError,
  selectCurrentPage,
  selectPagination,
  selectIsSearching,
} from "../../store/admin.selectors";
import { selectSearchTerm } from "../../../../shared/store/app.selectors";

describe("CompanyApprovalComponent", () => {
  let component: CompanyApprovalComponent;
  let fixture: ComponentFixture<CompanyApprovalComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;

  const initialState = {
    admin: {
      companies: [],
      isLoading: false,
      error: null,
      selectedCompanyId: null,
      pageSize: 10,
      totalItems: 0,
      currentPage: 1,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: 10,
        hasNext: false,
        hasPrevious: false,
      },
    },
    app: {
      searchTerm: "",
    },
  };

  const mockPaginationResponse = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    pageSize: 10,
    hasNext: true,
    hasPrevious: false,
  };

  beforeEach(async () => {
    const routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CompanyApprovalComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    // Set up selector mocks
    store.overrideSelector(selectCompanies, []);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectPageSize, 10);
    store.overrideSelector(selectTotalItems, 0);
    store.overrideSelector(selectSearchTerm, "");
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectCurrentPage, 1);
    store.overrideSelector(selectPagination, mockPaginationResponse);

    jest.spyOn(store, "dispatch");
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("store selectors", () => {
    it("should initialize all store selectors", () => {
      component.isLoading$.subscribe((value) => expect(value).toBeFalsy());
      component.paginatedCompanies$.subscribe((value) =>
        expect(value).toEqual([]),
      );
      component.pageSize$.subscribe((value) => expect(value).toBe(10));
      component.totalItems$.subscribe((value) => expect(value).toBe(0));
      component.searchTerm$.subscribe((value) => expect(value).toBe(""));
      component.error$.subscribe((value) => expect(value).toBeNull());
      component.currentPage$.subscribe((value) => expect(value).toBe(1));
    });
  });

  describe("routeTo", () => {
    it("should navigate to the correct route with company ID", () => {
      const testId = "test-id";

      component.routeTo(testId);

      expect(router.navigate).toHaveBeenCalledWith([
        "admin-dashboard",
        "company-approval",
        "approve",
        testId,
      ]);
    });
  });

  describe("onPageChange", () => {
    it("should dispatch loadCompanies action with correct page and size", () => {
      const testPage = 2;
      const mockPaginationData = {
        currentPage: 1,
        totalPages: 5,
        totalItems: 50,
        pageSize: 10,
        hasNext: true,
        hasPrevious: false,
      };

      store.overrideSelector(selectPagination, mockPaginationData);

      component.onPageChange(testPage);

      expect(store.dispatch).toHaveBeenCalledWith(
        AdminActions.loadCompanies({
          page: testPage,
          size: mockPaginationData.pageSize,
        }),
      );
    });

    it("should handle pagination state changes", () => {
      const testPage = 2;
      const updatedPagination = {
        currentPage: 2,
        totalPages: 5,
        totalItems: 50,
        pageSize: 10,
        hasNext: true,
        hasPrevious: true,
      };

      store.overrideSelector(selectPagination, updatedPagination);

      component.onPageChange(testPage);

      expect(store.dispatch).toHaveBeenCalledWith(
        AdminActions.loadCompanies({
          page: testPage,
          size: updatedPagination.pageSize,
        }),
      );
    });

    it("should take only first emission from pagination selector", (done) => {
      const testPage = 2;
      let dispatchCount = 0;

      store.overrideSelector(selectPagination, mockPaginationResponse);

      jest.spyOn(store, "dispatch").mockImplementation(() => {
        dispatchCount++;
        if (dispatchCount > 1) {
          fail("Should not dispatch more than once");
        }
      });

      component.onPageChange(testPage);

      setTimeout(() => {
        expect(dispatchCount).toBe(1);
        done();
      });
    });
  });

  describe("onSearchChange", () => {
    it("should dispatch setSearchTerm action", () => {
      const searchTerm = "test";

      component.onSearchChange(searchTerm);

      expect(store.dispatch).toHaveBeenCalledWith(
        AppActions.setSearchTerm({ searchTerm }),
      );
    });

    it("should dispatch clearSearch and loadCompanies when search term is empty", () => {
      const searchTerm = "";
      store.overrideSelector(selectIsSearching, false);
      store.overrideSelector(selectSearchTerm, "");
      store.overrideSelector(selectPagination, mockPaginationResponse);

      component.onSearchChange(searchTerm);

      expect(store.dispatch).toHaveBeenCalledWith(AdminActions.clearSearch());
      expect(store.dispatch).toHaveBeenCalledWith(
        AdminActions.loadCompanies({
          page: 0,
          size: 5,
        }),
      );
    });

    it("should dispatch searchCompanies when searching with term", () => {
      const searchTerm = "test company";
      const page = 0;
      store.overrideSelector(selectIsSearching, true);
      store.overrideSelector(selectSearchTerm, searchTerm);
      store.overrideSelector(selectPagination, mockPaginationResponse);

      component.onSearchChange(searchTerm, page);

      expect(store.dispatch).toHaveBeenCalledWith(
        AdminActions.searchCompanies({
          searchTerm,
          page,
          size: mockPaginationResponse.pageSize,
        }),
      );
    });

    it("should take only first emission from combined selectors", (done) => {
      const searchTerm = "test";
      let dispatchCount = 0;

      store.overrideSelector(selectIsSearching, true);
      store.overrideSelector(selectSearchTerm, searchTerm);
      store.overrideSelector(selectPagination, mockPaginationResponse);

      jest.spyOn(store, "dispatch").mockImplementation(() => {
        dispatchCount++;
        if (dispatchCount > 2) {
          // One for setSearchTerm and one for searchCompanies
          fail("Should not dispatch more than twice");
        }
      });

      component.onSearchChange(searchTerm);

      setTimeout(() => {
        expect(dispatchCount).toBe(2);
        done();
      });
    });
  });

  // Additional test for onPageChange with search condition
  describe("onPageChange with search", () => {
    it("should dispatch searchCompanies when searching with term", () => {
      const testPage = 2;
      const searchTerm = "test";

      store.overrideSelector(selectIsSearching, true);
      store.overrideSelector(selectSearchTerm, searchTerm);
      store.overrideSelector(selectPagination, mockPaginationResponse);

      component.onPageChange(testPage);

      expect(store.dispatch).toHaveBeenCalledWith(
        AdminActions.searchCompanies({
          searchTerm,
          page: testPage,
          size: mockPaginationResponse.pageSize,
        }),
      );
    });

    it("should handle pagination with search state changes", () => {
      const testPage = 2;
      const searchTerm = "test";
      const updatedPagination = {
        ...mockPaginationResponse,
        currentPage: 2,
        hasPrevious: true,
      };

      store.overrideSelector(selectIsSearching, true);
      store.overrideSelector(selectSearchTerm, searchTerm);
      store.overrideSelector(selectPagination, updatedPagination);

      component.onPageChange(testPage);

      expect(store.dispatch).toHaveBeenCalledWith(
        AdminActions.searchCompanies({
          searchTerm,
          page: testPage,
          size: updatedPagination.pageSize,
        }),
      );
    });
  });
});
