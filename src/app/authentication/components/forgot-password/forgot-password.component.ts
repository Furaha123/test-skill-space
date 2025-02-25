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
import { ToastrService } from "ngx-toastr";

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
  statusMessage = "";
  private destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly store: Store<AppState>,
    private readonly toastr: ToastrService,
  ) {
    this.loading$ = this.store.select(AuthSelectors.selectIsLoading);
    this.error$ = this.store.select(AuthSelectors.selectError);

    this.store
      .select(AuthSelectors.selectError)
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.statusMessage = error;
          this.toastr.error(error);
          this.isEmailSubmitted = false;
        }
      });

    this.store
      .select(AuthSelectors.selectPasswordResetOtpVerified)
      .pipe(takeUntil(this.destroy$))
      .subscribe((verified) => {
        if (verified) {
          this.verificationSuccessful = true;
          this.verificationFailed = false;
          this.clearTimer();
          this.statusMessage = "Your verification was successful";
          this.toastr.success("OTP verification successful!");
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
      const email = this.forgotPasswordForm.get("email")?.value?.trim();

      if (!email) {
        this.statusMessage = "Please enter a valid email address";
        this.toastr.error("Please enter a valid email address");
        return;
      }

      this.store.dispatch(AuthActions.forgotPassword({ email }));
      this.previousEmail = email;
      this.isEmailSubmitted = true;
      this.tryNewEmailClicked = false;
      this.statusMessage = "";
    } else {
      this.forgotPasswordForm.markAllAsTouched();
      this.statusMessage = "Please enter a valid email address";
      this.toastr.error("Please enter a valid email address");
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

    // Only allow numbers
    if (!/^\d*$/.test(input.value)) {
      input.value = "";
      return;
    }

    if (input.value.length > 0 && nextInput && event.key !== "Backspace") {
      nextInput.focus();
    } else if (event.key === "Backspace" && prevInput) {
      prevInput.focus();
    }
  }

  verifyOtp(): void {
    if (this.otpForm.valid) {
      const otpValue = this.otpControls.value.join("");

      if (this.timerExpired) {
        this.statusMessage = "OTP has expired. Please request a new one.";
        this.toastr.error("OTP has expired. Please request a new one.");
        this.otpForm.reset();
        return;
      }

      if (!/^\d{5}$/.test(otpValue)) {
        this.statusMessage = "Please enter a valid 5-digit OTP";
        this.toastr.error("Please enter a valid 5-digit OTP");
        return;
      }

      this.store.dispatch(
        AuthActions.verifyPasswordResetOtp({
          otp: otpValue,
        }),
      );

      this.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
        if (error) {
          this.verificationFailed = true;
          this.statusMessage = "OTP verification failed. Please try again.";
          this.otpForm.reset();
          this.toastr.error("OTP verification failed. Please try again.");
        }
      });
    } else {
      this.otpForm.markAllAsTouched();
      this.statusMessage = "Please fill in all OTP digits";
      this.toastr.error("Please fill in all OTP digits");
    }
  }

  createNewPassword(): void {
    this.router.navigate(["/auth/reset-password"]);
  }

  requestNewCode(): void {
    if (this.previousEmail) {
      this.store.dispatch(
        AuthActions.requestNewOtp({ email: this.previousEmail }),
      );
      this.otpForm.reset();
      this.startCountdown();
      this.verificationFailed = false;
      this.timerExpired = false;
    }
  }

  resetForm(): void {
    this.isEmailSubmitted = false;
    this.tryNewEmailClicked = true;
    this.showOtpScreen = false;
    this.verificationSuccessful = false;
    this.verificationFailed = false;
    this.clearTimer();
    this.forgotPasswordForm.reset();
    this.otpForm.reset();
    this.statusMessage = "";
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
    } else {
      this.router.navigate(["/auth/login"]);
    }
  }

  getBackButtonText(): string {
    if (this.showOtpScreen || this.isEmailSubmitted) {
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
    this.statusMessage = "";
  }
}
