import { Component, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "../../../shared/models/app.state.interface";
import * as AuthActions from "../../auth-store/auth.actions";
import * as AuthSelectors from "../../auth-store/auth.selectors";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnDestroy {
  forgotPasswordForm: FormGroup = this.initForgotPasswordForm();
  otpForm: FormGroup = this.initOtpForm();
  isEmailSubmitted = false;
  showOtpScreen = false;
  verificationSuccessful = false;
  verificationFailed = false;
  timeLeft = 599;
  displayTime = "09:59";
  timerExpired = false;
  interval: ReturnType<typeof setInterval> | null = null;
  tryNewEmailClicked = false;
  previousEmail = "";
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly store: Store<AppState>,
  ) {
    this.loading$ = this.store.select(AuthSelectors.selectIsLoading);
    this.error$ = this.store.select(AuthSelectors.selectError);

    this.store
      .select(AuthSelectors.selectPasswordResetOtpVerified)
      .pipe(takeUntil(this.destroy$))
      .subscribe((verified) => {
        if (verified) {
          this.verificationSuccessful = true;
          this.verificationFailed = false;
          this.clearTimer();
        }
      });
  }

  private initForgotPasswordForm(): FormGroup {
    return this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  private initOtpForm(): FormGroup {
    return this.fb.group({
      otp: this.fb.array(
        Array(5)
          .fill("")
          .map(() =>
            this.fb.control("", [
              Validators.required,
              Validators.pattern(/[0-9]/),
            ]),
          ),
      ),
    });
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public clearTimer(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  public formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  public startCountdown(): void {
    this.clearTimer();
    this.timeLeft = 599;
    this.timerExpired = false;
    this.displayTime = this.formatTime(this.timeLeft);

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.displayTime = this.formatTime(this.timeLeft);
      } else {
        this.timerExpired = true;
        this.clearTimer();
      }
    }, 1000);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.forgotPasswordForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get("email")?.value;
      this.store.dispatch(AuthActions.forgotPassword({ email }));
      this.isEmailSubmitted = true;
      this.tryNewEmailClicked = false;
      this.previousEmail = email;
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  showOtpForm(): void {
    this.showOtpScreen = true;
    this.startCountdown();
  }

  onOtpInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const nextInput = input.nextElementSibling as HTMLInputElement;
    const prevInput = input.previousElementSibling as HTMLInputElement;

    if (input.value.length > 0 && nextInput && event.key !== "Backspace") {
      nextInput.focus();
    } else if (event.key === "Backspace" && prevInput) {
      prevInput.focus();
    }
  }

  verifyOtp(): void {
    if (this.otpForm.valid) {
      const otpValue = this.otpControls.value.join("");
      this.store.dispatch(
        AuthActions.verifyPasswordResetOtp({
          email: this.previousEmail,
          otp: otpValue,
        }),
      );
    } else {
      this.otpForm.markAllAsTouched();
    }
  }

  createNewPassword(): void {
    this.router.navigate(["/auth/reset-password"]);
  }

  requestNewCode(): void {
    this.store.dispatch(
      AuthActions.requestNewOtp({ email: this.previousEmail }),
    );
    this.otpControls.controls.forEach((control) => {
      control.enable();
      control.reset();
    });
    this.startCountdown();
    this.verificationFailed = false;
  }

  resetForm(): void {
    this.isEmailSubmitted = true;
    this.tryNewEmailClicked = true;
    this.showOtpScreen = false;
    this.verificationSuccessful = false;
    this.verificationFailed = false;
    this.clearTimer();
    this.forgotPasswordForm.reset();
    this.otpForm.reset();
  }

  openMailApp(): void {
    window.open("mailto:", "_blank");
  }

  get otpControls(): FormArray<FormControl> {
    return this.otpForm.get("otp") as FormArray<FormControl>;
  }

  handleBackNavigation(): void {
    if (this.showOtpScreen) {
      this.showOtpScreen = false;
      this.clearTimer();
      this.otpForm.reset();
      this.verificationFailed = false;
    } else if (this.isEmailSubmitted) {
      this.isEmailSubmitted = false;
      this.tryNewEmailClicked = false;
      this.forgotPasswordForm.reset();
    } else {
      this.router.navigate(["/auth/login"]);
    }
  }

  getBackButtonText(): string {
    if (this.showOtpScreen) {
      return "Back ";
    } else if (this.isEmailSubmitted) {
      return "Back ";
    }
    return "Back";
  }

  shouldShowBackButton(): boolean {
    return !this.verificationSuccessful;
  }

  cancelTryNewEmail(): void {
    this.tryNewEmailClicked = false;
    this.isEmailSubmitted = true;
    if (this.previousEmail) {
      this.forgotPasswordForm.patchValue({
        email: this.previousEmail,
      });
    }
  }
}
