import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { AdminActions } from "./store/admin.actions";

describe("AdminDashboardComponent", () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let store: MockStore;

  const initialState = {
    // For example:
    admin: {
      companies: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch loadCompanies action on init", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      AdminActions.loadCompanies({ page: 0, size: 5 }),
    );
  });
});
