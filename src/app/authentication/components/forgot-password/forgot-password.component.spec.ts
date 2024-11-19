import { TestBed, ComponentFixture } from "@angular/core/testing";
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password.component";

describe("ForgotPasswordComponent", () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    // Fully mock Router with Jest
    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize forms with default values", () => {
    expect(component.forgotPasswordForm).toBeDefined();
    expect(component.forgotPasswordForm.get("email")?.value).toBe("");
    expect(component.otpControls.length).toBe(6);
    component.otpControls.controls.forEach((control) =>
      expect(control.value).toBe(""),
    );
  });

  it("should validate email field correctly", () => {
    const emailControl = component.forgotPasswordForm.get("email");

    emailControl?.setValue("invalidemail");
    expect(emailControl?.invalid).toBe(true);

    emailControl?.setValue("test@example.com");
    expect(emailControl?.valid).toBe(true);
  });

  it("should mark email as touched if form is invalid on submission", () => {
    const emailControl = component.forgotPasswordForm.get("email");
    jest.spyOn(emailControl!, "markAsTouched");

    component.onSubmit();
    expect(emailControl?.markAsTouched).toHaveBeenCalled();
  });

  it("should handle valid email submission and show OTP form", () => {
    const emailControl = component.forgotPasswordForm.get("email");
    emailControl?.setValue("test@example.com");

    component.onSubmit();
    expect(component.isEmailSubmitted).toBe(true);

    component.showOtpForm();
    expect(component.showOtpScreen).toBe(true);
  });

  it("should start and handle countdown timer correctly", () => {
    jest.useFakeTimers();

    component.startCountdown();
    expect(component.timeLeft).toBe(599);
    expect(component.timerExpired).toBe(false);

    jest.advanceTimersByTime(599000); // Simulate 10 minutes
    expect(component.timeLeft).toBe(0);

    jest.runOnlyPendingTimers();
    expect(component.timerExpired).toBe(true);

    jest.useRealTimers();
  });

  it("should clear the timer when startCountdown is called again", () => {
    jest.useFakeTimers();
    component.startCountdown();

    jest.advanceTimersByTime(1000);
    expect(component.timeLeft).toBe(598);

    component.startCountdown();
    expect(component.timeLeft).toBe(599); // Timer restarted

    jest.useRealTimers();
  });

  it("should clear the timer on ngOnDestroy", () => {
    jest.useFakeTimers();
    component.startCountdown();

    expect(component.interval).not.toBeNull();
    component.ngOnDestroy();
    expect(component.interval).toBeNull();
    jest.useRealTimers();
  });

  it("should handle OTP input navigation correctly", () => {
    const mockEvent = (key: string, target: HTMLInputElement) =>
      ({
        key,
        target,
        preventDefault: jest.fn(),
      }) as unknown as KeyboardEvent;

    const otpInput = component.otpControls.at(0) as FormControl;
    const nextInput = component.otpControls.at(1) as FormControl;
    otpInput.setValue("1");

    const event = mockEvent("1", document.createElement("input"));
    component.onOtpInput(event);
    expect(nextInput.touched).toBeFalsy();
  });

  it("should verify OTP correctly", () => {
    component.otpControls.controls.forEach((control, index) => {
      control.setValue(component.predefinedOtp[index]);
    });

    component.verifyOtp();
    expect(component.verificationSuccessful).toBe(true);
    expect(component.verificationFailed).toBe(false);

    component.otpControls.controls[0].setValue("9");
    component.verifyOtp();
    expect(component.verificationFailed).toBe(true);
    expect(component.verificationSuccessful).toBe(false);
  });

  it("should request new OTP and reset inputs", () => {
    jest.useFakeTimers();
    const resetSpy = jest.spyOn(component.otpControls.controls[0], "reset");
    const enableSpy = jest.spyOn(component.otpControls.controls[0], "enable");
    const startCountdownSpy = jest.spyOn(component, "startCountdown");

    component.requestNewCode();

    expect(resetSpy).toHaveBeenCalled();
    expect(enableSpy).toHaveBeenCalled();
    expect(startCountdownSpy).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("should reset the form to its initial state", () => {
    component.isEmailSubmitted = true;
    component.showOtpScreen = true;
    component.verificationSuccessful = true;
    component.verificationFailed = true;

    const clearTimerSpy = jest.spyOn(
      component as unknown as { clearTimer: () => void },
      "clearTimer",
    );

    component.resetForm();

    expect(clearTimerSpy).toHaveBeenCalled();
    expect(component.isEmailSubmitted).toBe(false);
    expect(component.showOtpScreen).toBe(false);
    expect(component.verificationSuccessful).toBe(false);
    expect(component.verificationFailed).toBe(false);

    expect(component.forgotPasswordForm.get("email")?.value).toBe(null);
    component.otpControls.controls.forEach((control) =>
      expect(control.value).toBe(null),
    );
  });

  it("should navigate to reset-password route", () => {
    component.createNewPassword();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/auth/reset-password"]);
  });

  it("should open mail application", () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation();
    component.openMailApp();
    expect(openSpy).toHaveBeenCalledWith("mailto:", "_blank");
  });
});
