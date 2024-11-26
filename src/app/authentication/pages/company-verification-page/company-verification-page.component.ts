import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Observable, Subject, takeUntil } from "rxjs";

import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Talent } from "../../../shared/models/talent.interface";
import { Company } from "../../../shared/models/company.interface";
import { Store } from "@ngrx/store";
import { AppState } from "../../../shared/models/app.state.interface";
import { AuthService } from "../../../core/services/auth/auth-service.service";
import { HttpErrorResponse } from "@angular/common/http";
import * as AuthSelectors from "../../auth-store/auth.selectors";

type ScreenType = "checkMailScreen" | "successPage" | "OTP_Screen";

@Component({
  selector: "app-company-verification-page",
  templateUrl: "./company-verification-page.component.html",
  styleUrls: ["./company-verification-page.component.scss"],
})
export class CompanyVerificationPageComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  timer?: ReturnType<typeof setInterval>;

  readonly OTP_LENGTH = 5;
  readonly OTP_EXPIRY_TIME = 600; // 10 minutes

  verificationError = false;
  isLoading = false;
  expiryTime = this.OTP_EXPIRY_TIME;
  codeExpired = false;
  currentScreen: ScreenType = "checkMailScreen";
  userEmail = "";

  form: FormGroup;
  user$: Observable<Talent | Company | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.user$ = this.store.select(AuthSelectors.selectUser);
    this.form = this.createOtpForm();
  }

  ngOnInit(): void {
    this.subscribeToUserEmail();
    this.startCountdown();
  }

  private createOtpForm(): FormGroup {
    return this.fb.group({
      otp: this.fb.array(
        Array(this.OTP_LENGTH)
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

  private subscribeToUserEmail(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.userEmail = data?.email || "";
    });
  }

  private startCountdown(): void {
    this.clearExistingTimer();
    this.timer = setInterval(() => {
      this.expiryTime -= 1;
      if (this.expiryTime <= 1) {
        this.handleCodeExpiry();
      }
    }, 1000);
  }

  private clearExistingTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private handleCodeExpiry(): void {
    this.codeExpired = true;
    this.clearExistingTimer();
  }

  private resetCountdown(): void {
    this.expiryTime = this.OTP_EXPIRY_TIME;
    this.codeExpired = false;
    this.startCountdown();
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.expiryTime / 60);
    const seconds = this.expiryTime % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  get otpControls(): FormArray<FormControl> {
    return this.form.get("otp") as FormArray<FormControl>;
  }

  onContinue(): void {
    this.currentScreen = "OTP_Screen";
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

  onSubmit(): void {
    this.isLoading = true;
    this.resetCountdown();
    const { otp } = this.form.getRawValue();

    this.authService
      .verifyOTP({ email: this.userEmail, otp: otp.join("") })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.handleSuccessfulVerification();
        },
        error: (err: HttpErrorResponse) => {
          this.handleVerificationError(err);
        },
      });
  }

  private handleSuccessfulVerification(): void {
    this.isLoading = false;
    this.verificationError = false;
    this.toastr.success("Registration Approved", "Success");
    this.router.navigateByUrl("/auth/login");
  }

  private handleVerificationError(err: HttpErrorResponse): void {
    this.verificationError = true;
    this.isLoading = false;
    const errorMessage =
      err instanceof HttpErrorResponse
        ? "Please try again"
        : "Oops!, something went wrong";
    this.toastr.error(errorMessage, "Error");
  }

  onRequestNewCode(): void {
    this.isLoading = true;
    this.clearExistingTimer();

    if (!this.userEmail) {
      this.toastr.error("Something went wrong, please try again.", "Error");
      return;
    }

    this.authService
      .requestNewOTP(this.userEmail)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.handleSuccessfulNewCodeRequest();
        },
        error: () => {
          this.handleNewCodeRequestError();
        },
      });
  }

  private handleSuccessfulNewCodeRequest(): void {
    this.isLoading = false;
    this.verificationError = false;
    this.toastr.success(
      "New OTP Was generated Successfully, please open your mail to check it out",
      "Success",
    );
    this.resetCountdown();
  }

  private handleNewCodeRequestError(): void {
    this.isLoading = false;
    this.toastr.error(
      "Unable to generate another OTP. Please try registering again?",
      "Error",
    );
    this.router.navigateByUrl("/auth/register");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearExistingTimer();
  }
}
