import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RegisterPageComponent } from "./register-page.component";

describe("RegisterPageComponent", () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with 'talent' as the default form", () => {
    expect(component.currentForm).toBe("talent");
  });

  describe("Form switching functionality", () => {
    it("should switch to company registration form", () => {
      // Initial state check
      expect(component.currentForm).toBe("talent");

      // Trigger company registration
      component.onRegisterCompany();

      // Check if form switched to company
      expect(component.currentForm).toBe("company");
    });

    it("should switch to talent registration form", () => {
      // Set initial state to company
      component.currentForm = "company";

      // Trigger talent registration
      component.onRegisterTalent();

      // Check if form switched to talent
      expect(component.currentForm).toBe("talent");
    });

    it("should maintain state when switching between forms multiple times", () => {
      // Initial state is talent
      expect(component.currentForm).toBe("talent");

      // Switch to company
      component.onRegisterCompany();
      expect(component.currentForm).toBe("company");

      // Switch back to talent
      component.onRegisterTalent();
      expect(component.currentForm).toBe("talent");

      // Switch to company again
      component.onRegisterCompany();
      expect(component.currentForm).toBe("company");
    });
  });

  // Testing DOM interactions if needed
  describe("Template interactions", () => {
    it("should have the correct form type in the template", () => {
      // Check initial state
      expect(component.currentForm).toBe("talent");

      // Switch to company form
      component.onRegisterCompany();
      fixture.detectChanges();

      expect(component.currentForm).toBe("company");
    });
  });
});
