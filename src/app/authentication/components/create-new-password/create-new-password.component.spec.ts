import { TestBed, ComponentFixture } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { CreateNewPasswordComponent } from "./create-new-password.component";
import { of } from "rxjs";

describe("CreateNewPasswordComponent", () => {
  let component: CreateNewPasswordComponent;
  let fixture: ComponentFixture<CreateNewPasswordComponent>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    // Fully mock the Router object
    mockRouter = {
      navigate: jest.fn(),
      events: of(),
      routerState: {},
      errorHandler: jest.fn(),
      navigated: false,
      serializeUrl: jest.fn(),
      createUrlTree: jest.fn(),
      parseUrl: jest.fn(),
      isActive: jest.fn(),
      url: "",
      resetConfig: jest.fn(),
      navigateByUrl: jest.fn(),
      onSameUrlNavigation: "reload",
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [CreateNewPasswordComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form with default values", () => {
    expect(component.passwordForm).toBeDefined();
    expect(component.passwordForm.get("newPassword")?.value).toBe("");
    expect(component.passwordForm.get("confirmPassword")?.value).toBe("");
  });

  it("should validate password format correctly and set showPasswordWarning", () => {
    const newPasswordControl = component.passwordForm.get("newPassword");

    // Weak password format
    newPasswordControl?.setValue("weakpass");
    component.validatePassword();
    expect(component.showPasswordWarning).toBe(true);

    // Strong password format
    newPasswordControl?.setValue("ValidPass99%");
    component.validatePassword();
    expect(component.showPasswordWarning).toBe(false);
  });

  it("should detect reused old password", () => {
    const newPasswordControl = component.passwordForm.get("newPassword");

    newPasswordControl?.setValue("Coutipati99%");
    component.validatePassword();
    expect(component.showPasswordError).toBe(true);

    newPasswordControl?.setValue("NewStrongPass99%");
    component.validatePassword();
    expect(component.showPasswordError).toBe(false);
  });

  it("should show success message for valid matching passwords", () => {
    const newPasswordControl = component.passwordForm.get("newPassword");
    const confirmPasswordControl =
      component.passwordForm.get("confirmPassword");
    newPasswordControl?.setValue("ValidPass99%");
    confirmPasswordControl?.setValue("ValidPass99%");
    component.validatePassword();
    expect(component.showSuccessMessage).toBe(true);
    confirmPasswordControl?.setValue("MismatchPass");
    component.validatePassword();
    expect(component.showSuccessMessage).toBe(false);
  });

  it("should handle form submission correctly", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation();
    component.passwordForm.get("newPassword")?.setValue("");
    component.passwordForm.get("confirmPassword")?.setValue("");
    component.onSubmit();
    expect(alertSpy).not.toHaveBeenCalled();
    component.passwordForm.get("newPassword")?.setValue("Coutipati99%");
    component.passwordForm.get("confirmPassword")?.setValue("Coutipati99%");
    component.validatePassword();
    component.onSubmit();
    expect(alertSpy).toHaveBeenCalledWith("You cannot reuse the old password!");

    // Weak password
    component.passwordForm.get("newPassword")?.setValue("weakpass");
    component.passwordForm.get("confirmPassword")?.setValue("weakpass");
    component.validatePassword();
    component.onSubmit();
    expect(alertSpy).toHaveBeenCalledWith(
      "Please ensure the password meets the requirements!",
    );

    // Mismatched passwords
    component.passwordForm.get("newPassword")?.setValue("StrongPass99%");
    component.passwordForm.get("confirmPassword")?.setValue("MismatchPass");
    component.validatePassword();
    component.onSubmit();
    expect(alertSpy).toHaveBeenCalledWith("Passwords do not match!");

    // Valid submission
    component.passwordForm.get("newPassword")?.setValue("ValidPass99%");
    component.passwordForm.get("confirmPassword")?.setValue("ValidPass99%");
    component.validatePassword();
    component.onSubmit();
    expect(component.showSuccessMessage).toBe(true);
  });

  it("should redirect to login when redirectToLogin is called", () => {
    component.redirectToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/auth/login"]);
  });
});
