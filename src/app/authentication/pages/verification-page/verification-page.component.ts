import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../core/services/auth/auth-service.service";
import { Store } from "@ngrx/store";
import * as UserSelectors from "../../auth-store/auth.selectors";
import { Observable, Subject, takeUntil } from "rxjs";
import { Talent } from "../../../shared/models/talent.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { AppState } from "../../../shared/models/app.state.interface";
import { Company } from "../../../shared/models/company.interface";

@Component({
  selector: "app-verification-page",
  templateUrl: "./verification-page.component.html",
  styleUrl: "./verification-page.component.scss",
})
export class VerificationPageComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private timer?: ReturnType<typeof setInterval>;

  verrificationError = false;
  isLoading = false;
  expiryTime = 600; // 10 minutes
  codeExpired = false;
  currentScreen = "checkMailScreen";
  userEmail = "";
  form: FormGroup;
  user$: Observable<Talent | Company | null> = this.store.select(
    UserSelectors.selectUser,
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly store: Store<AppState>,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {
    this.form = this.fb.group({
      field1: ["", [Validators.required, Validators.maxLength(1)]],
      field2: ["", [Validators.required, Validators.maxLength(1)]],
      field3: ["", [Validators.required, Validators.maxLength(1)]],
      field4: ["", [Validators.required, Validators.maxLength(1)]],
      field5: ["", [Validators.required, Validators.maxLength(1)]],
    });
  }

  ngOnInit(): void {
    this.subscribeToUserEmail();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private subscribeToUserEmail(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.userEmail = data?.email || "";
    });
  }

  onContinue(): void {
    this.currentScreen = "OTP_Screen";
    this.startCountdown();
  }

  private startCountdown(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.expiryTime -= 1;
      if (this.expiryTime <= 0) {
        this.codeExpired = true;
        if (this.timer) {
          clearInterval(this.timer);
        }
      }
    }, 1000);
  }

  OnVerifyOTP(): void {
    this.isLoading = true;
    const { field1, field2, field3, field4, field5 } = this.form.getRawValue();
    const otp = `${field1}${field2}${field3}${field4}${field5}`;

    this.authService
      .verifyOTP({ email: this.userEmail, otp })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.verrificationError = false;
          this.toastr.success("Registration Approved", "Success");
          this.router.navigateByUrl("company/company-success");
        },
        error: (err: unknown) => {
          this.isLoading = false;
          this.verrificationError = true;
          this.toastr.error(
            err instanceof HttpErrorResponse
              ? "Please try again"
              : "Oops!, something went wrong",
            "Error",
          );
        },
      });
  }

  onRequestNewCode(): void {
    if (!this.userEmail) {
      this.toastr.error("Email is required", "Error");
      return;
    }

    this.isLoading = true;
    this.authService
      .requestNewOTP(this.userEmail)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.verrificationError = false;
          this.toastr.success(
            "New OTP Was generated Successfully, please open your mail to check it out",
            "Success",
          );
          this.resetCountdown();
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error(
            "Unable to generate another OTP. Please try registering again?",
            "Error",
          );
          this.router.navigateByUrl("/auth/register");
        },
      });
  }

  private resetCountdown(): void {
    this.expiryTime = 180;
    this.codeExpired = false;
    this.startCountdown();
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.expiryTime / 60);
    const seconds = this.expiryTime % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
}
