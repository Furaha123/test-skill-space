import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TalentRegistrationFormComponent } from "./talent-registration-form.component";
import { SharedModule } from "../../../shared/shared.module";
import { StoreModule } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

describe("TalentRegistrationFormComponent", () => {
  let component: TalentRegistrationFormComponent;
  let fixture: ComponentFixture<TalentRegistrationFormComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockStore: unknown;

  const initialState = {
    auth: {
      isLoading: false,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TalentRegistrationFormComponent],

      imports: [ReactiveFormsModule, FormsModule, SharedModule, StoreModule.forRoot({})],

      providers: [provideMockStore({ initialState })],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TalentRegistrationFormComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Form Initialization", () => {
    it("should initialize the form with empty fields", () => {
      expect(component.form).toBeDefined();
      expect(component.form.get("userName")?.value).toBe("");
      expect(component.form.get("email")?.value).toBe("");
      expect(component.form.get("phoneNumber")?.value).toBe("");
      expect(component.form.get("password")?.value).toBe("");
      expect(component.form.get("passwordConfirm")?.value).toBe("");
    });
  });

  describe("Form Validation", () => {
    it("should validate password confirmation", () => {
      component.form.patchValue({
        password: "Password123!",
        passwordConfirm: "DifferentPassword123!",
      });
      component.submitted = true;
      expect(component.isControlInvalid("passwordConfirm")).toBeTruthy();
    });

    it("should validate email format", () => {
      const emailControl = component.form.get("email");
      emailControl?.setValue("invalid-email");
      expect(emailControl?.valid).toBeFalsy();

      emailControl?.setValue("valid@email.com");
      expect(emailControl?.valid).toBeTruthy();
    });

    it("should validate phone number pattern", () => {
      const phoneControl = component.form.get("phoneNumber");
      phoneControl?.setValue("123");
      expect(phoneControl?.valid).toBeFalsy();

      phoneControl?.setValue("+1234567890");
      expect(phoneControl?.valid).toBeTruthy();
    });
  });

  describe("Component Lifecycle", () => {
    it("should unsubscribe without errors during destruction", () => {
      component.subscription = new Subscription();
      const unsubscribeSpy = jest.spyOn(component.subscription, "unsubscribe");

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it("should not attempt to unsubscribe if no subscription exists", () => {
      // Reset subscription to null
      component.subscription = null;

      // This should not throw any errors
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe("Loading State", () => {
    it("should have an observable for loading state", () => {
      expect(component.isLoading$).toBeDefined();
    });
  });
});
