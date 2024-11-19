import { Component, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnDestroy {
  forgotPasswordForm: FormGroup;
  otpForm: FormGroup;
  isEmailSubmitted = false;
  showOtpScreen = false;
  verificationSuccessful = false;
  verificationFailed = false;
  timeLeft = 599;
  displayTime = "09:59";
  timerExpired = false;
  interval: ReturnType<typeof setInterval> | null = null;
  predefinedOtp = "123456";

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      otp: this.fb.array(
        Array(6)
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
      this.isEmailSubmitted = true;
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
      if (otpValue === this.predefinedOtp) {
        this.verificationSuccessful = true;
        this.verificationFailed = false;
        this.clearTimer();
      } else {
        this.verificationFailed = true;
        this.verificationSuccessful = false;
      }
    } else {
      this.otpForm.markAllAsTouched();
    }
  }

  createNewPassword(): void {
    this.router.navigate(["/auth/reset-password"]);
  }

  requestNewCode(): void {
    this.otpControls.controls.forEach((control) => {
      control.enable();
      control.reset();
    });
    this.startCountdown();
  }

  resetForm(): void {
    this.isEmailSubmitted = false;
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
}
