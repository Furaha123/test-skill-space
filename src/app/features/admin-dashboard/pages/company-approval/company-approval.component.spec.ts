// company-approval.component.spec.ts
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { CompanyApprovalComponent } from "./company-approval.component";
import { AdminActions } from "../../store/admin.actions";
import { selectCompanies, selectIsLoading } from "../../store/admin.selectors";
import { Company } from "../../models/company.model";

describe("CompanyApprovalComponent", () => {
  let component: CompanyApprovalComponent;
  let fixture: ComponentFixture<CompanyApprovalComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;

  const mockCompanies: Company[] = [
    {
      id: "1",
      name: "Company 1",
      registrationDate: "2024-10-01",
      status: "pending",
      web: "www.company1.com",
      email: "company1@test.com",
      phone: "123-456-7890",
      certificateUrl: "cert1.jpg",
    },
    {
      id: "2",
      name: "Company 2",
      registrationDate: "2024-10-02",
      status: "pending",
      web: "www.company2.com",
      email: "company2@test.com",
      phone: "123-456-7891",
      certificateUrl: "cert2.jpg",
    },
  ];

  beforeEach(async () => {
    const routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CompanyApprovalComponent],
      providers: [
        provideMockStore({
          initialState: {
            admin: {
              companies: [],
              isLoading: false,
              error: null,
              selectedCompanyId: null,
            },
          },
        }),
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    // Set up selector mocks
    store.overrideSelector(selectCompanies, mockCompanies);
    store.overrideSelector(selectIsLoading, false);

    // Spy on store dispatch
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

  it("should dispatch loadCompanies action on init", () => {
    expect(store.dispatch).toHaveBeenCalledWith(AdminActions.loadCompanies());
  });

  it("should get companies from store", (done) => {
    component.companies$.subscribe((companies) => {
      expect(companies).toEqual(mockCompanies);
      expect(companies.length).toBe(2);
      done();
    });
  });

  it("should get loading state from store", (done) => {
    component.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBeFalsy();
      done();
    });
  });

  it("should handle loading state changes", (done) => {
    store.overrideSelector(selectIsLoading, true);
    store.refreshState();

    component.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBeTruthy();
      done();
    });
  });

  describe("routeTo", () => {
    it("should navigate to company approval page and dispatch select action", () => {
      const companyId = "1";

      component.routeTo(companyId);

      expect(store.dispatch).toHaveBeenCalledWith(
        AdminActions.selectCompany({ companyId }),
      );
      expect(router.navigate).toHaveBeenCalledWith([
        "admin-dashboard",
        "company-approval",
        "approve",
        companyId,
      ]);
    });
  });

  describe("selectCompany", () => {
    it("should dispatch selectCompany action", () => {
      const companyId = "1";

      component.selectCompany(companyId);

      expect(store.dispatch).toHaveBeenCalledWith(
        AdminActions.selectCompany({ companyId }),
      );
    });
  });

  // Test error scenarios
  describe("error handling", () => {
    it("should handle empty companies array", (done) => {
      store.overrideSelector(selectCompanies, []);
      store.refreshState();

      component.companies$.subscribe((companies) => {
        expect(companies).toEqual([]);
        expect(companies.length).toBe(0);
        done();
      });
    });
  });

  // Test state changes
  describe("state changes", () => {
    it("should update when companies change", (done) => {
      const updatedCompanies = [
        ...mockCompanies,
        {
          id: "3",
          name: "Company 3",
          registrationDate: "2024-10-03",
          status: "pending",
          web: "www.company3.com",
          email: "company3@test.com",
          phone: "123-456-7892",
          certificateUrl: "cert3.jpg",
        },
      ];

      store.overrideSelector(selectCompanies, updatedCompanies);
      store.refreshState();

      component.companies$.subscribe((companies) => {
        expect(companies).toEqual(updatedCompanies);
        expect(companies.length).toBe(3);
        done();
      });
    });
  });

  // Test multiple actions
  describe("multiple actions", () => {
    it("should handle multiple company selections", () => {
      component.selectCompany("1");
      component.selectCompany("2");

      expect(store.dispatch).toHaveBeenCalledTimes(3); // Including initial loadCompanies
      expect(store.dispatch).toHaveBeenCalledWith(
        AdminActions.selectCompany({ companyId: "1" }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        AdminActions.selectCompany({ companyId: "2" }),
      );
    });
  });
});
