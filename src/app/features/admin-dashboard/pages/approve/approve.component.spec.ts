import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { ApproveComponent } from "./approve.component";
import {
  selectCompanyById,
  selectIsLoading,
} from "../../store/admin.selectors";

describe("ApproveComponent", () => {
  let component: ApproveComponent;
  let fixture: ComponentFixture<ApproveComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;

  const mockCompany = {
    id: "123",
    name: "Test Company",
    registrationDate: "2024-10-01",
    status: "pending",
    web: "www.test.com",
    email: "test@test.com",
    phone: "123-456-7890",
    certificateUrl: "test.jpg",
  };

  beforeEach(async () => {
    // Create mock router
    const routerMock = {
      navigate: jest.fn(),
    };

    // Create mock ActivatedRoute
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue("123"),
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [ApproveComponent],
      providers: [
        provideMockStore({
          initialState: {
            admin: { companies: [], isLoading: false, error: null },
          },
        }),
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    // Set up selector mocks
    store.overrideSelector(selectCompanyById("123"), mockCompany);
    store.overrideSelector(selectIsLoading, false);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load company details on init", () => {
    const company$ = component.company$;
    company$.subscribe((company) => {
      expect(company).toEqual(mockCompany);
    });
  });

  it("should navigate back when headBack is called", () => {
    component.headBack();
    expect(router.navigate).toHaveBeenCalledWith([
      "admin-dashboard",
      "company-approval",
    ]);
  });

  it("should handle loading state", (done) => {
    store.overrideSelector(selectIsLoading, true);
    store.refreshState();

    component.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBe(true);
      done();
    });
  });

  // Test error scenarios
  it("should handle undefined company ID", () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    jest.spyOn(activatedRoute.snapshot.paramMap, "get").mockReturnValue(null);

    fixture = TestBed.createComponent(ApproveComponent);
    component = fixture.componentInstance;

    expect(component.companyId).toBe(undefined);
  });
});
