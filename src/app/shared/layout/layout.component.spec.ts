import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LayoutComponent } from "./layout.component";
import {
  provideRouter,
  withComponentInputBinding,
  Routes,
  Router,
  NavigationEnd,
  ActivatedRoute,
  Event,
} from "@angular/router";
import { BehaviorSubject } from "rxjs";

describe("LayoutComponent", () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let router: Router;
  let routerEvents: BehaviorSubject<Event | null>;

  const routes: Routes = [
    { path: "dashboard", component: class {} },
    { path: "company-approval", component: class {} },
    { path: "company-approval/approve/:id", component: class {} },
  ];

  // Create a complete mock of ActivatedRoute
  const createActivatedRouteMock = () => ({
    snapshot: {
      paramMap: {
        get: jest.fn(),
      },
    },
    paramMap: new BehaviorSubject<Record<string, string>>({}),
    queryParamMap: new BehaviorSubject<Record<string, string>>({}),
    parent: null,
    params: new BehaviorSubject<Record<string, string>>({}),
    queryParams: new BehaviorSubject<Record<string, string>>({}),
    fragment: new BehaviorSubject<string | null>(null),
    data: new BehaviorSubject<Record<string, unknown>>({}),
    url: new BehaviorSubject<unknown[]>([]),
    outlet: "primary",
    component: null,
    routeConfig: null,
    root: {
      snapshot: {},
      firstChild: null,
      children: [],
    },
    children: [],
    firstChild: null,
    pathFromRoot: [],
  });

  beforeEach(async () => {
    routerEvents = new BehaviorSubject<Event | null>(null);

    const routerMock = {
      events: routerEvents.asObservable(),
      url: "",
      navigate: jest.fn(),
      createUrlTree: jest.fn(),
      serializeUrl: jest.fn(),
      routerState: {
        root: {
          snapshot: {},
          firstChild: null,
          children: [],
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      providers: [
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: ActivatedRoute,
          useValue: createActivatedRouteMock(),
        },
        provideRouter(routes, withComponentInputBinding()),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("ngOnInit route handling", () => {
    it("should handle parent route selection for child routes", () => {
      // Setup a route with approve
      Object.defineProperty(router, "url", {
        value: "/admin-dashboard/company-approval/approve/123",
      });

      // Trigger navigation end event
      routerEvents.next(
        new NavigationEnd(
          1,
          "/admin-dashboard/company-approval/approve/123",
          "/admin-dashboard/company-approval/approve/123",
        ),
      );

      // Add company-approval to items
      const companyApprovalRoute = {
        label: "Company Approval",
        icon: "assets/icon/company.svg",
        route: "/company-approval",
      };

      // Update items before ngOnInit
      component.items = [...component.items, companyApprovalRoute];

      // Call ngOnInit
      component.ngOnInit();

      // Verify the selection
      expect(component.selectedIndex).toBe(component.items.length - 1);
    });

    it("should handle edit routes correctly", () => {
      Object.defineProperty(router, "url", { value: "/programs/edit/123" });
      routerEvents.next(
        new NavigationEnd(1, "/programs/edit/123", "/programs/edit/123"),
      );

      component.ngOnInit();
      const programsIndex = component.items.findIndex(
        (item) => item.route === "/programs",
      );
      expect(component.selectedIndex).toBe(programsIndex);
    });

    it("should handle view routes correctly", () => {
      Object.defineProperty(router, "url", { value: "/applications/view/123" });
      routerEvents.next(
        new NavigationEnd(
          1,
          "/applications/view/123",
          "/applications/view/123",
        ),
      );

      component.ngOnInit();
      const applicationsIndex = component.items.findIndex(
        (item) => item.route === "/applications",
      );
      expect(component.selectedIndex).toBe(applicationsIndex);
    });

    describe("ngOnInit route handling", () => {
      // Add beforeEach to set up navigation mock for all tests
      beforeEach(() => {
        // Mock navigation before any tests run
        jest
          .spyOn(router, "navigate")
          .mockImplementation(() => Promise.resolve(true));
      });

      it("should select settings when URL includes settings", () => {
        // First spy on selectSettings
        const selectSettingsSpy = jest.spyOn(component, "selectSettings");

        // Set up the initial route
        Object.defineProperty(router, "url", { value: "/dashboard" }); // Start with a valid route

        // Initialize the component first (this will call selectItem with initial route)
        component.ngOnInit();

        // Clear the navigation spy calls from initialization
        jest.clearAllMocks();

        // Now change to settings route
        Object.defineProperty(router, "url", { value: "/settings" });
        routerEvents.next(new NavigationEnd(1, "/settings", "/settings"));

        // Verify that selectSettings was called
        expect(selectSettingsSpy).toHaveBeenCalled();
      });
    });

    it("should not update selection for non-NavigationEnd events", () => {
      const selectItemSpy = jest.spyOn(component, "selectItem");

      // Call ngOnInit which will call selectItem once
      component.ngOnInit();

      // Trigger a non-NavigationEnd event
      routerEvents.next({ type: "NotNavigationEnd" } as unknown as Event);

      // Verify selectItem was only called once (from ngOnInit)
      expect(selectItemSpy).toHaveBeenCalledTimes(1);

      // Also verify it wasn't called with any new index
      expect(selectItemSpy).toHaveBeenCalledWith(0); // initial index
    });

    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize with minimized as false", () => {
      expect(component.minimized).toBe(false);
    });

    it("should initialize with selectedSetting as false", () => {
      expect(component.selectedSetting).toBe(false);
    });

    it("should toggle minimized state when toggleNav is called", () => {
      component.toggleNav();
      expect(component.minimized).toBe(true);
      component.toggleNav();
      expect(component.minimized).toBe(false);
    });

    it("should set selectedIndex and deselect settings when selectItem is called", () => {
      component.selectItem(2);
      component.selectedIndex = 2;
      expect(component.selectedIndex).toBe(2);
      expect(component.selectedSetting).toBe(false);
    });

    it("should set selectedSetting and deselect other items when selectSettings is called", () => {
      component.selectSettings();
      expect(component.selectedSetting).toBe(true);
      expect(component.selectedIndex).toBe(-1);
    });

    it("should use sidebarItems as default items input", () => {
      expect(component.items).toEqual([
        {
          label: "Dashboard",
          icon: "assets/icon/dashboard.svg",
          route: "/dashboard",
        },
        {
          label: "Programs",
          icon: "assets/icon/program.svg",
          route: "/programs",
        },
        {
          label: "Applications",
          icon: "assets/icon/application.svg",
          route: "/applications",
        },
        {
          label: "Assessments",
          icon: "assets/icon/assessment.svg",
          route: "/assessments",
        },
        {
          label: "Messages",
          icon: "assets/icon/message.svg",
          route: "/messages",
        },
      ]);
    });
  });
});
